import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function
export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  const authPages = ["/login", "/signup", "/verify-otp"];
  const protectedRoutes = [
    "/profile",
    "/dashboard",
    "/settings",
    // "/verify-otp",
  ]; // Add any other protected routes here

  if (token && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to homepage or dashboard
  }

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // Proceed as normal
}

// Config: Run this middleware only on specific routes
export const config = {
  matcher: ["/login", "/signup", "/profile/:path*", "/verify-otp"],
};
