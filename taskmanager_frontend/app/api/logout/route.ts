import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // invalidate cookie
  (await cookies()).set({
    name: "access_token",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
