import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { code, orderTotal } = await request.json();

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: code.toUpperCase(),
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 });
  }

  if (coupon.minOrder && orderTotal < coupon.minOrder) {
    return NextResponse.json(
      { error: `Minimum order of ₹${coupon.minOrder} required` },
      { status: 400 }
    );
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }

  let discount =
    coupon.type === "PERCENTAGE"
      ? (orderTotal * coupon.value) / 100
      : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return NextResponse.json({ discount: Math.round(discount), coupon });
}
