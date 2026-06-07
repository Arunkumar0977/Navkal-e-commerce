import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const reviews = await prisma.review.findMany({
      include: { user: { select: { name: true, email: true } }, product: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")!;
    const body = await req.json();
    const review = await prisma.review.update({ where: { id }, data: body });
    return NextResponse.json(review);
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")!;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
