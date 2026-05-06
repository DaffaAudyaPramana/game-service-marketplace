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
  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login gagal");
      return;
    }

    alert("Login berhasil");

    const pendingCheckout = localStorage.getItem(
 "pending_checkout"
    );

    if (pendingCheckout) {
      const data = JSON.parse(pendingCheckout);

      router.push(
        `/checkout/create?service=${data.service}&item=${encodeURIComponent(
          data.item
        )}&price=${encodeURIComponent(data.price)}`
      );

      return;
    }

    router.push("/");

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan");
  }
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