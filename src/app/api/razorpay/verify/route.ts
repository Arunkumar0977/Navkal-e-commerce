import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber, // our internal order number to mark as paid
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay payment fields" },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed — invalid signature" },
        { status: 400 }
      );
    }

    // Mark the order as paid in DB
    if (orderNumber) {
      await prisma.order.updateMany({
        where: {
          orderNumber,
          userId: user.id,
        },
        data: {
          paymentStatus:   "PAID",
          paymentIntentId: razorpay_payment_id,
          status:          "PROCESSING",
        },
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
    });
  } catch (e: any) {
    if (e instanceof Response) return e;
    console.error("Razorpay verify error:", e);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
