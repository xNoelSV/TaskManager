"use server";

import { cookies } from "next/headers";

export async function getTokenFromCookie() {
  return (await cookies()).get("access_token")?.value ?? null;
}

export async function api(path: string, init: RequestInit = {}) {
  const token = getTokenFromCookie();

  return fetch(`${process.env.BACKEND_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type":
        (init.headers as any)?.["Content-Type"] ?? "application/json",
    },
    cache: "no-store",
  });
}
