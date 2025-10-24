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
  context: { params?: Promise<{ id?: string }> | { id?: string } }
) {
  const resolvedParams = context?.params ? await context.params : undefined;

  const id =
    resolvedParams?.id ??
    (() => {
      try {
        return new URL(req.url).pathname.split("/").filter(Boolean).pop();
      } catch {
        return undefined;
      }
    })();

  if (!id) {
    return new NextResponse("Task id not provided", { status: 400 });
  }

  const h = await authHeaders();
  if (!h) return new NextResponse("Unauthorized", { status: 401 });
  const body = (await req.json()) as TaskDTO;

  const res = await fetch(`${BACKEND}/tasks/${id}`, {
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
  context: { params?: Promise<{ id?: string }> | { id?: string } }
) {
  const resolvedParams = context?.params ? await context.params : undefined;

  const id =
    resolvedParams?.id ??
    (() => {
      try {
        return new URL(_req.url).pathname.split("/").filter(Boolean).pop();
      } catch {
        return undefined;
      }
    })();

  if (!id) {
    return new NextResponse("Task id not provided", { status: 400 });
  }

  const h = await authHeaders();
  if (!h) return new NextResponse("Unauthorized", { status: 401 });
  const res = await fetch(`${BACKEND}/tasks/${id}`, {
    method: "DELETE",
    headers: h,
  });
  return new NextResponse(null, { status: res.status || 204 });
}
