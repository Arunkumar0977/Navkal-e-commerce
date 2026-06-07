import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, image: true, phone: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (e: any) { if (e instanceof Response) return e; return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
