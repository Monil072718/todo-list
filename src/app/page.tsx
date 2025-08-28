"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Todo App</h1>
      <p className="mb-6">Simple tasks with auth. Login or create an account to continue.</p>
      <div className="flex gap-3">
        <Link href="/login" className="px-4 py-2 rounded bg-black text-white">Login</Link>
        <Link href="/register" className="px-4 py-2 rounded border">Register</Link>
      </div>
    </main>
  );
}
