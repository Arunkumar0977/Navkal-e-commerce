import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, rating, title, body } = await req.json();
    const hasOrdered = await prisma.orderItem.findFirst({
      where: { productId, order: { userId: user.id, paymentStatus: "PAID" } },
    });
    const review = await prisma.review.create({
      data: { productId, userId: user.id, rating: parseInt(rating), title, body, verified: !!hasOrdered, approved: true },
      include: { user: { select: { name: true, image: true } } },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
