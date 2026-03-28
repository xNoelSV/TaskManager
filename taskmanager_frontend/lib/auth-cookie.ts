import { headers } from "next/headers";

export async function isSecureRequest(req?: Request) {
  if (req) {
    const forwardedProto = req.headers.get("x-forwarded-proto");
    if (forwardedProto) return forwardedProto.includes("https");
    return new URL(req.url).protocol === "https:";
  }

  const h = await headers();
  const forwardedProto = h.get("x-forwarded-proto");
  if (forwardedProto) return forwardedProto.includes("https");

  return process.env.NODE_ENV === "production";
}
