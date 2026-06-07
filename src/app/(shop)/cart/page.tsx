"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, calcShipping, calcTax } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, couponCode, discount, setCoupon, removeCoupon } =
    useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = calcShipping(subtotal);
  const tax = calcTax(subtotal - discount);
  const total = subtotal - discount + shipping + tax;

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput.trim().toUpperCase(), orderTotal: subtotal }),
    });
    const data = await res.json();
    setApplying(false);
    if (res.ok) {
      setCoupon(couponInput.toUpperCase(), data.discount);
      toast.success(`Coupon applied! Saved ${formatPrice(data.discount)} 🎉`);
    } else {
      toast.error(data.error || "Invalid coupon");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-7xl">🛍️</div>
        <h2 className="font-cormorant text-3xl font-semibold text-brown">Your cart is empty</h2>
        <p className="text-brown-light text-center">Looks like you haven&apos;t added anything yet. Start exploring!</p>
        <Link href="/shop" className="btn-primary flex items-center gap-2">
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-cormorant text-4xl font-semibold text-brown mb-8">
        Shopping Cart <span className="text-brown-light text-2xl">({items.length} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${item.color}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-soft p-4 flex gap-4"
              >
                <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-cream">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-sm font-medium text-brown hover:text-blush-dark transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      {item.color && (
                        <p className="text-xs text-brown-light capitalize mt-0.5">Color: {item.color}</p>
                      )}
                    </div>
                    <button
                      onClick={() => { removeItem(item.id, item.color); toast.success("Removed"); }}
                      className="text-brown-light hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.color)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm text-brown">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-semibold text-blush-dark text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card-soft p-5">
            <p className="text-sm font-medium text-brown mb-3 flex items-center gap-2">
              <Tag size={16} className="text-blush-dark" /> Have a coupon?
            </p>
            {couponCode ? (
              <div className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-green-700">{couponCode}</p>
                  <p className="text-xs text-green-600">Saved {formatPrice(discount)}</p>
                </div>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="COUPON CODE"
                  className="input-soft flex-1 py-2 text-xs uppercase tracking-wider"
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                <button onClick={applyCoupon} disabled={applying} className="btn-primary py-2 px-4 text-xs">
                  {applying ? "..." : "Apply"}
                </button>
              </div>
            )}
          </div>

          {/* Price summary */}
          <div className="card-soft p-5 space-y-3">
            <h2 className="font-cormorant text-xl font-semibold text-brown">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-brown-light">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brown-light">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-brown-light">
                <span>Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-brown text-base">
                <span>Total</span>
                <span className="text-blush-dark">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center flex items-center justify-center gap-2 py-4 mt-2">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            {shipping > 0 && (
              <p className="text-xs text-center text-brown-light">
                Add {formatPrice(500 - subtotal)} more for free shipping
              </p>
            )}
          </div>

          <Link href="/shop" className="btn-outline w-full text-center block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
