"use client";

import { useState } from "react";
import {
  MessageSquareText,
  Send,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { API_URL } from "@/lib/api";

export default function FeedbackSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "saran",
    message: "",
    rating: "5",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

const handleSubmit = async () => {
  if (!form.name.trim() || !form.message.trim()) {
    showToast("error", "Nama dan pesan wajib diisi");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        category: form.category,
        message: form.message.trim(),
        rating: Number(form.rating),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Gagal mengirim kritik dan saran");
    }

    const savedFeedback = localStorage.getItem("hyperindo_feedback");
    const feedbackList = savedFeedback ? JSON.parse(savedFeedback) : [];

    localStorage.setItem(
      "hyperindo_feedback",
      JSON.stringify([data.data, ...feedbackList])
    );

    setForm({
      name: "",
      email: "",
      category: "saran",
      message: "",
      rating: "5",
    });

    showToast(
      "success",
      "Terima kasih! Kritik dan saran berhasil dikirim."
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      showToast("error", error.message);
    } else {
      showToast("error", "Gagal mengirim kritik dan saran");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <section
      id="kritik-saran"
      className="relative scroll-mt-24 overflow-hidden bg-black px-6 py-20 text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-lime-400/5 to-black" />

      {toast && (
        <div className="fixed left-1/2 top-24 z-50 w-[90%] max-w-md -translate-x-1/2">
          <div
            className={`flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-lime-400/40 bg-lime-400/15 text-lime-300"
                : "border-red-400/40 bg-red-500/15 text-red-300"
            }`}
          >
            <div
              className={`rounded-full p-1 ${
                toast.type === "success" ? "bg-lime-400/20" : "bg-red-500/20"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>

            <div>
              <p className="text-sm font-bold">
                {toast.type === "success" ? "Berhasil" : "Gagal"}
              </p>
              <p className="mt-1 text-sm text-white/80">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-2 font-bold uppercase tracking-[0.2em] text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]">
              Kritik & Saran
            </p>

            <h2 className="text-3xl font-extrabold md:text-4xl">
              Bantu Kami Menjadi Lebih Baik
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
              Kirimkan kritik, saran, atau masukan untuk HyperIndoStore. Feedback
              kamu membantu kami meningkatkan layanan, proses order, dan
              pengalaman customer.
            </p>
          </div>

          <div className="rounded-3xl border border-lime-400/20 bg-lime-400/10 p-5">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-black">
                <MessageSquareText size={24} />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Masukan customer itu penting
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-300">
                  Kamu bisa menyampaikan kendala, ide fitur, kritik harga,
                  request layanan baru, atau pengalaman selama order.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* LEFT INFO */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white">
                Contoh feedback yang bisa dikirim
              </h3>

              <div className="mt-5 space-y-3 text-sm text-gray-300">
                <div className="rounded-2xl bg-black/30 p-4">
                  Proses order terlalu lama atau kurang jelas.
                </div>

                <div className="rounded-2xl bg-black/30 p-4">
                  Request tambah layanan top up game lain.
                </div>

                <div className="rounded-2xl bg-black/30 p-4">
                  Saran tampilan website, checkout, atau dashboard.
                </div>

                <div className="rounded-2xl bg-black/30 p-4">
                  Kritik terkait harga, metode pembayaran, atau komunikasi admin.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                  <Star size={22} />
                </div>

                <div>
                  <p className="font-bold text-white">Rating layanan</p>
                  <p className="text-sm text-gray-400">
                    Berikan nilai sesuai pengalaman kamu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Nama
                </label>

                <input
                  type="text"
                  placeholder="Masukkan nama"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-gray-500 outline-none transition focus:border-lime-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Email
                  <span className="ml-1 text-gray-500">(opsional)</span>
                </label>

                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-gray-500 outline-none transition focus:border-lime-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Kategori
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition focus:border-lime-400"
                >
                  <option className="bg-black" value="saran">
                    Saran
                  </option>
                  <option className="bg-black" value="kritik">
                    Kritik
                  </option>
                  <option className="bg-black" value="bug">
                    Bug Website
                  </option>
                  <option className="bg-black" value="request">
                    Request Layanan
                  </option>
                  <option className="bg-black" value="lainnya">
                    Lainnya
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Rating
                </label>

                <select
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition focus:border-lime-400"
                >
                  <option className="bg-black" value="5">
                    5 — Sangat Puas
                  </option>
                  <option className="bg-black" value="4">
                    4 — Puas
                  </option>
                  <option className="bg-black" value="3">
                    3 — Cukup
                  </option>
                  <option className="bg-black" value="2">
                    2 — Kurang
                  </option>
                  <option className="bg-black" value="1">
                    1 — Tidak Puas
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Pesan Kritik / Saran
                </label>

                <textarea
                  placeholder="Tulis kritik atau saran kamu di sini..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-gray-500 outline-none transition focus:border-lime-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-6 py-4 font-bold text-black transition hover:scale-[1.01] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              <Send size={18} />
              {loading ? "Mengirim..." : "Kirim Kritik & Saran"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Untuk sementara feedback disimpan di localStorage. Nanti bisa
              disambungkan ke database/backend.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}