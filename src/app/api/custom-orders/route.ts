import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  const { name, email, phone, description, budget, deadline } = await req.json();
  const order = await prisma.customOrder.create({ data: { name, email, phone, description, budget, deadline, userId: user?.id || null } });
  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  try {
    await requireAdmin();
    const orders = await prisma.customOrder.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(orders);
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
