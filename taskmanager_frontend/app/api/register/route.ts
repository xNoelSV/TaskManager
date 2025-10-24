import { NextResponse } from "next/server";
import type { RegisterReq } from "@/lib/types";

const BACKEND = process.env.BACKEND_URL!;

export async function POST(req: Request) {
  const body = (await req.json()) as RegisterReq;

  const res = await fetch(`${BACKEND}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "text/plain",
    },
  });
}
