"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      router.push("/login");
    } catch (error) {
      setErr(error?.response?.data?.error || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="name" placeholder="Name" className="w-full p-2 border rounded" onChange={onChange} value={form.name} />
        <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={onChange} value={form.email} />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={onChange} value={form.password} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full p-2 rounded bg-black text-white">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </main>
  );
}
