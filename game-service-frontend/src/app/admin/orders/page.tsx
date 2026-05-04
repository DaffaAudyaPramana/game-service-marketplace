"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  orderId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  payment?: {
    proof?: string;
    status: string;
  };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🔥 modal preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/orders");
    const data = await res.json();
    setOrders(data.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (orderId: string, status: string) => {
    try {
      setLoadingId(orderId);

      await fetch(`http://localhost:5000/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchOrders();
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-lime-400 text-black";
    if (status === "rejected") return "bg-red-500";
    return "bg-yellow-500 text-black";
  };

  return (
    <main className="bg-black text-white min-h-screen p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {/* GRID RESPONSIVE */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-white/10 p-4 rounded-xl space-y-3"
          >
            {/* HEADER */}
            <div>
              <p className="text-lime-400 font-bold text-sm break-all">
                {order.orderId}
              </p>

              <p className="text-sm text-gray-400">
                Rp {order.totalPrice.toLocaleString("id-ID")}
              </p>
            </div>

            {/* STATUS */}
            <span
              className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>

            {/* IMAGE CLICKABLE */}
            {order.payment?.proof && (
              <img
                src={`http://localhost:5000/uploads/${order.payment.proof}`}
                alt="bukti"
                className="w-full h-40 object-cover rounded cursor-pointer hover:opacity-80 transition"
                onClick={() =>
                  setPreviewImage(
                    `http://localhost:5000/uploads/${order.payment?.proof}`
                  )
                }
              />
            )}

            {/* ACTION BUTTON */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() =>
                  handleAction(order.orderId, "approved")
                }
                disabled={loadingId === order.orderId}
                className="flex-1 bg-lime-400 text-black py-2 rounded text-sm font-semibold disabled:opacity-50"
              >
                {loadingId === order.orderId
                  ? "Processing..."
                  : "Approve"}
              </button>

              <button
                onClick={() =>
                  handleAction(order.orderId, "rejected")
                }
                disabled={loadingId === order.orderId}
                className="flex-1 bg-red-500 py-2 rounded text-sm font-semibold disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded"
          />
        </div>
      )}
    </main>
  );
}