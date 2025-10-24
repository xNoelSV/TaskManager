import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { TaskDTO } from "@/lib/types";

const BACKEND = process.env.BACKEND_URL!;

async function authHeaders() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const h = await authHeaders();
  if (!h) return new NextResponse("Unauthorized", { status: 401 });
  const body = (await req.json()) as TaskDTO;

  const res = await fetch(`${BACKEND}/tasks/${params.id}`, {
    method: "PUT",
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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const h = await authHeaders();
  if (!h) return new NextResponse("Unauthorized", { status: 401 });
  const res = await fetch(`${BACKEND}/tasks/${params.id}`, {
    method: "DELETE",
    headers: h,
  });
  return new NextResponse(null, { status: res.status || 204 });
}
