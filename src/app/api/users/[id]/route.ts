import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type P = { params: Promise<{ id: string }> };
export async function PUT(req: NextRequest, { params }: P) {
  try {
    await requireAdmin();
    const { id } = await params;
    return NextResponse.json(await prisma.user.update({ where: { id }, data: await req.json() }));
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
