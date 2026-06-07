import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { name, description, image } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const cat = await prisma.category.create({ data: { name, slug, description, image } });
    return NextResponse.json(cat, { status: 201 });
  } catch (e: any) {
    if (e instanceof Response) return e;
    if (e.code === "P2002") return NextResponse.json({ error: "Already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
