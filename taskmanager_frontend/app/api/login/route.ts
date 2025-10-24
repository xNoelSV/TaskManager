import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { LoginReq, TokenRes } from "@/lib/types";

const BACKEND = process.env.BACKEND_URL!;

export async function POST(req: Request) {
  const body = (await req.json()) as LoginReq;

  const res = await fetch(`${BACKEND}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text || "Invalid credentials", {
      status: res.status,
    });
  }

  const data = (await res.json()) as TokenRes;

  // Store token in HttpOnly cookie
  const maxAge = Math.max(1, Math.floor(data.expires_in)); // seconds
  (await cookies()).set({
    name: "access_token",
    value: data.access_token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge, // in seconds
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
