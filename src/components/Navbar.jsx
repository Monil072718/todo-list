"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="w-full border-b bg-white">
      <nav className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">Todo App</Link>
        <div className="flex gap-3 items-center">
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="text-sm underline">Login</Link>
              <Link href="/register" className="text-sm underline">Register</Link>
            </>
          ) : (
            <button onClick={logout} className="text-sm underline">Logout</button>
          )}
        </div>
      </nav>
    </header>
  );
}
