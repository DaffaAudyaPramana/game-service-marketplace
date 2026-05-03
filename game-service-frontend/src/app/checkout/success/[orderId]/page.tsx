"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Order = {
  id: number;
  orderId: string;
  totalPrice: number;
  status: string;
  name?: string;
  method?: string;
  platform?: string;
  version?: string;
  gameUserId?: string;
  notes?: string;
  createdAt: string;
};

export default function SuccessPage() {
const params = useParams();
const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/orders/${orderId}`
        );

        const data = await res.json();

        if (!res.ok) throw new Error("Gagal fetch order");

        setOrder(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return <p className="text-white text-center mt-20">Loading...</p>;
  }

  if (!order) {
    return <p className="text-red-500 text-center mt-20">Order tidak ditemukan</p>;
  }

  return (
    <main className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">

        <h1 className="text-3xl font-bold mb-4 text-lime-400">
          🎉 Order Berhasil!
        </h1>

        <p className="text-gray-400 mb-8">
          Simpan Order ID ini untuk tracking
        </p>

        <div className="p-6 border border-white/10 rounded-xl mb-8">
          <p className="text-gray-400 mb-2">Order ID</p>

          <p className="text-xl font-bold text-lime-400">
            {order.orderId}
          </p>

          <p className="mt-3 text-gray-400 text-sm">
            Total Pembayaran
          </p>

          <p className="text-lg font-semibold text-white">
            Rp {order.totalPrice.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="text-left mb-8 space-y-2 text-sm text-gray-300">
          <p>• Silakan lakukan pembayaran</p>
          <p>• Upload bukti transfer di bawah</p>
          <p>• Order akan diproses setelah pembayaran dikonfirmasi</p>
        </div>

{/* PAYMENT METHODS */}
<div className="p-6 border border-white/10 rounded-xl mb-8">
  <h2 className="text-lg font-semibold mb-6 text-center">
    Metode Pembayaran
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

    {/* BCA */}
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <img
        src="/payment/bca.png"
        alt="BCA"
        className="h-10 mx-auto mb-3 object-contain"
      />
      <p className="text-sm font-semibold">Bank BCA</p>
      <p className="text-xs text-gray-400 mt-1">a/n ALVIAN DIKY PUTRA UTOMO</p>
      <p className="text-sm mt-2 text-lime-400">5358047992</p>
    </div>

    {/* BRI */}
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <img
        src="/payment/bri.png"
        alt="BRI"
        className="h-10 mx-auto mb-3 object-contain"
      />
      <p className="text-sm font-semibold">Bank BRI</p>
      <p className="text-xs text-gray-400 mt-1">a/n ALVIAN DIKY PUTRA UTOMO</p>
      <p className="text-sm mt-2 text-lime-400">040801040543505</p>
    </div>

    {/* DANA */}
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <img
        src="/payment/dana.png"
        alt="DANA"
        className="h-10 mx-auto mb-3 object-contain"
      />
      <p className="text-sm font-semibold">DANA</p>
      <p className="text-xs text-gray-400 mt-1">a/n GABRIEL ELIEZER</p>
      <p className="text-sm mt-2 text-lime-400">082296221189</p>
    </div>

    {/* SHOPEEPAY */}
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <img
        src="/payment/shopeepay.png"
        alt="ShopeePay"
        className="h-10 mx-auto mb-3 object-contain"
      />
      <p className="text-sm font-semibold">ShopeePay</p>
      <p className="text-xs text-gray-400 mt-1">a/n ALVIAN DIKY PUTRA UTOMO</p>
      <p className="text-sm mt-2 text-lime-400">089531277179</p>
    </div>

  </div>
</div>

        <div className="text-left mb-8 space-y-2 text-sm text-gray-300">
          <p>• TIDAK MENERIMA PEMBAYARAN SELAIN DI ATAS, HATI-HATI PENIPUAN BERKEDOK ADMIN</p>
        </div>

        <div className="p-6 border border-white/10 rounded-xl">
          <p className="mb-3 font-semibold">
            Upload Bukti Transfer
          </p>

          <input type="file" className="w-full mb-4 text-sm" />
        </div>

      </div>
    </main>
  );
}