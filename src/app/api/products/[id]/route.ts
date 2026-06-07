import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }], isActive: true },
    include: {
      category: true, variants: true,
      reviews: { where: { approved: true }, include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" } },
      _count: { select: { reviews: true } },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        price:        body.price        ? parseFloat(body.price)        : undefined,
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : undefined,
        stock:        body.stock !== undefined ? parseInt(body.stock)   : undefined,
      },
    });
    return NextResponse.json(product);
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
