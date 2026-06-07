"use client";
import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, User, LogOut, CheckCircle2, Truck, XCircle, Clock, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pending",    color: "text-amber-600 bg-amber-50" },
  PROCESSING: { label: "Processing", color: "text-blue-600 bg-blue-50" },
  SHIPPED:    { label: "Shipped",    color: "text-purple-600 bg-purple-50" },
  DELIVERED:  { label: "Delivered",  color: "text-green-600 bg-green-50" },
  CANCELLED:  { label: "Cancelled",  color: "text-red-600 bg-red-50" },
  RETURNED:   { label: "Returned",   color: "text-gray-600 bg-gray-50" },
};

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/orders")
        .then(r => r.json())
        .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [isSignedIn]);

  if (!isLoaded || !isSignedIn) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blush-dark border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { id: "orders", label: "Orders",  icon: ShoppingBag },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blush-light flex-shrink-0">
          {user.imageUrl
            ? <Image src={user.imageUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
            : <span className="font-cormorant text-3xl text-blush-dark flex items-center justify-center h-full">{user.firstName?.[0] || "?"}</span>
          }
        </div>
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Hello, {user.firstName}! 👋</h1>
          <p className="text-sm text-brown-light">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders",  value: orders.length,                                                              icon: ShoppingBag },
          { label: "Delivered",     value: orders.filter(o => o.status === "DELIVERED").length,                        icon: CheckCircle2 },
          { label: "In Progress",   value: orders.filter(o => ["PENDING","PROCESSING","SHIPPED"].includes(o.status)).length, icon: Truck },
          { label: "Cancelled",     value: orders.filter(o => o.status === "CANCELLED").length,                        icon: XCircle },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card-soft p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-light flex items-center justify-center">
              <stat.icon size={18} className="text-blush-dark" />
            </div>
            <div>
              <p className="text-2xl font-cormorant font-semibold text-brown">{stat.value}</p>
              <p className="text-xs text-brown-light">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id ? "bg-blush-dark text-white" : "text-brown hover:bg-cream")}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
          <Link href="/wishlist" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brown hover:bg-cream transition-all">
            <Heart size={16} /> Wishlist
          </Link>
          <Link href="/shop" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brown hover:bg-cream transition-all">
            <ShoppingBag size={16} /> Shop More
          </Link>
          <button onClick={() => signOut(async () => { window.location.href = "/"; })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          {activeTab === "orders" && (
            <div>
              <h2 className="font-cormorant text-2xl font-semibold text-brown mb-4">My Orders</h2>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 card-soft">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="text-brown-light">No orders yet. Go shop something beautiful!</p>
                  <Link href="/shop" className="btn-primary inline-block mt-4">Shop Now</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const conf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    return (
                      <div key={order.id} className="card-soft p-5">
                        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                          <div>
                            <p className="font-medium text-brown text-sm">{order.orderNumber}</p>
                            <p className="text-xs text-brown-light">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <span className={`badge text-xs ${conf.color}`}>{conf.label}</span>
                        </div>
                        <div className="flex items-center gap-3 overflow-x-auto mb-4">
                          {order.items?.map(item => (
                            <div key={item.id} className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-cream">
                              <Image src={item.product?.images?.[0] || "/placeholder.jpg"} alt={item.product?.name || ""}
                                width={48} height={48} className="object-cover w-full h-full" />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-brown-light">{order.items?.length} item(s)</p>
                            <p className="font-semibold text-blush-dark">{formatPrice(order.total)}</p>
                          </div>
                          {order.trackingId && (
                            <p className="text-xs text-brown-light">
                              Tracking: <span className="text-blush-dark font-medium">{order.trackingId}</span>
                            </p>
                          )}
                          <span className="text-xs text-brown-light capitalize">{order.paymentMethod}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="card-soft p-6">
              <h2 className="font-cormorant text-2xl font-semibold text-brown mb-6">My Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brown mb-1.5">Full Name</label>
                  <input defaultValue={user.fullName || ""} className="input-soft" disabled />
                  <p className="text-xs text-brown-light mt-1">Update your name in your Clerk profile settings.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown mb-1.5">Email</label>
                  <input defaultValue={user.primaryEmailAddress?.emailAddress || ""} className="input-soft" disabled />
                </div>
                <a href="https://accounts.clerk.dev/user" target="_blank" rel="noopener noreferrer"
                  className="btn-primary inline-block">
                  Manage Profile on Clerk →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
