import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSecureRequest } from "@/lib/auth-cookie";

export async function POST(req: Request) {
  const secure = await isSecureRequest(req);

  // invalidate cookie
  (await cookies()).set({
    name: "access_token",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
