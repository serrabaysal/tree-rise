import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const UNAUTH_PATHS = ["/login", "/register"];
  const AUTH_PATHS = ["/map", "/etkinlikler"];
  
  const path = request.nextUrl.pathname;
  
  const isPathAPI = path.startsWith("/api/");
  
  if (UNAUTH_PATHS.some((p) => path.startsWith(p))) {
    const token = request.cookies.get("token")?.value;
    if (token) {
      return NextResponse.redirect(new URL("/map", request.url));
    }
    return NextResponse.next();
  }

 
  if (AUTH_PATHS.some((p) => path.startsWith(p))) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isPathAPI) {
    const token = request.cookies.get("token")?.value;
    console.log("token req api:",token);
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/map/:path*", "/login", "/register", "/api/activities/:path*"],
};


  