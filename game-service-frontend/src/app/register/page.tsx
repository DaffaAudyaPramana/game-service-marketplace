"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [notif, setNotif] = useState<{
  type: "success" | "error";
  message: string;
} | null>(null);

const showNotif = (type: "success" | "error", message: string) => {
  setNotif({ type, message });

  setTimeout(() => {
    setNotif(null);
  }, 3000);
};

const handleRegister = async () => {
  if (
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    !form.email.trim () ||
    !form.password  ||
    !form.confirmPassword
  ) {
    showNotif("error", "Semua field wajib diisi");
    return;
  }

  if (form.password !== form.confirmPassword) {
    showNotif("error", "Konfirmasi password tidak sama");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotif("error", data.error || "Register gagal");
      return;
    }

    showNotif("success", "Register berhasil, silakan login");

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  } catch (err) {
    console.error(err);
    showNotif("error", "Terjadi kesalahan");
  }
};

  return (
    
    <main className="relative min-h-screen bg-black overflow-hidden">
      {notif && (
        <div className="fixed top-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
              notif.type === "success"
                ? "border-lime-400/30 bg-lime-400/15 text-lime-300"
                : "border-red-400/30 bg-red-400/15 text-red-300"
            }`}
          >
            {notif.type === "success" ? (
              <CheckCircle size={22} />
            ) : (
              <XCircle size={22} />
            )}

            <p className="text-sm font-medium">{notif.message}</p>
          </div>
        </div>
      )}
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

      <div className="relative z-10 flex items-center justify-center px-6 py-16 min-h-[90vh]">
        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">
              Register
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Buat akun di HyperIndoStore untuk akses order di web kami.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Nama Depan
                </label>

                <input
                  type="text"
                  placeholder="Nama depan"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-lime-400 transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Nama Belakang
                </label>

                <input
                  type="text"
                  placeholder="Nama belakang"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-lime-400 transition"
                />
              </div>
            </div>
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

            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Konfirmasi Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="w-full p-4 pr-12 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-lime-400 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lime-400 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-lime-400 text-black py-4 rounded-xl font-bold hover:scale-[1.02] hover:shadow-lg hover:shadow-lime-400/20 transition"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-400 pt-2">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-lime-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}