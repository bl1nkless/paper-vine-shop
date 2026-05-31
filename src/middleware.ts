import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (!request.auth?.user || request.auth.user.role !== "owner") {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
