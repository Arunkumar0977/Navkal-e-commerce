import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Verify signature
  const svixId        = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: any;
  try {
    event = wh.verify(body, {
      "svix-id":        svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    const clerkId    = data.id as string;
    const email      = (data.email_addresses?.[0]?.email_address ?? "") as string;
    const firstName  = (data.first_name ?? "") as string;
    const lastName   = (data.last_name  ?? "") as string;
    const name       = `${firstName} ${lastName}`.trim() || null;
    const image      = (data.image_url ?? null) as string | null;

    await prisma.user.upsert({
      where:  { clerkId },
      update: { email, name, image },
      create: { clerkId, email, name, image, role: "USER" },
    });
  }

  if (type === "user.deleted") {
    const clerkId = data.id as string;
    // Soft delete: keep orders/reviews, just mark user
    await prisma.user.updateMany({
      where: { clerkId },
      data:  { email: `deleted_${clerkId}@deleted.com`, name: "Deleted User" },
    }).catch(() => {});  // ignore if user doesn't exist
  }

  return NextResponse.json({ received: true });
}
