"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore, useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="text-7xl">🩷</div>
        <h2 className="font-cormorant text-3xl font-semibold text-brown">Your wishlist is empty</h2>
        <p className="text-brown-light text-center">Save your favorite pieces to revisit later</p>
        <Link href="/shop" className="btn-primary flex items-center gap-2">
          <Heart size={16} /> Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-4xl font-semibold text-brown">
          Wishlist <span className="text-2xl text-brown-light">({items.length})</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="card-soft overflow-hidden group"
            >
              <Link href={`/product/${item.slug}`} className="block relative aspect-square bg-cream overflow-hidden">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => { e.preventDefault(); removeItem(item.id); toast.success("Removed from wishlist"); }}
                  className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="text-sm font-medium text-brown hover:text-blush-dark transition-colors line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-blush-dark font-semibold">{formatPrice(item.price)}</span>
                  <button
                    onClick={() => {
                      addItem({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, stock: 99, slug: item.slug });
                      toast.success("Added to cart! 🛍️");
                    }}
                    className="w-9 h-9 rounded-full bg-blush-dark text-white flex items-center justify-center hover:bg-brown transition-colors"
                  >
                    <ShoppingBag size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
