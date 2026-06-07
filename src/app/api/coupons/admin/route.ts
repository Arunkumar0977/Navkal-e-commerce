import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try { await requireAdmin(); return NextResponse.json(await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })); }
  catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const coupon = await prisma.coupon.create({ data: { ...body, code: body.code.toUpperCase() } });
    return NextResponse.json(coupon, { status: 201 });
  } catch (e: any) {
    if (e instanceof Response) return e;
    if (e.code === "P2002") return NextResponse.json({ error: "Code exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")!;
    return NextResponse.json(await prisma.coupon.update({ where: { id }, data: await req.json() }));
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    await prisma.coupon.delete({ where: { id: searchParams.get("id")! } });
    return NextResponse.json({ success: true });
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
