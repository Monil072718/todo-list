"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const token = res.data?.token;
      if (!token) throw new Error("No token returned");
      login(token);
      router.push("/tasks");
    } catch (error) {
      setErr(error?.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={onChange} value={form.email} />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={onChange} value={form.password} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full p-2 rounded bg-black text-white">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
