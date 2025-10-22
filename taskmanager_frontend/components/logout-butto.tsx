"use client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        router.replace("/login");
      }}
      className="rounded px-3 py-2 border"
    >
      Logout
    </button>
  );
}
