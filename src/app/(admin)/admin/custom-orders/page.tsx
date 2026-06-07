"use client";
import { useState, useEffect } from "react";
import { MessageSquare, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface CustomOrder {
  id: string; name: string; email: string; phone: string; description: string;
  budget?: string; deadline?: string; status: string; createdAt: string;
}

const STATUSES = ["PENDING","REVIEWING","QUOTED","ACCEPTED","IN_PROGRESS","COMPLETED","CANCELLED"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700", REVIEWING: "bg-blue-50 text-blue-700",
  QUOTED: "bg-purple-50 text-purple-700", ACCEPTED: "bg-teal-50 text-teal-700",
  IN_PROGRESS: "bg-indigo-50 text-indigo-700", COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/custom-orders").then(r => r.json()).then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/custom-orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { toast.success("Status updated"); load(); } else toast.error("Failed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Custom Orders</h1>
          <p className="text-brown-light text-sm">{orders.length} requests · {orders.filter(o => o.status === "PENDING").length} pending</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-2xl skeleton" />) :
          orders.length === 0 ? <div className="text-center py-16 bg-white rounded-2xl text-brown-light">No custom orders yet</div> :
          orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }} className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-cream/30 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="w-10 h-10 rounded-xl bg-blush-light flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={18} className="text-blush-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brown text-sm">{order.name}</p>
                  <p className="text-xs text-brown-light">{order.email} · {order.phone}</p>
                </div>
                <span className={cn("badge text-[10px]", STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600")}>{order.status}</span>
                <p className="text-xs text-brown-light flex-shrink-0">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                <ChevronDown size={15} className={cn("text-brown-light transition-transform flex-shrink-0", expanded === order.id && "rotate-180")} />
              </div>

              {expanded === order.id && (
                <div className="border-t border-border p-4 bg-cream/20 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-brown mb-1">Description</p>
                      <p className="text-sm text-brown-light">{order.description}</p>
                    </div>
                    <div className="space-y-2">
                      {order.budget && <p className="text-sm text-brown-light"><span className="font-medium text-brown">Budget:</span> {order.budget}</p>}
                      {order.deadline && <p className="text-sm text-brown-light"><span className="font-medium text-brown">Deadline:</span> {order.deadline}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-brown">Update Status:</label>
                    <select defaultValue={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                      className="input-soft py-2 text-sm w-44">
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <a href={`mailto:${order.email}`} className="btn-outline py-2 px-4 text-xs">Reply via Email</a>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
      </div>
    </div>
  );
}
