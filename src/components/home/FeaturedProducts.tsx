"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductsSectionProps {
  title: string;
  subtitle: string;
  filter: string;
  viewAllHref: string;
}

function ProductsSection({ title, subtitle, filter, viewAllHref }: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?${filter}&limit=8`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-2">{subtitle}</p>
            <h2 className="section-title">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-2 text-sm text-blush-dark hover:text-brown transition-colors font-medium"
          >
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-brown-light">
            <p className="font-cormorant text-4xl mb-3">🧶</p>
            <p>Coming soon — we're crafting something beautiful!</p>
          </div>
        )}

        <div className="sm:hidden text-center mt-8">
          <Link href={viewAllHref} className="btn-outline inline-flex items-center gap-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  return (
    <ProductsSection
      title="Featured Picks"
      subtitle="Handpicked For You"
      filter="featured=true"
      viewAllHref="/shop?featured=true"
    />
  );
}

export function BestSellers() {
  return (
    <div className="bg-cream">
      <ProductsSection
        title="Best Sellers"
        subtitle="Most Loved"
        filter="bestSeller=true"
        viewAllHref="/shop?bestSeller=true"
      />
    </div>
  );
}

export function NewArrivals() {
  return (
    <ProductsSection
      title="New Arrivals"
      subtitle="Just Dropped"
      filter="newArrival=true"
      viewAllHref="/shop?newArrival=true"
    />
  );
}

export default FeaturedProducts;
