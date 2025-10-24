"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // login
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  // register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ usernameOrEmail, password }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (!res.ok) return setErr(await res.text());
    router.push(next);
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password: regPass }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (!res.ok) return setErr(await res.text());
    setMode("login");
    setUsernameOrEmail(email || username);
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white/95 p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold text-black ${
              mode === "login" ? "bg-white shadow" : "text-slate-400"
            }`}
            onClick={() => setMode("login")}
          >
            Log in
          </button>
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold text-black ${
              mode === "register" ? "bg-white shadow" : "text-slate-400"
            }`}
            onClick={() => setMode("register")}
          >
            Sign in
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={doLogin} className="grid gap-3">
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="mt-2 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "…" : "Log in"}
            </button>
          </form>
        ) : (
          <form onSubmit={doRegister} className="grid gap-3">
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Password"
              type="password"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              required
            />
            <button
              className="mt-2 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "…" : "Create account"}
            </button>
          </form>
        )}

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      </div>
    </main>
  );
}
