import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ items: [] });
  const items = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: { product: { select: { name: true, price: true, images: true, slug: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId } = await req.json();
    try {
      const item = await prisma.wishlist.create({ data: { userId: user.id, productId } });
      return NextResponse.json(item, { status: 201 });
    } catch (e: any) {
      if (e.code === "P2002") return NextResponse.json({ message: "Already in wishlist" });
      throw e;
    }
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (productId) await prisma.wishlist.deleteMany({ where: { userId: user.id, productId } });
    else await prisma.wishlist.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
