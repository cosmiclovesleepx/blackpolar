import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Bypass completo en desarrollo — quita esto antes de producción
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token");
  if (!sessionCookie) {
    // Redirige al login del sitio principal (apps/web)
    return NextResponse.redirect(new URL("https://blackpolar.org/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"],
};
