"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Register berhasil, silakan login");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">

        <h1 className="text-2xl font-bold text-center">
          Register
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
          onClick={handleRegister}
          className="w-full bg-lime-400 text-black py-3 rounded"
        >
          Register
        </button>

      </div>
    </main>
  );
}