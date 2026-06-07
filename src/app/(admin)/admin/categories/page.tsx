"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Category { id: string; name: string; slug: string; description?: string; image?: string; _count?: { products: number }; }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/categories").then(r => r.json()).then(d => { setCategories(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", description: "", image: "" }); setShowForm(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description || "", image: c.image || "" }); setShowForm(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { toast.success(editing ? "Updated!" : "Created!"); setShowForm(false); load(); }
    else { const d = await res.json(); toast.error(d.error || "Failed"); }
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); load(); }
    else toast.error("Cannot delete category with products");
  };

  const EMOJIS: Record<string, string> = { flowers: "🌸", bouquets: "💐", keychains: "🗝️", bags: "👜", plushies: "🧸", accessories: "✨" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Categories</h1>
          <p className="text-brown-light text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 rounded-2xl skeleton" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-soft p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blush-light flex items-center justify-center text-3xl flex-shrink-0">
                {EMOJIS[cat.slug] || "🏷️"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brown">{cat.name}</p>
                <p className="text-xs text-brown-light">{cat._count?.products || 0} products</p>
                {cat.description && <p className="text-xs text-brown-light truncate mt-0.5">{cat.description}</p>}
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                  <Edit size={13} />
                </button>
                <button onClick={() => del(cat.id, cat.name)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-strong w-full max-w-md p-6">
              <h2 className="font-cormorant text-2xl font-semibold text-brown mb-5">{editing ? "Edit Category" : "New Category"}</h2>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brown mb-1.5">Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-soft" placeholder="Crochet Flowers" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-soft resize-none" rows={2} placeholder="Short description..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown mb-1.5">Image URL</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="input-soft" placeholder="https://..." />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-5">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary px-6">{saving ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
