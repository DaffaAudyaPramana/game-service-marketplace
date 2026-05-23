"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CartItem,
  getCart,
  getCartTotal,
  removeCartItem,
  updateCartQuantity,
  clearCart,
} from "@/lib/cart";
import TermsDialog from "@/components/custom/terms-dialog";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  const handleRemove = (id: string) => {
    setItems(removeCartItem(id));
  };

  const handleQuantity = (id: string, quantity: number) => {
    setItems(updateCartQuantity(id, quantity));
  };

  const total = getCartTotal(items);

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-400">
          Keranjang
        </p>

        <h1 className="mt-3 text-3xl font-extrabold">
          Keranjang Order
        </h1>

        <p className="mt-2 text-gray-400">
          Semua item di bawah ini akan dibuat menjadi 1 order.
        </p>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-gray-400">Keranjang masih kosong.</p>

            <button
              onClick={() => router.push("/#layanan")}
              className="mt-5 rounded-xl bg-lime-400 px-5 py-3 font-bold text-black"
            >
              Pilih Layanan
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        {item.service}
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        {item.name}
                      </h2>

                      <p className="mt-2 font-bold text-lime-400">
                        {formatRupiah(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleQuantity(item.id, item.quantity - 1)
                        }
                        className="h-10 w-10 rounded-xl border border-white/10 bg-black/40"
                      >
                        -
                      </button>

                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantity(item.id, item.quantity + 1)
                        }
                        className="h-10 w-10 rounded-xl border border-white/10 bg-black/40"
                      >
                        +
                      </button>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Total</p>
                <p className="text-2xl font-extrabold text-lime-400">
                  {formatRupiah(total)}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    clearCart();
                    setItems([]);
                  }}
                  className="rounded-xl border border-white/10 px-5 py-3 font-bold text-white"
                >
                  Kosongkan Keranjang
                </button>

                <TermsDialog
                    mode="cart-checkout"
                    service="cart"
                    item={`${items.length} item`}
                    price={formatRupiah(total)}
                    triggerLabel="Checkout Semua Item"
                    triggerClassName="rounded-xl bg-lime-400 px-5 py-3 font-bold text-black text-center transition hover:bg-lime-300"
                />
                </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}