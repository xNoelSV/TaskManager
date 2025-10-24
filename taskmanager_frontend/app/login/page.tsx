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
    if (!res.ok) {
      setErr(await res.text());
      return;
    }
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
    if (!res.ok) {
      setErr(await res.text());
      return;
    }
    // tras registrar, enviamos a login
    setMode("login");
    setUsernameOrEmail(email || username);
  }

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "64px auto",
        padding: 24,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
      }}
    >
      <h1 style={{ marginBottom: 16 }}>Auth</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("login")} disabled={mode === "login"}>
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          disabled={mode === "register"}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={doLogin} style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Login"}
          </button>
        </form>
      ) : (
        <form onSubmit={doRegister} style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={regPass}
            onChange={(e) => setRegPass(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Register"}
          </button>
        </form>
      )}

      {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}
    </main>
  );
}
