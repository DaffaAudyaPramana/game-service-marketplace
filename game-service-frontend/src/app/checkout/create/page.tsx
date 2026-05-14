"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const service = params.get("service") || "";
  const item = params.get("item") || "";
  const price = params.get("price") || "";

  const [form, setForm] = useState({
    name: "",
    method: "login",
    platform: "steam",
    version: "legacy",
    rockstarId: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/auth/me",
        {
          credentials: "include",
        }
      );

      if (res.status === 401) {
        router.push("/login");
      }

    } catch (err) {
      console.error(err);
    }
  };

  checkAuth();
}, [router]);

const handleSubmit = async () => {
  try {
    setLoading(true);

    if (!form.name || !form.rockstarId) {
      alert("Nama & ID Rockstar wajib diisi!");
      return;
    }

    const numericPrice = Number(price.replace(/\D/g, ""));

    const res = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productId: 1,
        totalPrice: numericPrice,

        name: form.name,
        method: form.method,
        platform: form.platform,
        version: form.version,
        gameUserId: form.rockstarId,
        notes: form.notes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Gagal create order");
    }

    const orderId = data.data.order.orderId;
    // const totalPrice = data.data.order.totalPrice;

    // 🔥 REDIRECT KE SUCCESS PAGE
    localStorage.removeItem("pending_checkout");
    router.push(`/checkout/success/${orderId}`);

  } catch (err: unknown) {
    console.error(err);

    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Terjadi kesalahan");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">Checkout</h1>

        {/* 🔥 TEXT BARU */}
        <p className="text-gray-400 mb-6">
          Diisi dengan baik dan benar
        </p>

        {/* ORDER INFO */}
        <div className="p-4 border border-white/10 rounded-xl mb-6">
          <p><strong>Service:</strong> {service}</p>
          <p><strong>Item:</strong> {item}</p>
          <p className="text-lime-400 font-bold">
            <strong>Price:</strong> {price}
          </p>
        </div>

        <div className="space-y-5">

          {/* 1. NAMA */}
          <div>
            <label className="text-sm text-gray-400">Nama</label>
            <input
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* 2. METODE */}
          <div>
            <label className="text-sm text-gray-400">
              Metode Pengerjaan
            </label>
            <select
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.method}
              onChange={(e) =>
                setForm({ ...form, method: e.target.value })
              }
            >
            <option className="bg-black text-white" value="login">
              Via Login
            </option>
            <option className="bg-black text-white" value="invite">
              Invite Session
            </option>
            </select>
          </div>

      {/* INFO */}
        <div className="text-left mb-8 space-y-2 text-sm text-gray-300">
          <p>• Jasa money heist bisa login/invite session.</p>
          <p>• Jasa non-money wajib login.</p>
        </div>

          {/* 3. PLATFORM */}
          <div>
            <label className="text-sm text-gray-400">
              Platform
            </label>
            <select
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.platform}
              onChange={(e) =>
                setForm({ ...form, platform: e.target.value })
              }
            >
              <option className="bg-black text-white" value="steam">
                Steam
                </option>
              <option className="bg-black text-white" value="epic">
                Epic Games
                </option>
            </select>
          </div>

          {/* 4. VERSI */}
          <div>
            <label className="text-sm text-gray-400">
              Versi GTA V
            </label>
            <select
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.version}
              onChange={(e) =>
                setForm({ ...form, version: e.target.value })
              }
            >
              <option className="bg-black text-white" value="legacy">
                Legacy
                </option>
              <option className="bg-black text-white" value="enhanced">
                Enhanced
                </option>
            </select>
          </div>

          {/* 5. ROCKSTAR ID */}
          <div>
            <label className="text-sm text-gray-400">
              Rockstar Games Username
            </label>
            <input
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              placeholder="Masukkan Username Rockstar"
              value={form.rockstarId}
              onChange={(e) =>
                setForm({ ...form, rockstarId: e.target.value })
              }
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="text-sm text-gray-400">
              Request Tambahan
            </label>
            <textarea
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              placeholder="Opsional..."
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </div>

          <Button
            className="w-full bg-lime-400 text-black"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit Order"}
          </Button>

        </div>
      </div>
    </main>
  );
}