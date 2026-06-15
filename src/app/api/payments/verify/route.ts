import { NextResponse } from "next/server";
import { verifyRazorpayPaymentAction } from "@/app/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, checkoutData } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !checkoutData) {
      return NextResponse.json({ error: "Missing required verification fields." }, { status: 400 });
    }

    // Run verification server action which updates DB and dispatches receipt email
    const result = await verifyRazorpayPaymentAction({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature: razorpay_signature || "",
      checkoutData,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Payment verification failed." }, { status: 400 });
    }

    return NextResponse.json({ success: true, receiptNumber: result.receiptNumber });
  } catch (err: any) {
    console.error("[PAYMENT VERIFICATION API ERROR] Failed:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
