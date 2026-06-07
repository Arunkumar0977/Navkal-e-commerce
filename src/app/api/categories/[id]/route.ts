import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type P = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: P) {
  try {
    await requireAdmin();
    const { id } = await params;
    const cat = await prisma.category.update({ where: { id }, data: await req.json() });
    return NextResponse.json(cat);
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: P) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
