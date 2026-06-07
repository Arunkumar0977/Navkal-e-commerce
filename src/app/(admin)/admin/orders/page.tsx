"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["PENDING","PROCESSING","SHIPPED","DELIVERED","CANCELLED","RETURNED"];
const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-amber-700 bg-amber-50 border-amber-200",
  PROCESSING: "text-blue-700 bg-blue-50 border-blue-200",
  SHIPPED: "text-purple-700 bg-purple-50 border-purple-200",
  DELIVERED: "text-green-700 bg-green-50 border-green-200",
  CANCELLED: "text-red-700 bg-red-50 border-red-200",
  RETURNED: "text-gray-700 bg-gray-50 border-gray-200",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/orders").then((r) => r.json()).then((d) => {
      setOrders(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.orderNumber.includes(search.toUpperCase()) ||
      (o.user?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || o.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (orderId: string, status: string, trackingId?: string) => {
    setUpdatingId(orderId);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingId }),
    });
    setUpdatingId(null);
    if (res.ok) { toast.success("Order updated"); load(); }
    else toast.error("Update failed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Orders</h1>
          <p className="text-brown-light text-sm">{filtered.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-light" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..." className="input-soft pl-9 py-2 text-sm w-56" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="input-soft py-2 text-sm w-40">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-2xl skeleton" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl text-brown-light">No orders found</div>
        ) : filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {/* Row */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-cream/30 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-blush-dark text-sm">{order.orderNumber}</p>
                  <span className={`badge text-[10px] border ${STATUS_COLOR[order.status] || ""}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-brown-light mt-0.5">
                  {order.user?.name} · {order.user?.email}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-brown">{formatPrice(order.total)}</p>
                <p className="text-xs text-brown-light">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <ChevronDown size={16} className={cn("text-brown-light transition-transform flex-shrink-0", expanded === order.id ? "rotate-180" : "")} />
            </div>

            {/* Expanded detail */}
            {expanded === order.id && (
              <div className="border-t border-border p-4 bg-cream/20 space-y-4">
                {/* Items */}
                <div className="flex gap-3 flex-wrap">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream">
                        <Image src={item.product?.images?.[0] || "/placeholder.jpg"} alt="" width={40} height={40} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-brown">{item.product?.name}</p>
                        <p className="text-[10px] text-brown-light">×{item.quantity} · {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="text-xs text-brown-light">
                  <p className="font-medium text-brown mb-1">Shipping to:</p>
                  <p>{(order.shippingAddress as any)?.fullName}</p>
                  <p>{(order.shippingAddress as any)?.street}, {(order.shippingAddress as any)?.city}</p>
                  <p>{(order.shippingAddress as any)?.state} — {(order.shippingAddress as any)?.pincode}</p>
                  <p>📞 {(order.shippingAddress as any)?.phone}</p>
                </div>

                {/* Update status */}
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    defaultValue={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="input-soft py-2 text-sm w-40"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input
                    placeholder="Tracking ID (optional)"
                    defaultValue={order.trackingId || ""}
                    onBlur={(e) => e.target.value !== order.trackingId && updateStatus(order.id, order.status, e.target.value)}
                    className="input-soft py-2 text-sm w-48"
                  />
                  <span className={`badge text-xs ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {order.paymentStatus} · {order.paymentMethod}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
