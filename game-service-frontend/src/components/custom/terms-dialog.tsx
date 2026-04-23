"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  service: string;
  item: string;
  price: string;
}

export default function TermsDialog({ service, item, price }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false); // 🎬 exit animation
  const [agree, setAgree] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  // 🔒 SCROLL LOCK
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // ⌨️ ESC CLOSE
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  // 💾 LOAD AGREEMENT
  useEffect(() => {
    const saved = localStorage.getItem("terms_accepted");
    if (saved === "true") setAgree(true);
  }, []);

  // 🔁 CLOSE WITH ANIMATION
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  };

  // 🔁 TOGGLE CHECKBOX (FIX BUG)
  const handleCheckbox = () => {
    const newValue = !agree;
    setAgree(newValue);

    if (newValue) {
      localStorage.setItem("terms_accepted", "true");
    } else {
      localStorage.removeItem("terms_accepted"); // ✅ bisa uncheck lagi
    }
  };

  // 🚀 CONTINUE
  const handleContinue = () => {
    if (!agree) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    router.push(
      `/checkout/create?service=${service}&item=${encodeURIComponent(
        item
      )}&price=${encodeURIComponent(price)}`
    );
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="bg-lime-400 text-black px-4 py-2 rounded-lg hover:scale-105 transition"
      >
        Order
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* BACKDROP */}
          <div
            onClick={handleClose}
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm
              ${closing ? "animate-fadeOut" : "animate-fadeIn"}`}
          />

          {/* MODAL BOX */}
          <div
            className={`relative bg-black text-white w-full max-w-lg p-6 rounded-2xl 
            border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto
            ${closing ? "animate-modalOut" : "animate-modalIn"}`}
          >
            <h2 className="text-xl font-bold mb-4">
              Syarat & Ketentuan
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Mohon baca dengan teliti sebelum melanjutkan.
            </p>

            {/* CONTENT */}
            <div className="text-sm space-y-4 mb-6">

              <div>
                <p className="text-lime-400 font-semibold">WAJIB</p>
                <ul className="list-disc ml-5 text-gray-300">
                  <li>Wajib infokan Legacy / Enhanced</li>
                  <li>Wajib infokan metode login</li>
                  <li>Wajib nonaktifkan 2FA</li>
                  <li>Data login harus valid</li>
                </ul>
              </div>

              <div>
                <p className="text-red-400 font-semibold">DILARANG</p>
                <ul className="list-disc ml-5 text-gray-300">
                  <li>Dilarang login saat proses</li>
                  <li>Dilarang ubah password</li>
                  <li>Dilarang order di tempat lain</li>
                </ul>
              </div>

              <div>
                <p className="text-yellow-400 font-semibold">CATATAN</p>
                <ul className="list-disc ml-5 text-gray-300">
                  <li>Money dari heist, bukan drop</li>
                  <li>Estimasi tidak pasti</li>
                  <li>No refund setelah proses</li>
                </ul>
              </div>

            </div>

            {/* CHECKBOX */}
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={handleCheckbox}
              />
              <span className="text-sm">
                Saya setuju dengan syarat & ketentuan
              </span>
            </label>

            {/* ACTION */}
            <button
              onClick={handleContinue}
              className="w-full bg-lime-400 text-black py-2 rounded-lg font-semibold hover:scale-105 transition"
            >
              Lanjut ke Checkout
            </button>

            {/* CANCEL */}
            <button
              onClick={handleClose}
              className="mt-3 text-sm text-gray-400 hover:text-white"
            >
              Batal
            </button>

            {/* 🔔 TOAST */}
            {showToast && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm animate-fadeIn">
                Harap centang persetujuan terlebih dahulu
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}