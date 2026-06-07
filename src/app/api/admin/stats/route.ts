import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const [revenue, orders, users, products, ordersByStatus] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.groupBy({ by: ["status"], _count: true }),
    ]);
    return NextResponse.json({ revenue: revenue._sum.total || 0, orders, users, products, ordersByStatus });
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
