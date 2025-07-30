import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function
export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  const authPages = ["/login", "/signup"];

  // ✅ If user is authenticated, prevent access to login or signup
  if (token && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to homepage or dashboard
  }

  return NextResponse.next(); // Proceed as normal
}

// Config: Run this middleware only on specific routes
export const config = {
  matcher: ["/login", "/signup"],
};
