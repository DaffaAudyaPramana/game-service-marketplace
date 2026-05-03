"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const price = params.get("price");

  return (
    <main className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-4 text-lime-400">
          Order Berhasil!
        </h1>

        <p className="text-gray-400 mb-8">
          Simpan Order ID ini untuk tracking
        </p>

        {/* ORDER ID */}
        <div className="p-6 border border-white/10 rounded-xl mb-8">
          <p className="text-gray-400 mb-2">Order ID</p>
          <p className="text-xl font-bold text-lime-400">
            {orderId}
          </p>

          <p className="mt-3 text-gray-400 text-sm">
            Total Pembayaran
          </p>

          <p className="text-lg font-semibold text-white">
            Rp {price ? Number(price).toLocaleString("id-ID") : "-"}
          </p>
        </div>

        {/* INFO */}
        <div className="text-left mb-8 space-y-2 text-sm text-gray-300">
          <p>• Silakan lakukan pembayaran</p>
          <p>• Upload bukti transfer di bawah</p>
          <p>• Order akan diproses setelah pembayaran dikonfirmasi</p>
        </div>

        {/* 🔥 PLACEHOLDER UPLOAD */}
        <div className="p-6 border border-white/10 rounded-xl">

          <p className="mb-3 font-semibold">
            Upload Bukti Transfer
          </p>

          <input
            type="file"
            className="w-full mb-4 text-sm"
          />

          {/* <button className="w-full bg-white/10 py-3 rounded">
            Upload (Coming Soon)
          </button> */}

        </div>

      </div>
    </main>
  );
}