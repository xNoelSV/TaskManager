"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usernameOrEmail, setUser] = useState("");
  const [password, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.message || j.error || "No se pudo iniciar sesión");
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Iniciar sesión</h1>
      <input
        className="w-full border rounded p-2"
        placeholder="Usuario o email"
        value={usernameOrEmail}
        onChange={(e) => setUser(e.target.value)}
        required
      />
      <input
        className="w-full border rounded p-2"
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
        required
      />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="w-full rounded bg-black text-white py-2">
        Entrar
      </button>
    </form>
  );
}
