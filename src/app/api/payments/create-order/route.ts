import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, currency = "INR", receipt } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if key is placeholder or missing, fallback to simulator mode
    if (!keyId || !keySecret || keyId.startsWith("your_")) {
      const mockOrder = {
        id: `order_mock_${Date.now()}`,
        entity: "order",
        amount: amount * 100, // Razorpay amounts are in paise
        amount_paid: 0,
        amount_due: amount * 100,
        currency,
        receipt,
        status: "created",
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
        isMock: true,
      };
      return NextResponse.json(mockOrder);
    }

    // Call real Razorpay REST API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay amount is in paise (₹1 = 100 paise)
        currency,
        receipt,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("[RAZORPAY ERROR] Failed to create order:", data);
      return NextResponse.json(
        { error: data.error?.description || "Failed to create payment order" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[CREATE ORDER API ERROR] Failed:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
