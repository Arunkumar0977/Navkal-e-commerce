import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute    = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/checkout(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard and checkout — redirect to sign-in if not authed
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Admin routes — must be signed in AND have ADMIN role (checked via publicMetadata)
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    const role = (sessionClaims?.metadata as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
