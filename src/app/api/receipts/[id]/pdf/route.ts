import { NextResponse } from "next/server";
import { getDb, checkAuth } from "@/app/actions";
import { generateReceiptPdfBuffer } from "@/app/utils/receiptGenerator";
import { hasReceiptAccess } from "@/app/utils/security";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const receiptNumber = resolvedParams.id;

    if (!receiptNumber) {
      return NextResponse.json({ error: "Missing receipt ID." }, { status: 400 });
    }

    // 1. Fetch Order Metadata
    const db = await getDb();
    const order = db.orders?.find((o) => o.receiptNumber === receiptNumber);
    if (!order) {
      return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
    }

    // 2. Validate Security Access (Admin or Verified Receipt Owner)
    const isAdmin = await checkAuth();
    const isOwner = await hasReceiptAccess(receiptNumber);

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Unauthorized access. You do not have permission to view this receipt." },
        { status: 403 }
      );
    }

    // 3. Generate PDF Buffer Dynamically (No persistent file storage)
    const pdfBuffer = await generateReceiptPdfBuffer(order);

    // 4. Stream PDF back to browser
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Kohinoor_Receipt_${receiptNumber}.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("[DYNAMIC PDF STREAM ERROR] Failed to stream PDF:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
