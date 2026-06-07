import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { sendShippingUpdateEmail } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { select: { name: true, images: true, slug: true } } } },
        user:  { select: { name: true, email: true } },
      },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.role !== "ADMIN" && order.userId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json(order);
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status, trackingId } = await req.json();
    const order = await prisma.order.update({
      where: { id },
      data: { ...(status && { status }), ...(trackingId !== undefined && { trackingId }) },
      include: { user: { select: { name: true, email: true } } },
    });
    if (status && order.user?.email) {
      sendShippingUpdateEmail(order.user.email, order.user.name || "Customer",
        order.orderNumber, trackingId || order.trackingId || "", status).catch(() => {});
    }
    return NextResponse.json(order);
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
