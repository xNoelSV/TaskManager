import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { TaskDTO } from "@/lib/types";

const BACKEND = process.env.BACKEND_URL!;

async function authHeaders() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

export async function GET() {
  const h = await authHeaders();
  if (!h) return new NextResponse("Unauthorized", { status: 401 });

  const res = await fetch(`${BACKEND}/tasks`, {
    headers: h,
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function POST(req: Request) {
  const h = await authHeaders();
  if (!h) return new NextResponse("Unauthorized", { status: 401 });

  const body = (await req.json()) as TaskDTO;

  // Ensure status is one of the allowed enum values
  // body.status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
  const res = await fetch(`${BACKEND}/tasks`, {
    method: "POST",
    headers: { ...h, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}
