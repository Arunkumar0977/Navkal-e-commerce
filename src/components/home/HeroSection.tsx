"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-soft-pattern">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blush-light/60 to-lavender-light/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-beige/60 to-cream/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-blush-light/20 blur-2xl" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🌸", "🧶", "🌼", "✨", "🌷", "🎀"].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl select-none opacity-40"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blush-light/60 text-blush-dark px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles size={14} />
            Handcrafted with Love & Care
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-cormorant text-6xl md:text-7xl xl:text-8xl font-semibold leading-[0.95] text-brown mb-6"
          >
            Where Yarn
            <br />
            Becomes{" "}
            <span className="text-gradient italic">
              Art
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brown-light text-lg leading-relaxed mb-8 max-w-lg"
          >
            Every stitch tells a story. Discover our exquisite collection of handmade 
            crochet creations — from delicate flowers to cozy plushies, each piece 
            crafted with intention and love.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/shop" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Shop Collection
              <ArrowRight size={18} />
            </Link>
            <Link href="/custom-order" className="btn-outline text-base px-8 py-4">
              Custom Order
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-8 mt-12"
          >
            {[
              { num: "500+", label: "Happy Customers" },
              { num: "200+", label: "Products" },
              { num: "4.9★", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-cormorant text-3xl font-semibold text-blush-dark">{stat.num}</p>
                <p className="text-xs text-brown-light">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual Grid */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:grid grid-cols-2 gap-4"
        >
          {/* Large card */}
          <div className="col-span-1 row-span-2">
            <div className="h-full min-h-[420px] rounded-3xl bg-gradient-to-br from-blush-light to-lavender-light flex items-center justify-center overflow-hidden relative">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-float">🧶</div>
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 w-full">
                    <p className="font-cormorant text-xl font-semibold text-brown">Crochet Bouquets</p>
                    <p className="text-xs text-brown-light">Starting from ₹299</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-blush-dark text-white text-xs px-3 py-1 rounded-full">
                ✨ Bestseller
              </div>
            </div>
          </div>

          {/* Small cards */}
          <div className="rounded-3xl bg-gradient-to-br from-cream to-beige min-h-[200px] flex flex-col items-center justify-center p-6 gap-3">
            <div className="text-5xl animate-float" style={{ animationDelay: "1s" }}>🌸</div>
            <p className="font-cormorant text-lg font-semibold text-brown">Crochet Flowers</p>
            <p className="text-xs text-brown-light">Eternal blooms</p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-lavender-light to-blush-light min-h-[200px] flex flex-col items-center justify-center p-6 gap-3">
            <div className="text-5xl animate-float" style={{ animationDelay: "2s" }}>🐻</div>
            <p className="font-cormorant text-lg font-semibold text-brown">Plushies</p>
            <p className="text-xs text-brown-light">So huggable!</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-brown-light tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border border-brown-light/30 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 bg-blush-dark rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
