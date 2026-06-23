import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mapea subdominios reales a su ruta interna dentro de apps/web.
// Si más adelante quieres tlm.blackpolar.org, agrégalo aquí también.
const HOST_REWRITES: Record<string, string> = {
  "portfolios.blackpolar.org": "/portfolios",
};

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0] ?? "";
  const prefix = HOST_REWRITES[hostname];

  if (prefix && !request.nextUrl.pathname.startsWith(prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}${request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // No reescribir assets estáticos ni internals de Next
  matcher: ["/((?!_next|assets|js|favicon.ico).*)"],
};
