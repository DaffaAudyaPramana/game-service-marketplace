"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!email.trim()) {
        showNotif("error", "Email wajib diisi");
        return;
      }

      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotif("error", data.error || "Gagal mengirim reset password");
        return;
      }

      showNotif("success", data.message || "Link reset password telah dikirim");
    } catch (err) {
      console.error(err);
      showNotif("error", "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100svh-132px)] overflow-hidden bg-black px-4 py-6 text-white sm:px-6 md:min-h-[calc(100svh-76px)]">
      {/* BACKGROUND IMAGE - SAMA SEPERTI LOGIN */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/gta-bg.png"
          alt="GTA Background"
          fill
          priority
          className="scale-110 object-cover opacity-25 blur-sm"
        />
      </div>

    {/* DARK OVERLAY */}
    <div className="pointer-events-none absolute inset-0 z-[1] bg-black/70" />
    <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/30 via-black/70 to-black" />

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

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-190px)] w-full max-w-md flex-col justify-center py-8 md:min-h-[calc(100svh-140px)]">
        <Link
          href="/login"
          className="mb-5 inline-flex w-fit items-center gap-2 text-sm text-gray-400 transition hover:text-lime-400"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
              <Mail size={28} />
            </div>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Lupa Password
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Masukkan email akun kamu. Kami akan mengirim link untuk reset password.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                placeholder="Masukkan email akun kamu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-white placeholder:text-gray-500 transition focus:border-lime-400 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl bg-lime-400 py-4 font-bold text-black transition hover:scale-[1.02] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>

            <p className="text-center text-xs leading-relaxed text-gray-500">
              Link reset password hanya berlaku selama 15 menit.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}