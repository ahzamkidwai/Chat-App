import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
  );
  console.log("Logout API called");

  response.cookies.set("authToken", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  console.log("Logout API called and is finished");

  return response;
}
