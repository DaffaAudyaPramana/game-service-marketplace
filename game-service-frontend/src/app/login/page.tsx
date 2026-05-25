"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState("/");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      setRedirectPath(redirect);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
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
        showNotif("error", data.error || "Email atau password salah");
        return;
      }

      showNotif("success", "Login berhasil");

      // kasih tahu navbar bahwa status login berubah
      window.dispatchEvent(new Event("auth-change"));

      const pendingCheckout = localStorage.getItem("pending_checkout");

    setTimeout(() => {
      // Prioritas 1: balik ke halaman tujuan sebelum login
      // Contoh: /checkout/create?mode=cart
      if (redirectPath && redirectPath !== "/") {
        router.push(redirectPath);
        return;
      }

      // Prioritas 2: fallback untuk flow checkout lama/single item
      if (pendingCheckout) {
        try {
          const checkoutData = JSON.parse(pendingCheckout);

          router.push(
            `/checkout/create?service=${checkoutData.service}&item=${encodeURIComponent(
              checkoutData.item
            )}&price=${encodeURIComponent(checkoutData.price)}`
          );

          return;
        } catch (err) {
          console.error("Pending checkout tidak valid:", err);
          localStorage.removeItem("pending_checkout");
        }
      }

      // Prioritas 3: default ke homepage
      router.push("/");
    }, 1200);
  } catch (err) {
    console.error(err);
    showNotif("error", "Terjadi kesalahan, coba lagi nanti");
  }
};

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12">
      {notif && (
      <div className="mx-auto w-full max-w-md">
        <div
          className={`flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
            notif.type === "success"
              ? "border-lime-400/40 bg-lime-400/15 text-lime-300 shadow-lime-400/10"
              : "border-red-400/40 bg-red-500/15 text-red-300 shadow-red-500/10"
          }`}
        >
          <div
            className={`mt-0.5 rounded-full p-1 ${
              notif.type === "success"
                ? "bg-lime-400/20"
                : "bg-red-500/20"
            }`}
          >
            {notif.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
          </div>

          <div>
            <p className="text-sm font-bold">
              {notif.type === "success" ? "Berhasil" : "Login gagal"}
            </p>
            <p className="mt-1 text-sm text-white/80">
              {notif.message}
            </p>
          </div>
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
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-center text-3xl font-extrabold sm:text-5xl">
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

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-lime-400 hover:underline"
              >
                Lupa password?
              </Link>

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

           {/* INFO */}
            <div className="text-left mb-8 space-y-2 text-sm text-gray-300">
              <p>• Login ini guna untuk mengirim order ke email anda.</p>
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