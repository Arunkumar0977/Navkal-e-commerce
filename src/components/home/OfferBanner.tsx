"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Truck, Shield, Sparkles, Heart, Star, Package } from "lucide-react";

// ── Offer Banner ──────────────────────────────────────────────────────────────
export function OfferBanner() {
  return (
    <section className="py-6 bg-blush-dark overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="inline-flex items-center gap-6 text-sm text-white/90">
            <span>✨ Free shipping on orders over ₹500</span>
            <span>🌸 New arrivals every week</span>
            <span>🎀 Custom orders welcome</span>
            <span>🧶 Handmade with love</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

// ── Why Choose Us ─────────────────────────────────────────────────────────────
const features = [
  { icon: Heart, title: "Made with Love", desc: "Every piece is hand-crafted with genuine care and attention to detail." },
  { icon: Sparkles, title: "Premium Quality", desc: "We use only the finest yarns and materials for lasting beauty." },
  { icon: Truck, title: "Fast Delivery", desc: "Carefully packaged and delivered right to your doorstep." },
  { icon: Shield, title: "Secure Payments", desc: "Your transactions are 100% safe and encrypted." },
  { icon: Package, title: "Easy Returns", desc: "Not satisfied? We offer hassle-free returns within 7 days." },
  { icon: Star, title: "Custom Orders", desc: "Can't find what you want? We'll make it just for you!" },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-3">Why Us</p>
          <h2 className="section-title">Crafted with Intention</h2>
          <p className="text-brown-light mt-4 max-w-lg mx-auto">
            We pour our heart into every stitch. Here's what makes NavkalaCrochet special.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 p-6 rounded-2xl hover:bg-cream transition-colors duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blush-light flex items-center justify-center flex-shrink-0 group-hover:bg-blush-dark transition-colors">
                <f.icon size={22} className="text-blush-dark group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-cormorant text-xl font-semibold text-brown mb-1">{f.title}</h3>
                <p className="text-sm text-brown-light leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Absolutely in love with my crochet bouquet! It's so beautiful and well-made. Everyone asks where I got it from. Will definitely be ordering more!",
    product: "Rose Bouquet",
  },
  {
    name: "Ananya Patel",
    location: "Delhi",
    rating: 5,
    text: "The custom keychain I ordered turned out exactly as I imagined. The quality is exceptional and the packaging was so pretty. 10/10 recommend!",
    product: "Custom Keychain",
  },
  {
    name: "Riya Singh",
    location: "Bangalore",
    rating: 5,
    text: "I gifted a crochet plushie to my best friend and she cried happy tears. NavkalaCrochet makes the most thoughtful gifts. Thank you!",
    product: "Bear Plushie",
  },
  {
    name: "Meera Joshi",
    location: "Pune",
    rating: 5,
    text: "Ordered a crochet bag and it's absolutely stunning! Great quality, fast delivery, and the bag is so durable. Highly recommend this shop!",
    product: "Tote Bag",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-3">Reviews</p>
          <h2 className="section-title">Words of Love</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-soft"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-brown-light leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-brown text-sm">{t.name}</p>
                  <p className="text-xs text-brown-light">{t.location}</p>
                </div>
                <span className="text-xs bg-blush-light text-blush-dark px-2.5 py-1 rounded-full">
                  {t.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Instagram Gallery ─────────────────────────────────────────────────────────
const instagramPosts = [
  { emoji: "🌸", color: "from-pink-100 to-rose-50" },
  { emoji: "🧶", color: "from-lavender-light to-purple-50" },
  { emoji: "🐻", color: "from-amber-50 to-yellow-50" },
  { emoji: "💐", color: "from-green-50 to-emerald-50" },
  { emoji: "👜", color: "from-blue-50 to-sky-50" },
  { emoji: "🌷", color: "from-pink-50 to-blush-light" },
];

export function InstagramGallery() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-3">@navkalacrochet</p>
          <h2 className="section-title">Follow Our Story</h2>
          <p className="text-brown-light text-sm mt-3">
            See our latest creations on Instagram
          </p>
        </motion.div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {instagramPosts.map((p, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/navkalacrochet"
              target="_blank"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`aspect-square rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center
                         hover:shadow-medium transition-all duration-300 hover:scale-95 group overflow-hidden`}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{p.emoji}</span>
            </motion.a>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="https://instagram.com/navkalacrochet"
            target="_blank"
            className="btn-outline inline-flex items-center gap-2"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
