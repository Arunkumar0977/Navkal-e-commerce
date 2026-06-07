"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  id: string; code: string; type: "PERCENTAGE" | "FIXED"; value: number;
  minOrder?: number; maxDiscount?: number; usageLimit?: number; usedCount: number;
  isActive: boolean; expiresAt?: string;
}

const EMPTY = { code: "", type: "PERCENTAGE" as const, value: "", minOrder: "", maxDiscount: "", usageLimit: "", expiresAt: "", isActive: true };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/coupons/admin").then(r => r.json()).then(d => { setCoupons(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) { toast.error("Code and value required"); return; }
    setSaving(true);
    const res = await fetch("/api/coupons/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        code: form.code.toUpperCase(),
        value: parseFloat(String(form.value)),
        minOrder: form.minOrder ? parseFloat(String(form.minOrder)) : null,
        maxDiscount: form.maxDiscount ? parseFloat(String(form.maxDiscount)) : null,
        usageLimit: form.usageLimit ? parseInt(String(form.usageLimit)) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    setSaving(false);
    if (res.ok) { toast.success("Coupon created!"); setShowForm(false); setForm(EMPTY); load(); }
    else { const d = await res.json(); toast.error(d.error || "Failed"); }
  };

  const del = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    const res = await fetch(`/api/coupons/admin?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); load(); } else toast.error("Delete failed");
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch(`/api/coupons/admin?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !active }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Coupons</h1>
          <p className="text-brown-light text-sm">{coupons.length} coupons</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Create Coupon</button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              {["Code", "Type", "Value", "Min Order", "Used", "Status", "Expires", "Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-brown-light uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="py-4 px-4"><div className="h-4 rounded skeleton" /></td>)}</tr>
            )) : coupons.map(c => (
              <tr key={c.id} className="hover:bg-cream/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blush-dark">{c.code}</td>
                <td className="py-3 px-4"><span className="badge bg-lavender-light text-purple-700 text-[10px]">{c.type}</span></td>
                <td className="py-3 px-4 font-medium text-brown">{c.type === "PERCENTAGE" ? `${c.value}%` : formatPrice(c.value)}</td>
                <td className="py-3 px-4 text-brown-light">{c.minOrder ? formatPrice(c.minOrder) : "—"}</td>
                <td className="py-3 px-4 text-brown-light">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                <td className="py-3 px-4">
                  <button onClick={() => toggle(c.id, c.isActive)}
                    className={`badge cursor-pointer text-[10px] ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-3 px-4 text-brown-light text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}</td>
                <td className="py-3 px-4">
                  <button onClick={() => del(c.id, c.code)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && coupons.length === 0 && <p className="text-center py-10 text-brown-light">No coupons yet</p>}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-3xl shadow-strong w-full max-w-md p-6">
              <h2 className="font-cormorant text-2xl font-semibold text-brown mb-5">Create Coupon</h2>
              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Code *</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                      className="input-soft font-mono uppercase" placeholder="SAVE10" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="input-soft">
                      <option value="PERCENTAGE">Percentage %</option>
                      <option value="FIXED">Fixed ₹</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Value *</label>
                    <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                      className="input-soft" placeholder={form.type === "PERCENTAGE" ? "10" : "50"} min="0" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Min Order (₹)</label>
                    <input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))}
                      className="input-soft" placeholder="500" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Max Discount (₹)</label>
                    <input type="number" value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))}
                      className="input-soft" placeholder="200" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Usage Limit</label>
                    <input type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                      className="input-soft" placeholder="100" min="1" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-brown mb-1">Expires At</label>
                    <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                      className="input-soft" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-5">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary px-6">{saving ? "Creating..." : "Create"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
