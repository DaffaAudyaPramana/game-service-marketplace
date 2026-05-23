"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import {
  CartItem,
  clearCart,
  getCart,
  getCartTotal,
  parseRupiah,
} from "@/lib/cart";

export default function CheckoutCreateClient() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "";
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const router = useRouter();

  const service = searchParams.get("service") || "";
  const item = searchParams.get("item") || "";
  const price = searchParams.get("price") || "";
  const productIdParam = searchParams.get("productId") || "";
  const productId = Number(productIdParam);

  const [form, setForm] = useState({
    name: "",
    method: "login",
    platform: "steam",
    version: "legacy",
    rockstarId: "",
    whatsapp: "",
    discordUsername: "",
    notes: "",
  });

  const singleItemPrice = parseRupiah(price);

  const checkoutItems =
    mode === "cart"
      ? cartItems
      : [
          {
            id: `${service}-${item}-${singleItemPrice}`,
            service,
            name: item,
            price: singleItemPrice,
            quantity: 1,
          },
        ];

  const checkoutTotal = getCartTotal(checkoutItems);

  const [loading, setLoading] = useState(false);
  const [processingDots, setProcessingDots] = useState(".");

  useEffect(() => {
    if (mode === "cart") {
      setCartItems(getCart());
    }
  }, [mode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!loading) {
      setProcessingDots(".");
      return;
    }

    const interval = setInterval(() => {
      setProcessingDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 450);

    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const customerName = form.name.trim();
      const rockstarId = form.rockstarId.trim();
      const whatsapp = form.whatsapp.trim();
      const discordUsername = form.discordUsername.trim();

      if (!checkoutItems.length || checkoutTotal <= 0) {
        alert("Item checkout tidak valid. Silakan pilih item ulang.");
        return;
      }

      if (!customerName || !rockstarId || !whatsapp || !discordUsername) {
        alert("Nama, Rockstar ID, WhatsApp, dan Username Discord wajib diisi!");
        return;
      }

      if (productIdParam && (!productId || Number.isNaN(productId))) {
        alert("Produk tidak valid. Silakan pilih item ulang.");
        return;
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems.map((item) => ({
            productId: item.productId,
            service: item.service,
            name: item.name,
            item: item.name,
            price: item.price,
            quantity: item.quantity,
          })),

          name: customerName,
          method: form.method,
          platform: form.platform,
          version: form.version,
          gameUserId: rockstarId,
          whatsapp,
          discordUsername,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal create order");
      }

      const orderId = data.data.order.orderId;

      localStorage.removeItem("pending_checkout");

      if (mode === "cart") {
        clearCart();
      }

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

        <div className="p-4 border border-white/10 rounded-xl mb-6">
          <p className="mb-3 font-bold">Ringkasan Order</p>

          <div className="space-y-3">
            {checkoutItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    {item.service} x{item.quantity}
                  </p>
                </div>

                <p className="font-bold text-lime-400">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <p className="font-bold">Total</p>
            <p className="text-xl font-extrabold text-lime-400">
              Rp {checkoutTotal.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <p className="text-gray-400 mb-6">Isi data anda yang sesuai dan benar</p>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-400">Nama</label>
            <input
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Metode Pengerjaan
            </label>
            <select
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.method}
              onChange={(e) =>
                setForm({
                  ...form,
                  method: e.target.value,
                })
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

          <div className="text-left mb-8 space-y-2 text-sm text-gray-300">
            <p>• Jasa money heist bisa login/invite session.</p>
            <p>• Jasa non-money wajib login.</p>
          </div>

          <div>
            <label className="text-sm text-gray-400">Platform</label>
            <select
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.platform}
              onChange={(e) =>
                setForm({
                  ...form,
                  platform: e.target.value,
                })
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

          <div>
            <label className="text-sm text-gray-400">Versi GTA V</label>
            <select
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              value={form.version}
              onChange={(e) =>
                setForm({
                  ...form,
                  version: e.target.value,
                })
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

          <div>
            <label className="text-sm text-gray-400">
              Rockstar Games Username
            </label>
            <input
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              placeholder="Masukkan Username Rockstar"
              value={form.rockstarId}
              onChange={(e) =>
                setForm({
                  ...form,
                  rockstarId: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">WhatsApp</label>
            <input
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              placeholder="Contoh: 6281234567890"
              value={form.whatsapp}
              onChange={(e) =>
                setForm({
                  ...form,
                  whatsapp: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Username Discord</label>
            <input
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              placeholder="Contoh: daffaaudya / daffa#1234 || jika tidak pakai isi - saja"
              value={form.discordUsername}
              onChange={(e) =>
                setForm({
                  ...form,
                  discordUsername: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Request Tambahan
            </label>
            <textarea
              className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
              placeholder="Opsional..."
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
            />
          </div>

          <Button
            className="w-full bg-lime-400 text-black hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />

                <span className="min-w-[105px] text-left font-semibold">
                  Processing{processingDots}
                </span>
              </span>
            ) : (
              "Submit Order"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}