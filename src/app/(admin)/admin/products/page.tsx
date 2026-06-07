"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Package, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AdminProductForm from "@/components/admin/AdminProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/products?limit=100${search ? `&search=${search}` : ""}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  };

  useEffect(load, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Product deleted"); load(); }
    else toast.error("Delete failed");
  };

  const handleToggle = async (id: string, current: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Products</h1>
          <p className="text-brown-light text-sm">{products.length} total products</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-light" />
        <input
          type="text" placeholder="Search products..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-soft pl-11 w-full max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream">
              <tr>
                {["Product", "Price", "Stock", "Category", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-brown-light uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-4 rounded skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-brown-light">No products found</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                        <Image src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <p className="font-medium text-brown truncate max-w-[180px]">{p.name}</p>
                        <p className="text-xs text-brown-light">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-blush-dark">{formatPrice(p.price)}</p>
                    {p.comparePrice && <p className="text-xs text-brown-light line-through">{formatPrice(p.comparePrice)}</p>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge text-xs ${p.stock > 10 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                      {p.stock} left
                    </span>
                  </td>
                  <td className="py-3 px-4 text-brown-light">{p.category?.name}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleToggle(p.id, p.isActive)}
                      className={`badge text-xs cursor-pointer ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditProduct(p); setShowForm(true); }}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <AdminProductForm
            product={editProduct}
            onClose={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
