/**
 * Clerk auth helpers
 * Wraps Clerk's auth() for use in server components and API routes.
 * Syncs Clerk user to local DB on first access.
 */
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export type AuthUser = {
  id: string;       // local DB id
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
};

/**
 * Get the current authenticated user from DB (synced from Clerk).
 * Returns null if not signed in.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // Look up in DB
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });

  // First-time: sync from Clerk
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email =
      clerkUser.emailAddresses[0]?.emailAddress ?? "";

    user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
        image: clerkUser.imageUrl ?? null,
        email,
      },
      create: {
        clerkId: userId,
        email,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
        image: clerkUser.imageUrl ?? null,
        role: "USER",
      },
    });
  }

  return user as AuthUser;
}

/**
 * Require auth — returns user or throws 401 response.
 * Use inside API route handlers.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

/**
 * Require admin — returns user or throws 403 response.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}
