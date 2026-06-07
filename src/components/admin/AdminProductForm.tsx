"use client";

import { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface Props {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

interface Category { id: string; name: string; }

export default function AdminProductForm({ product, onClose, onSaved }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    comparePrice: product?.comparePrice || "",
    categoryId: product?.categoryId || "",
    stock: product?.stock || 0,
    sku: product?.sku || `SKU-${Date.now()}`,
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    newArrival: product?.newArrival || false,
    trending: product?.trending || false,
    tags: product?.tags?.join(", ") || "",
    images: product?.images || [""],
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleImageChange = (idx: number, val: string) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    update("images", imgs);
  };

  const addImageSlot = () => update("images", [...form.images, ""]);
  const removeImage = (idx: number) => update("images", form.images.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Please fill required fields");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(String(form.price)),
      comparePrice: form.comparePrice ? parseFloat(String(form.comparePrice)) : null,
      stock: parseInt(String(form.stock)),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
    };

    const method = product ? "PUT" : "POST";
    const url = product ? `/api/products/${product.id}` : "/api/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      toast.success(product ? "Product updated!" : "Product created!");
      onSaved();
    } else {
      const err = await res.json();
      toast.error(err.error || "Save failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-cormorant text-2xl font-semibold text-brown">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center">
            <X size={18} className="text-brown" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-brown mb-1.5">Product Name *</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)}
                className="input-soft" placeholder="Beautiful Crochet Flower" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)}
                className="input-soft" placeholder="299" required min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown mb-1.5">Compare Price (₹)</label>
              <input type="number" value={form.comparePrice} onChange={(e) => update("comparePrice", e.target.value)}
                className="input-soft" placeholder="399" min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown mb-1.5">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)}
                className="input-soft" placeholder="50" min="0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown mb-1.5">SKU</label>
              <input value={form.sku} onChange={(e) => update("sku", e.target.value)}
                className="input-soft" placeholder="SKU-001" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-brown mb-1.5">Category *</label>
              <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}
                className="input-soft" required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-brown-light mt-1">No categories yet. <a href="/admin/categories" className="text-blush-dark underline">Add categories first</a></p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-brown mb-1.5">Description *</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
                className="input-soft resize-none" rows={4} placeholder="Product description..." required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-brown mb-1.5">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => update("tags", e.target.value)}
                className="input-soft" placeholder="handmade, crochet, flowers, gift" />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-medium text-brown mb-3">Product Images (URLs)</label>
            <div className="space-y-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={img} onChange={(e) => handleImageChange(idx, e.target.value)}
                    className="input-soft flex-1" placeholder="https://res.cloudinary.com/..." />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => removeImage(idx)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addImageSlot}
              className="mt-2 flex items-center gap-2 text-xs text-blush-dark hover:underline">
              <Plus size={12} /> Add image URL
            </button>
          </div>

          {/* Badges */}
          <div>
            <label className="block text-xs font-medium text-brown mb-3">Product Badges</label>
            <div className="flex flex-wrap gap-4">
              {[
                { key: "featured", label: "⭐ Featured" },
                { key: "bestSeller", label: "🏆 Best Seller" },
                { key: "newArrival", label: "✨ New Arrival" },
                { key: "trending", label: "🔥 Trending" },
              ].map((b) => (
                <label key={b.key} className="flex items-center gap-2 cursor-pointer text-sm text-brown">
                  <input type="checkbox" checked={(form as any)[b.key]}
                    onChange={(e) => update(b.key, e.target.checked)}
                    className="rounded accent-blush-dark" />
                  {b.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline px-6">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary px-8">
              {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
