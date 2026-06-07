import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ items: [] });
  const items = await prisma.cart.findMany({
    where: { userId: user.id },
    include: { product: { select: { name: true, price: true, images: true, stock: true, slug: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, quantity, color } = await req.json();
    const existing = await prisma.cart.findFirst({ where: { userId: user.id, productId, color: color || null } });
    if (existing) {
      const updated = await prisma.cart.update({ where: { id: existing.id }, data: { quantity: existing.quantity + (quantity || 1) } });
      return NextResponse.json(updated);
    }
    const item = await prisma.cart.create({ data: { userId: user.id, productId, quantity: quantity || 1, color } });
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");
    if (itemId) await prisma.cart.delete({ where: { id: itemId, userId: user.id } });
    else await prisma.cart.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
