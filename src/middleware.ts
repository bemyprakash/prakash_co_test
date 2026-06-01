import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const url = req.nextUrl.clone();

  // Protect /admin routes (both UI and API)
  if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin")) {
    if (!req.auth) {
      if (req.nextUrl.pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    
    const role = (req.auth.user as any)?.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      if (req.nextUrl.pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Protect /admin/admins for SUPER_ADMIN only
    if ((req.nextUrl.pathname.startsWith("/admin/admins") || req.nextUrl.pathname.startsWith("/api/admin/users")) && role !== "SUPER_ADMIN") {
      if (req.nextUrl.pathname.startsWith("/api/admin/users")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      url.pathname = "/admin"; // Redirect to general admin dashboard
      return NextResponse.redirect(url);
    }
  }
  
  // Protect /profile or /checkout if needed
  if (req.nextUrl.pathname.startsWith("/profile")) {
    if (!req.auth) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
