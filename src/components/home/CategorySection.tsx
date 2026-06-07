"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { name: "Flowers", slug: "flowers", emoji: "🌸", desc: "Eternal blooms", color: "from-blush-light to-pink-100", count: "50+" },
  { name: "Bouquets", slug: "bouquets", emoji: "💐", desc: "Perfect gifts", color: "from-lavender-light to-purple-100", count: "30+" },
  { name: "Keychains", slug: "keychains", emoji: "🗝️", desc: "Carry with love", color: "from-cream to-yellow-50", count: "40+" },
  { name: "Bags", slug: "bags", emoji: "👜", desc: "Carry in style", color: "from-green-50 to-emerald-100", count: "25+" },
  { name: "Plushies", slug: "plushies", emoji: "🧸", desc: "So huggable", color: "from-orange-50 to-amber-100", count: "35+" },
  { name: "Accessories", slug: "accessories", emoji: "✨", desc: "Little extras", color: "from-blue-50 to-sky-100", count: "60+" },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-3">Browse By</p>
          <h2 className="section-title">Our Collections</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/shop?category=${cat.slug}`}>
                <div className={`group bg-gradient-to-br ${cat.color} rounded-3xl p-6 text-center
                               hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer`}>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {cat.emoji}
                  </div>
                  <p className="font-cormorant text-lg font-semibold text-brown">{cat.name}</p>
                  <p className="text-xs text-brown-light mt-1">{cat.desc}</p>
                  <p className="text-xs text-blush-dark font-medium mt-1">{cat.count} items</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
