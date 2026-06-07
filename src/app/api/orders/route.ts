import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getAuthUser } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function GET() {
  try {
    const user = await requireAuth();
    const isAdmin = user.role === "ADMIN";
    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: user.id },
      include: {
        items: { include: { product: { select: { name: true, images: true, slug: true } } } },
        user:  { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { items, subtotal, shipping, tax, discount, total, couponCode, paymentMethod, shippingAddress, billingAddress, notes, paymentIntentId, razorpay_payment_id } = body;
    const resolvedPaymentId = paymentIntentId || razorpay_payment_id || null;
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber, userId: user.id,
          subtotal, shipping, tax,
          discount: discount || 0, total,
          couponCode, paymentMethod,
          paymentStatus: paymentMethod === "RAZORPAY" && paymentIntentId ? "PAID" : "PENDING",
          paymentIntentId: resolvedPaymentId, shippingAddress, billingAddress, notes,
          items: {
            create: items.map((i: any) => ({
              productId: i.productId, quantity: i.quantity, price: i.price, color: i.color,
            })),
          },
        },
        include: { items: { include: { product: { select: { name: true, images: true, slug: true } } } } },
      });
      for (const item of items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      }
      if (couponCode) {
        await tx.coupon.update({ where: { code: couponCode }, data: { usedCount: { increment: 1 } } });
      }
      return created;
    });

    sendOrderConfirmationEmail(
      user.email, user.name || "Customer", orderNumber,
      order.items.map((i: any) => ({ name: i.product.name, quantity: i.quantity, price: i.price })),
      total
    ).catch(console.error);

    return NextResponse.json({ order, orderNumber }, { status: 201 });
  } catch (e: any) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
