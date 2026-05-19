"use client";

import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, CheckCircle, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      if (!token) {
        showNotif("error", "Token reset password tidak ditemukan");
        return;
      }

      if (!password || !confirmPassword) {
        showNotif("error", "Password wajib diisi");
        return;
      }

      if (password.length < 6) {
        showNotif("error", "Password minimal 6 karakter");
        return;
      }

      if (password !== confirmPassword) {
        showNotif("error", "Konfirmasi password tidak sama");
        return;
      }

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotif("error", data.error || "Gagal reset password");
        return;
      }

      showNotif("success", data.message || "Password berhasil direset");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      showNotif("error", "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lime-400/5 via-black/70 to-black" />

      {notif && (
        <div className="fixed left-1/2 top-6 z-50 w-[90%] max-w-md -translate-x-1/2">
          <div
            className={`flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
              notif.type === "success"
                ? "border-lime-400/40 bg-lime-400/15 text-lime-300"
                : "border-red-400/40 bg-red-500/15 text-red-300"
            }`}
          >
            <div
              className={`rounded-full p-1 ${
                notif.type === "success" ? "bg-lime-400/20" : "bg-red-500/20"
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
                {notif.type === "success" ? "Berhasil" : "Gagal"}
              </p>
              <p className="mt-1 text-sm text-white/80">{notif.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
              <LockKeyhole size={28} />
            </div>

            <h1 className="text-3xl font-extrabold">Reset Password</h1>

            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Buat password baru untuk akun HyperIndoStore kamu.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password Baru
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-4 pr-12 text-white placeholder:text-gray-500 transition focus:border-lime-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-lime-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Konfirmasi Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-4 pr-12 text-white placeholder:text-gray-500 transition focus:border-lime-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-lime-400"
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
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full rounded-xl bg-lime-400 py-4 font-bold text-black transition hover:scale-[1.02] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Menyimpan..." : "Reset Password"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Sudah ingat password?{" "}
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