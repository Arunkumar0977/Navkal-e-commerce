"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, CreditCard, Banknote, Lock, CheckCircle2,
  IndianRupee, Smartphone,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, calcShipping, calcTax } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

/* ─── Razorpay types ─────────────────────────────────────────────────────── */
declare global {
  interface Window {
    Razorpay: any;
  }
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const STEPS  = ["Address", "Payment", "Review"];
const STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

interface AddressForm {
  fullName: string; phone: string; street: string;
  city: string; state: string; pincode: string; country: string;
}

/* ─── Load Razorpay checkout.js lazily ───────────────────────────────────── */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function CheckoutPage() {
  const router   = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { items, getTotalPrice, discount, couponCode, clearCart } = useCartStore();

  const [step, setStep]   = useState(0);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
  const [address, setAddress] = useState<AddressForm>({
    fullName: user?.fullName || "",
    phone: "", street: "", city: "", state: "", pincode: "", country: "India",
  });

  const subtotal = getTotalPrice();
  const shipping = calcShipping(subtotal);
  const tax      = calcTax(subtotal - discount);
  const total    = subtotal - discount + shipping + tax;

  /* Guard: loading */
  if (!isLoaded) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blush-dark border-t-transparent rounded-full animate-spin" />
    </div>
  );

  /* Guard: not signed in */
  if (!isSignedIn) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="text-5xl">🛍️</p>
      <h2 className="font-cormorant text-2xl font-semibold" style={{ color: "#5c3a2e" }}>
        Sign in to checkout
      </h2>
      <p className="text-sm" style={{ color: "#8a6355" }}>
        Create a free account or sign in to place your order.
      </p>
      <SignInButton mode="modal">
        <button className="btn-primary px-8">Sign In / Create Account</button>
      </SignInButton>
    </div>
  );

  /* Guard: empty cart */
  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p style={{ color: "#8a6355" }}>Your cart is empty</p>
      <Link href="/shop" className="btn-primary">Shop Now</Link>
    </div>
  );

  /* ── Validation ────────────────────────────────────────────────────────── */
  const validate = (): boolean => {
    const required: (keyof AddressForm)[] = ["fullName","phone","street","city","state","pincode"];
    for (const field of required) {
      if (!address[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{10}$/.test(address.phone))  { toast.error("Enter a valid 10-digit phone number"); return false; }
    if (!/^\d{6}$/.test(address.pincode)) { toast.error("Enter a valid 6-digit pincode");        return false; }
    return true;
  };

  /* ── Create order in DB ────────────────────────────────────────────────── */
  const createDbOrder = async (paymentId?: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(i => ({
          productId: i.id, quantity: i.quantity, price: i.price, color: i.color,
        })),
        subtotal, shipping, tax, discount, total,
        couponCode, paymentMethod, shippingAddress: address,
        ...(paymentId && { razorpay_payment_id: paymentId }),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Order creation failed");
    return data as { orderNumber: string };
  };

  /* ── Place COD order ───────────────────────────────────────────────────── */
  const placeCODOrder = async () => {
    setPlacing(true);
    try {
      const { orderNumber } = await createDbOrder();
      clearCart();
      router.push(`/order-success?order=${orderNumber}`);
    } catch (err: any) {
      toast.error(err.message || "Order failed. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  /* ── Place Razorpay order ──────────────────────────────────────────────── */
  const placeRazorpayOrder = async () => {
    setPlacing(true);

    // 1. Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Please check your internet connection.");
      setPlacing(false);
      return;
    }

    // 2. Create Razorpay order on server
    let rzpOrderId: string;
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      rzpOrderId = data.id;
    } catch (err: any) {
      toast.error(err.message || "Could not initiate payment. Try again.");
      setPlacing(false);
      return;
    }

    // 3. Open Razorpay checkout
    const options = {
      key:          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount:       Math.round(total * 100),
      currency:     "INR",
      name:         "NavkalaCrochet 🧶",
      description:  "Handmade with Love",
      image:        "/logo.png",
      order_id:     rzpOrderId,
      prefill: {
        name:    user?.fullName  || address.fullName,
        email:   user?.primaryEmailAddress?.emailAddress || "",
        contact: address.phone,
      },
      notes: {
        shipping_address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      },
      theme: { color: "#8B4B5A" },
      modal: {
        ondismiss: () => {
          setPlacing(false);
          toast("Payment cancelled. Your cart is safe!", { icon: "🛒" });
        },
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id:   string;
        razorpay_signature:  string;
      }) => {
        // 4. Verify on server
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error);

          // 5. Create DB order (marked as PAID)
          const { orderNumber } = await createDbOrder(response.razorpay_payment_id);
          clearCart();
          router.push(`/order-success?order=${orderNumber}`);
        } catch (err: any) {
          toast.error(err.message || "Payment verification failed. Contact support.");
          setPlacing(false);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp: any) => {
      toast.error(`Payment failed: ${resp.error.description}`);
      setPlacing(false);
    });
    rzp.open();
    setPlacing(false); // re-enable button while modal is open
  };

  /* ── Place order dispatcher ───────────────────────────────────────────── */
  const placeOrder = () => {
    if (paymentMethod === "COD") placeCODOrder();
    else placeRazorpayOrder();
  };

  /* ─── UI ─────────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-cormorant text-4xl font-semibold mb-8" style={{ color: "#5c3a2e" }}>
        Checkout
      </h1>

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? "text-[#8B4B5A]" : "text-[#c4a882]"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all
                ${i < step  ? "bg-[#8B4B5A] border-[#8B4B5A] text-white"
                : i === step ? "border-[#8B4B5A] text-[#8B4B5A]"
                :               "border-[#f0d9d0] text-[#c4a882]"}`}>
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className="hidden sm:block text-sm font-medium">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-2 ${i < step ? "bg-[#8B4B5A]" : "bg-[#f0d9d0]"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Main form ── */}
        <div className="lg:col-span-2">

          {/* Step 0 — Address */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-soft p-6">
              <h2 className="font-cormorant text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#5c3a2e" }}>
                <MapPin size={20} style={{ color: "#8B4B5A" }} /> Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#5c3a2e" }}>Full Name *</label>
                  <input value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })}
                    className="input-soft" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#5c3a2e" }}>Phone *</label>
                  <input type="tel" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })}
                    className="input-soft" placeholder="10-digit mobile number" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#5c3a2e" }}>Pincode *</label>
                  <input value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })}
                    className="input-soft" placeholder="6-digit pincode" maxLength={6} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#5c3a2e" }}>Street Address *</label>
                  <textarea value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })}
                    className="input-soft resize-none" rows={3} placeholder="House no., Street, Area, Landmark" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#5c3a2e" }}>City *</label>
                  <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="input-soft" placeholder="City" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#5c3a2e" }}>State *</label>
                  <select value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })}
                    className="input-soft">
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => { if (validate()) setStep(1); }} className="btn-primary px-8">
                  Continue to Payment
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-soft p-6">
              <h2 className="font-cormorant text-2xl font-semibold mb-6 flex items-center gap-2" style={{ color: "#5c3a2e" }}>
                <CreditCard size={20} style={{ color: "#8B4B5A" }} /> Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                {/* Cash on Delivery */}
                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${paymentMethod === "COD" ? "border-[#8B4B5A] bg-[#fdf6f0]" : "border-[#f0d9d0] hover:border-[#e8a0b4]"}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")} className="accent-[#8B4B5A]" />
                  <Banknote size={24} style={{ color: "#8B4B5A" }} className="flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "#5c3a2e" }}>Cash on Delivery</p>
                    <p className="text-xs" style={{ color: "#8a6355" }}>Pay when your order arrives at your door</p>
                  </div>
                  <span className="badge text-[10px]" style={{ background: "#dcfce7", color: "#166534" }}>Available</span>
                </label>

                {/* Razorpay */}
                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${paymentMethod === "RAZORPAY" ? "border-[#8B4B5A] bg-[#fdf6f0]" : "border-[#f0d9d0] hover:border-[#e8a0b4]"}`}>
                  <input type="radio" name="payment" value="RAZORPAY" checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")} className="accent-[#8B4B5A]" />
                  <div className="w-10 h-6 flex items-center justify-center flex-shrink-0">
                    {/* Razorpay logo pill */}
                    <span className="text-xs font-bold tracking-tight px-2 py-0.5 rounded"
                      style={{ background: "#072654", color: "#fff" }}>
                      Pay
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "#5c3a2e" }}>
                      Razorpay — Cards, UPI, Net Banking, Wallets
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {["UPI", "Visa", "Mastercard", "RuPay", "Net Banking", "PayTM"].map(m => (
                        <span key={m} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: "#f5e6dc", color: "#8B4B5A" }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Lock size={14} className="flex-shrink-0" style={{ color: "#16a34a" }} />
                </label>
              </div>

              {paymentMethod === "RAZORPAY" && (
                <div className="rounded-2xl p-4 mb-4 flex items-start gap-3"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <Smartphone size={16} style={{ color: "#16a34a" }} className="mt-0.5 flex-shrink-0" />
                  <p className="text-xs" style={{ color: "#166534" }}>
                    You&apos;ll be redirected to Razorpay&apos;s secure checkout to complete payment.
                    Supports UPI, cards, net banking, wallets and EMI. Powered by{" "}
                    <strong>Razorpay</strong> — PCI-DSS compliant, 256-bit SSL encrypted.
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="btn-outline px-6">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary px-8">Review Order</button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-soft p-6">
              <h2 className="font-cormorant text-2xl font-semibold mb-6" style={{ color: "#5c3a2e" }}>
                Review Your Order
              </h2>

              {/* Address summary */}
              <div className="rounded-2xl p-4 mb-4" style={{ background: "#fdf6f0" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#5c3a2e" }}>
                    Delivering to
                  </p>
                  <button onClick={() => setStep(0)} className="text-xs hover:underline" style={{ color: "#8B4B5A" }}>
                    Edit
                  </button>
                </div>
                <p className="text-sm font-medium" style={{ color: "#5c3a2e" }}>{address.fullName}</p>
                <p className="text-sm" style={{ color: "#8a6355" }}>{address.street}, {address.city}</p>
                <p className="text-sm" style={{ color: "#8a6355" }}>{address.state} — {address.pincode}</p>
                <p className="text-sm" style={{ color: "#8a6355" }}>📞 {address.phone}</p>
              </div>

              {/* Payment summary */}
              <div className="rounded-2xl p-4 mb-6" style={{ background: "#fdf6f0" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#5c3a2e" }}>Payment</p>
                  <button onClick={() => setStep(1)} className="text-xs hover:underline" style={{ color: "#8B4B5A" }}>Edit</button>
                </div>
                <p className="text-sm font-medium" style={{ color: "#5c3a2e" }}>
                  {paymentMethod === "COD"
                    ? "💰 Cash on Delivery"
                    : "🔒 Razorpay (Card / UPI / Net Banking)"}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={`${item.id}-${item.color}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: "#f5e6dc" }}>
                      <Image src={item.image || "/placeholder.jpg"} alt={item.name}
                        width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: "#5c3a2e" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "#8a6355" }}>
                        Qty: {item.quantity}{item.color ? ` · ${item.color}` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "#8B4B5A" }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="btn-outline px-6">Back</button>
                <button onClick={placeOrder} disabled={placing}
                  className="btn-primary px-8 flex items-center gap-2">
                  {placing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : paymentMethod === "RAZORPAY" ? (
                    <>Pay {formatPrice(total)} via Razorpay</>
                  ) : (
                    <>Place Order · {formatPrice(total)}</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Order summary sidebar ── */}
        <div className="card-soft p-5 h-fit sticky top-24 space-y-3">
          <h3 className="font-cormorant text-xl font-semibold" style={{ color: "#5c3a2e" }}>
            Order Summary
          </h3>

          <div className="max-h-52 overflow-y-auto space-y-2">
            {items.map(i => (
              <div key={`${i.id}-${i.color}`} className="flex justify-between text-xs" style={{ color: "#8a6355" }}>
                <span className="truncate mr-2">{i.name} ×{i.quantity}</span>
                <span className="flex-shrink-0">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2 text-sm" style={{ borderColor: "#f0d9d0" }}>
            <div className="flex justify-between" style={{ color: "#8a6355" }}>
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between" style={{ color: "#16a34a" }}>
                <span>Discount</span><span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between" style={{ color: "#8a6355" }}>
              <span>Shipping</span>
              <span>{shipping === 0
                ? <span style={{ color: "#16a34a" }}>FREE</span>
                : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between" style={{ color: "#8a6355" }}>
              <span>GST (5%)</span><span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2"
              style={{ borderTop: "1px solid #f0d9d0", color: "#5c3a2e" }}>
              <span>Total</span>
              <span style={{ color: "#8B4B5A" }}>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs pt-1" style={{ color: "#8a6355" }}>
            <Lock size={12} style={{ color: "#16a34a" }} />
            <span>Secured by 256-bit SSL encryption</span>
          </div>

          {paymentMethod === "RAZORPAY" && (
            <div className="text-xs text-center pt-1" style={{ color: "#8a6355" }}>
              Powered by{" "}
              <span className="font-medium px-1.5 py-0.5 rounded text-white text-[10px]"
                style={{ background: "#072654" }}>
                Razorpay
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
