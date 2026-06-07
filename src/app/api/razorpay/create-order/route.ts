import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = getRazorpay();

    // Razorpay amount is in paise (1 INR = 100 paise)
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency,
      receipt:  receipt || `order_${Date.now()}`,
      notes: {
        userId: user.id,
        email:  user.email,
      },
    });

    return NextResponse.json({
      id:       order.id,
      amount:   order.amount,
      currency: order.currency,
      receipt:  order.receipt,
    });
  } catch (e: any) {
    if (e instanceof Response) return e;
    console.error("Razorpay order creation error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
