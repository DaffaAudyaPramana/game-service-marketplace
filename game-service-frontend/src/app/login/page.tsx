"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 COOKIE
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          placeholder="Email"
          className="w-full p-3 bg-white/5 border border-white/10 rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-white/5 border border-white/10 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-lime-400 text-black py-3 rounded"
        >
          Login
        </button>

        <p
          onClick={() => router.push("/register")}
          className="text-sm text-center text-gray-400 cursor-pointer"
        >
          Belum punya akun? Register
        </p>

      </div>
    </main>
  );
}