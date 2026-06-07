import Razorpay from "razorpay";
import crypto from "crypto";

/** Returns a configured Razorpay instance (created on demand so build-time is safe) */
export function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
  }
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * Verify the Razorpay payment signature returned after a successful payment.
 * razorpay_order_id + "|" + razorpay_payment_id — signed with key_secret
 */
export function verifyRazorpaySignature(params: {
  razorpay_order_id:   string;
  razorpay_payment_id: string;
  razorpay_signature:  string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const body   = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === params.razorpay_signature;
}
