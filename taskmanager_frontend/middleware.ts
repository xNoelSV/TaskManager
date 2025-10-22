import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

// Decode payload without verifying signature (sufficient for front-end UX)
function decodeJwtPayload(token: string): any | null {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(
      base64.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const token = cookies.get("access_token")?.value;

  let isValid = false;

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && typeof payload.exp === "number") {
      const nowSec = Math.floor(Date.now() / 1000);
      const notExpired = payload.exp > nowSec;
      const issuerOk = process.env.JWT_ISSUER
        ? payload.iss === process.env.JWT_ISSUER
        : true;
      isValid = notExpired && issuerOk;
    }
  }

  if (!isValid && !isAuthRoute) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isValid && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images|fonts|api/public).*)",
  ],
};
