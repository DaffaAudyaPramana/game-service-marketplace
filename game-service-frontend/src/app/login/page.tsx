"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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

      const pendingCheckout = localStorage.getItem("pending_checkout");

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
    <main className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/gta-bg.png"
          alt="GTA Background"
          fill
          priority
          className="object-cover opacity-20"
        />
      </div>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <header className="relative z-10 border-b border-white/10">
        <div className="px-6 py-5">
          <h1 className="text-white text-2xl font-bold tracking-wide">
            HyperIndoStore
          </h1>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center px-6 py-16 min-h-[90vh]">
        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">
              Login
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Login guna untuk tracking orderan anda.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Email
              </label>

              <input
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-lime-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full p-4 pr-12 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-lime-400 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lime-400 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-lime-400 text-black py-4 rounded-xl font-bold hover:scale-[1.02] hover:shadow-lg hover:shadow-lime-400/20 transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-400 pt-2">
              Belum punya akun?{" "}
              <Link href="/register" className="text-lime-400 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
