"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore, useWishlistStore } from "@/store/cart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Product } from "@/types";
import toast from "react-hot-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const [imageIndex, setImageIndex] = useState(0);
  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0;

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.jpg",
      quantity: 1,
      stock: product.stock,
      slug: product.slug,
    });
    toast.success("Added to cart! 🛍️");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.jpg",
      slug: product.slug,
    });
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist! 🩷");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="card-soft overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-cream">
            <Image
              src={product.images[imageIndex] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.newArrival && (
                <span className="badge bg-lavender text-brown text-[10px] px-2.5 py-1">New</span>
              )}
              {product.bestSeller && (
                <span className="badge bg-blush-dark text-white text-[10px] px-2.5 py-1">Best Seller</span>
              )}
              {discount > 0 && (
                <span className="badge bg-green-100 text-green-700 text-[10px] px-2.5 py-1">
                  -{discount}%
                </span>
              )}
              {product.stock === 0 && (
                <span className="badge bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1">
                  Sold Out
                </span>
              )}
            </div>

            {/* Actions Overlay */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
              <button
                onClick={handleWishlist}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shadow-medium transition-all duration-200",
                  inWishlist
                    ? "bg-blush-dark text-white"
                    : "bg-white text-brown hover:bg-blush-dark hover:text-white"
                )}
              >
                <Heart size={16} className={inWishlist ? "fill-white" : ""} />
              </button>
              <Link
                href={`/product/${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full bg-white text-brown flex items-center justify-center shadow-medium hover:bg-blush-dark hover:text-white transition-all duration-200"
              >
                <Eye size={16} />
              </Link>
            </div>

            {/* Multiple images indicator */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {product.images.slice(0, 4).map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setImageIndex(i); }}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      i === imageIndex ? "bg-blush-dark w-4" : "bg-white/70"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-[10px] text-blush-dark uppercase tracking-wider mb-1">
              {product.category?.name}
            </p>
            <h3 className="text-sm font-medium text-brown mb-2 line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={cn(
                      i < Math.round(avgRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    )}
                  />
                ))}
                <span className="text-[10px] text-brown-light ml-1">
                  ({product._count?.reviews || 0})
                </span>
              </div>
            )}

            {/* Price + Add to Cart */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-blush-dark font-semibold text-base">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-brown-light line-through text-xs ml-2">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-9 h-9 rounded-full bg-blush-dark text-white flex items-center justify-center 
                         hover:bg-brown transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
