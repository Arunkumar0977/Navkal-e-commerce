"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ShoppingBag, Share2, Star, ChevronLeft, ChevronRight,
  Truck, Shield, RefreshCw, Package, Plus, Minus, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { formatPrice, calculateDiscount, getEstimatedDelivery, cn } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cart";
import toast from "react-hot-toast";
import ProductCard from "@/components/product/ProductCard";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "shipping">("desc");
  const [related, setRelated] = useState<Product[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        if (data?.variants?.length > 0 && data.variants[0].color) {
          setSelectedColor(data.variants[0].color);
        }
        setLoading(false);
        // Fetch related
        if (data?.categoryId) {
          fetch(`/api/products?category=${data.category?.slug}&limit=4`)
            .then((r) => r.json())
            .then((d) => setRelated((d.products || []).filter((p: Product) => p.id !== data.id)));
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-brown">Product not found</div>;

  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;
  const colors = [...new Set(product.variants?.filter((v) => v.color).map((v) => v.color!))] as string[];
  const colorMap: Record<string, string> = {
    red: "#ef4444", pink: "#ec4899", rose: "#f43f5e", blush: "#fda4af",
    purple: "#a855f7", lavender: "#c084fc", blue: "#3b82f6", teal: "#14b8a6",
    green: "#22c55e", yellow: "#eab308", orange: "#f97316", white: "#f9fafb",
    black: "#111827", brown: "#92400e", cream: "#fef3c7", beige: "#d4b896",
  };

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      color: selectedColor,
      stock: product.stock,
      slug: product.slug,
    });
    toast.success("Added to cart! 🛍️");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, ...reviewForm }),
    });
    if (res.ok) {
      toast.success("Review submitted! 🌸");
      setReviewForm({ rating: 5, title: "", body: "" });
    } else {
      toast.error("Sign in to leave a review");
    }
    setSubmittingReview(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brown-light mb-8">
        <Link href="/" className="hover:text-blush-dark">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-blush-dark">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-blush-dark">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-brown truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[activeImage] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={18} className="text-brown" />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={18} className="text-brown" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.newArrival && <span className="badge bg-lavender text-brown">New</span>}
              {product.bestSeller && <span className="badge bg-blush-dark text-white">Best Seller</span>}
              {discount > 0 && <span className="badge bg-green-100 text-green-700">-{discount}%</span>}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                    i === activeImage ? "border-blush-dark" : "border-transparent opacity-60"
                  )}
                >
                  <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-xs text-blush-dark uppercase tracking-widest mb-2">{product.category?.name}</p>
          <h1 className="font-cormorant text-4xl font-semibold text-brown mb-3">{product.name}</h1>

          {/* Rating */}
          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={cn(
                    i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                  )} />
                ))}
              </div>
              <span className="text-sm text-brown-light">
                {avgRating.toFixed(1)} ({product.reviews?.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-cormorant text-4xl font-semibold text-blush-dark">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-lg text-brown-light line-through">{formatPrice(product.comparePrice)}</span>
                <span className="badge bg-green-100 text-green-700">{discount}% off</span>
              </>
            )}
          </div>

          {/* Color variants */}
          {colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-brown mb-3">
                Color: <span className="text-blush-dark capitalize">{selectedColor}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={cn(
                      "w-9 h-9 rounded-full border-2 transition-all relative",
                      selectedColor === color ? "border-blush-dark scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: colorMap[color.toLowerCase()] || color }}
                  >
                    {selectedColor === color && (
                      <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-brown mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream transition-colors"
                >
                  <Minus size={16} className="text-brown" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-brown">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream transition-colors"
                >
                  <Plus size={16} className="text-brown" />
                </button>
              </div>
              <span className={cn("text-sm", product.stock > 0 ? "text-green-600" : "text-red-500")}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggle({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug })}
              className={cn(
                "w-14 h-14 rounded-xl border flex items-center justify-center transition-all",
                inWishlist ? "bg-blush-dark border-blush-dark text-white" : "border-border text-brown hover:border-blush-dark hover:text-blush-dark"
              )}
            >
              <Heart size={20} className={inWishlist ? "fill-white" : ""} />
            </button>
            <button
              onClick={handleShare}
              className="w-14 h-14 rounded-xl border border-border text-brown hover:border-blush-dark hover:text-blush-dark flex items-center justify-center transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="bg-cream rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-brown">
              <Truck size={16} className="text-blush-dark" />
              <span>Estimated delivery by <strong>{getEstimatedDelivery()}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brown">
              <Package size={16} className="text-blush-dark" />
              <span>Free shipping on orders above ₹500</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brown">
              <RefreshCw size={16} className="text-blush-dark" />
              <span>7-day hassle-free returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brown">
              <Shield size={16} className="text-blush-dark" />
              <span>Secure & encrypted checkout</span>
            </div>
          </div>

          <p className="text-xs text-brown-light mt-4">SKU: {product.sku}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex border-b border-border mb-6">
          {[
            { id: "desc", label: "Description" },
            { id: "reviews", label: `Reviews (${product.reviews?.length || 0})` },
            { id: "shipping", label: "Shipping & Returns" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-blush-dark text-blush-dark"
                  : "border-transparent text-brown-light hover:text-brown"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "desc" && (
          <div className="prose prose-sm max-w-none text-brown-light leading-relaxed">
            <p>{product.description}</p>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-cream rounded-full text-xs text-brown-light">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {product.reviews?.length === 0 ? (
              <p className="text-brown-light text-sm py-4">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-5 mb-8">
                {product.reviews?.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-5 shadow-soft">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blush-light flex items-center justify-center font-cormorant text-lg text-blush-dark">
                          {review.user.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brown">{review.user.name}</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={10} className={cn(
                                i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                              )} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.verified && (
                        <span className="badge bg-green-100 text-green-700 text-[10px]">✓ Verified</span>
                      )}
                    </div>
                    {review.title && <p className="font-medium text-brown text-sm mb-1">{review.title}</p>}
                    <p className="text-sm text-brown-light">{review.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write review */}
            <div className="bg-cream rounded-2xl p-6">
              <h3 className="font-cormorant text-xl font-semibold text-brown mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-brown mb-2">Rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReviewForm((f) => ({ ...f, rating: r }))}
                      >
                        <Star size={24} className={cn(
                          "transition-colors",
                          r <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Review title (optional)"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                  className="input-soft"
                />
                <textarea
                  placeholder="Share your experience..."
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                  required
                  rows={4}
                  className="input-soft resize-none"
                />
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4 text-sm text-brown-light leading-relaxed">
            <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
              <h3 className="font-cormorant text-lg font-semibold text-brown">Shipping Policy</h3>
              <p>Orders are processed within 1-2 business days. Estimated delivery is 5-7 business days across India.</p>
              <p>Free shipping on all orders above ₹500. Standard shipping ₹60 for smaller orders.</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
              <h3 className="font-cormorant text-lg font-semibold text-brown">Return Policy</h3>
              <p>We accept returns within 7 days of delivery for unused, undamaged items in original packaging.</p>
              <p>Custom orders and personalized items are non-refundable.</p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-cormorant text-3xl font-semibold text-brown mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="aspect-square rounded-3xl skeleton" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-16 h-16 rounded-xl skeleton" />)}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-5 w-24 rounded skeleton" />
        <div className="h-10 w-3/4 rounded skeleton" />
        <div className="h-8 w-32 rounded skeleton" />
        <div className="h-6 w-48 rounded skeleton" />
        <div className="h-12 rounded-xl skeleton" />
        <div className="h-14 rounded-xl skeleton" />
      </div>
    </div>
  );
}
