"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { Product } from "@/types";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  { label: "All", value: "" },
  { label: "Flowers", value: "flowers" },
  { label: "Bouquets", value: "bouquets" },
  { label: "Keychains", value: "keychains" },
  { label: "Bags", value: "bags" },
  { label: "Plushies", value: "plushies" },
  { label: "Accessories", value: "accessories" },
];

const sortOptions = [
  { label: "Newest First", value: "createdAt" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Reviewed", value: "rating" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const [priceRange, setPriceRange] = useState([0, 2000]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    params.set("minPrice", String(priceRange[0]));
    params.set("maxPrice", String(priceRange[1]));
    params.set("page", String(page));
    params.set("limit", "12");

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.meta?.total || 0);
        setTotalPages(data.meta?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, search, sort, priceRange, page]);

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete("page");
    router.push(`/shop?${p.toString()}`);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant text-5xl font-semibold text-brown mb-2">
          {search ? `Search: "${search}"` : category ? categories.find((c) => c.value === category)?.label || "Shop" : "All Products"}
        </h1>
        <p className="text-sm text-brown-light">{total} products found</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setParam("category", cat.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              category === cat.value
                ? "bg-blush-dark text-white shadow-md"
                : "bg-white text-brown-light hover:bg-cream border border-border"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort + Filter bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 text-sm text-brown border border-border px-4 py-2.5 rounded-xl hover:bg-cream transition-colors"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-brown-light hidden sm:block">Sort by:</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="appearance-none bg-white border border-border rounded-xl pl-4 pr-9 py-2.5 text-sm text-brown focus:outline-none focus:ring-2 focus:ring-blush cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-2xl border border-border p-6 grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-brown mb-3">Price Range</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="input-soft w-24 py-2 text-center"
                    placeholder="Min"
                  />
                  <span className="text-brown-light">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="input-soft w-24 py-2 text-center"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-brown mb-3">Type</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Featured", key: "featured" },
                    { label: "New Arrivals", key: "newArrival" },
                    { label: "Best Sellers", key: "bestSeller" },
                  ].map((f) => (
                    <label key={f.key} className="flex items-center gap-2 text-sm text-brown-light cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchParams.get(f.key) === "true"}
                        onChange={(e) => setParam(f.key, e.target.checked ? "true" : "")}
                        className="rounded accent-blush-dark"
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { router.push("/shop"); setPriceRange([0, 2000]); }}
                  className="flex items-center gap-2 text-sm text-brown-light hover:text-blush-dark"
                >
                  <X size={14} /> Clear all filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🧶</p>
          <h3 className="font-cormorant text-2xl text-brown mb-2">No products found</h3>
          <p className="text-brown-light text-sm mb-6">Try adjusting your filters or search term</p>
          <button onClick={() => router.push("/shop")} className="btn-primary">Browse All</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-border text-sm text-brown hover:bg-cream disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-sm font-medium transition-colors",
                    p === page ? "bg-blush-dark text-white" : "border border-border text-brown hover:bg-cream"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-border text-sm text-brown hover:bg-cream disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
