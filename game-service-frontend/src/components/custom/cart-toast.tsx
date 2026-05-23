"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type CartToastItem = {
  id: number;
  name: string;
  price: string;
};

type CartToastEventDetail = {
  name: string;
  price: string;
};

export default function CartToast() {
  const [toasts, setToasts] = useState<CartToastItem[]>([]);
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: number) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleCartToast = (event: Event) => {
      const customEvent = event as CustomEvent<CartToastEventDetail>;

      const id = Date.now() + Math.floor(Math.random() * 10000);

      const newToast: CartToastItem = {
        id,
        name: customEvent.detail?.name || "Item",
        price: customEvent.detail?.price || "",
      };

      // Toast baru ditaruh di bawah toast sebelumnya
      setToasts((prev) => [...prev, newToast]);

      timersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, 3000);
    };

    window.addEventListener("hyperindo-cart-toast", handleCartToast);

    return () => {
      window.removeEventListener("hyperindo-cart-toast", handleCartToast);

      Object.values(timersRef.current).forEach((timer) => {
        clearTimeout(timer);
      });

      timersRef.current = {};
    };
  }, [removeToast]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-5 top-24 z-[9999] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="cart-toast-card overflow-hidden rounded-2xl border border-lime-400/40 bg-[#101010]/95 text-white shadow-2xl shadow-lime-400/10 backdrop-blur-xl"
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-xl font-black text-black">
                ✓
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-extrabold text-lime-400">
                      Berhasil masuk keranjang
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {toast.name}
                    </p>

                    <p className="mt-0.5 text-sm text-gray-400">
                      {toast.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="shrink-0 rounded-full px-2 text-lg leading-none text-gray-400 transition hover:bg-white/10 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Tutup
                  </button>

                  <Link
                    href="/cart"
                    className="rounded-xl bg-lime-400 px-3 py-2 text-xs font-black text-black transition hover:bg-lime-300"
                  >
                    Lihat Keranjang
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-toast-progress h-1 bg-lime-400" />
        </div>
      ))}
    </div>
  );
}