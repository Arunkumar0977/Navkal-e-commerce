"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="text-center max-w-lg"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="font-cormorant text-5xl font-semibold text-brown mb-3">
            Order Placed! 🎉
          </h1>
          <p className="text-brown-light mb-2">
            Thank you for your order. We&apos;re so excited to craft this for you!
          </p>
          {orderNumber && (
            <div className="inline-flex items-center gap-2 bg-blush-light/60 px-5 py-2.5 rounded-full mb-6">
              <Package size={16} className="text-blush-dark" />
              <span className="font-medium text-blush-dark text-sm tracking-wider">{orderNumber}</span>
            </div>
          )}
          <p className="text-sm text-brown-light mb-8">
            A confirmation email has been sent to your inbox. You can track your order from your dashboard.
          </p>

          {/* Next steps */}
          <div className="bg-cream rounded-2xl p-5 text-left mb-8 space-y-3">
            {[
              { icon: "📦", step: "Order Confirmed", desc: "We've received your order" },
              { icon: "🧶", step: "Crafting", desc: "Our artisans are working on it" },
              { icon: "🚚", step: "Dispatch", desc: "Your package will be shipped soon" },
              { icon: "🏠", step: "Delivery", desc: "Delivered to your doorstep" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-medium text-brown">{s.step}</p>
                  <p className="text-xs text-brown-light">{s.desc}</p>
                </div>
                {i === 0 && (
                  <span className="ml-auto badge bg-green-100 text-green-700 text-[10px]">Done ✓</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="btn-primary flex items-center justify-center gap-2">
              <Package size={16} /> Track Order
            </Link>
            <Link href="/shop" className="btn-outline flex items-center justify-center gap-2">
              <Home size={16} /> Continue Shopping
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
