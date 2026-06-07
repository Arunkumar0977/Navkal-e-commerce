import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    await prisma.newsletterSubscriber.create({ data: { email } });
    return NextResponse.json({ message: "Subscribed!" });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ message: "Already subscribed!" });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
