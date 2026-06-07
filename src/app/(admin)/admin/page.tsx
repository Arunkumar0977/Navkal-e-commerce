import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Package, Users, TrendingUp, ArrowUp, Clock, CheckCircle2 } from "lucide-react";

async function getStats() {
  const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, pendingOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { take: 1, include: { product: { select: { name: true, images: true } } } },
        },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);

  return { totalOrders, totalRevenue: totalRevenue._sum.total || 0, totalUsers, totalProducts, recentOrders, pendingOrders };
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50",
  PROCESSING: "text-blue-600 bg-blue-50",
  SHIPPED: "text-purple-600 bg-purple-50",
  DELIVERED: "text-green-600 bg-green-50",
  CANCELLED: "text-red-600 bg-red-50",
};

export default async function AdminDashboard() {
  const { totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, pendingOrders } = await getStats();

  const statCards = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "bg-blush-light text-blush-dark", change: "+12% this month" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "bg-lavender-light text-purple-600", change: `${pendingOrders} pending` },
    { label: "Products", value: totalProducts, icon: Package, color: "bg-cream-dark text-brown", change: "Active listings" },
    { label: "Customers", value: totalUsers, icon: Users, color: "bg-green-100 text-green-700", change: "Registered users" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-semibold text-brown">Dashboard</h1>
        <p className="text-brown-light text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-brown-light">{card.label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
            </div>
            <p className="font-cormorant text-3xl font-semibold text-brown mb-1">{card.value}</p>
            <p className="text-xs text-brown-light flex items-center gap-1">
              <ArrowUp size={11} className="text-green-500" /> {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-cormorant text-2xl font-semibold text-brown">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-blush-dark hover:underline">View all</a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-xs text-brown-light font-medium uppercase tracking-wider">Order</th>
                <th className="text-left py-3 px-2 text-xs text-brown-light font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-2 text-xs text-brown-light font-medium uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-2 text-xs text-brown-light font-medium uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-2 text-xs text-brown-light font-medium uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-2 text-xs text-brown-light font-medium uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-cream/30 transition-colors">
                  <td className="py-3 px-2 font-medium text-blush-dark">{order.orderNumber}</td>
                  <td className="py-3 px-2 text-brown">{order.user?.name || "—"}</td>
                  <td className="py-3 px-2 text-brown-light truncate max-w-[140px]">
                    {order.items?.[0]?.product?.name || "—"}
                  </td>
                  <td className="py-3 px-2 font-medium text-brown">{formatPrice(order.total)}</td>
                  <td className="py-3 px-2">
                    <span className={`badge text-[10px] ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-brown-light text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <p className="text-center py-8 text-brown-light text-sm">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
