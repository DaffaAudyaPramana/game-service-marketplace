/* eslint-disable @next/next/no-img-element */
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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // COPY STATE
  const [copied, setCopied] = useState<string | null>(null);

  // COPY FUNCTION
  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("gagal copy");
      }
    }
  };

const validateAndSetFile = (selected: File) => {
  // size
  if (selected.size > 2 * 1024 * 1024) {
    alert("File maksimal 2MB");
    return;
  }

  // type
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(selected.type)) {
    alert("Hanya JPG / PNG");
    return;
  }

  setFile(selected);
  setPreview(URL.createObjectURL(selected));
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setDragging(false);

  const file = e.dataTransfer.files[0];
  if (file) validateAndSetFile(file);
};

const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setDragging(true);
};

const handleDragLeave = () => {
  setDragging(false);
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  validateAndSetFile(selected);
};

const handleUpload = async () => {
  if (!file) {
    alert("Pilih file dulu!");
    return;
  }

  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost:5000/orders/${orderId}/upload-proof`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    alert("Upload berhasil!");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    alert(err.message);
  } finally {
    setUploading(false);
  }
};

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
    return (
      <p className="text-red-500 text-center mt-20">
        Order tidak ditemukan
      </p>
    );
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

        {/* ORDER INFO */}
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

        {/* 💳 PAYMENT METHODS */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Metode Pembayaran
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {/* BCA */}
            <div className="border border-white/10 p-4 rounded-xl text-center">
              <img
              src="/payment/bca.png"
              alt="BCA"
              className="h-10 mx-auto mb-3 object-contain"
              />
              <p className="font-semibold">Bank BCA</p>
              <p className="text-xs text-gray-400">a/n ALVIAN DIKY PUTRA UTOMO</p>
              <p className="text-lime-400 mt-2">5358047992</p>

              <button
                onClick={() => handleCopy("5358047992", "bca")}
                className="mt-2 text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20"
              >
                {copied === "bca" ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* BRI */}
            <div className="border border-white/10 p-4 rounded-xl text-center">
              <img
              src="/payment/bri.png"
              alt="BRI"
              className="h-10 mx-auto mb-3 object-contain"
              />
              <p className="font-semibold">Bank BRI</p>
              <p className="text-xs text-gray-400">a/n ALVIAN DIKY PUTRA UTOMO</p>
              <p className="text-lime-400 mt-2">040801040543505</p>

              <button
                onClick={() => handleCopy("040801040543505", "bri")}
                className="mt-2 text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20"
              >
                {copied === "bri" ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* DANA */}
            <div className="border border-white/10 p-4 rounded-xl text-center">
              <img
              src="/payment/dana.png"
              alt="DANA"
              className="h-10 mx-auto mb-3 object-contain"
              />
              <p className="font-semibold">DANA</p>
              <p className="text-xs text-gray-400">a/n GABRIEL ELIEZER</p>
              <p className="text-lime-400 mt-2">082296221189</p>

              <button
                onClick={() => handleCopy("082296221189", "dana")}
                className="mt-2 text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20"
              >
                {copied === "dana" ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* SHOPEEPAY */}
            <div className="border border-white/10 p-4 rounded-xl text-center">
              <img
              src="/payment/shopeepay.png"
              alt="ShopeePay"
              className="h-10 mx-auto mb-3 object-contain"
              />
              <p className="font-semibold">ShopeePay</p>
              <p className="text-xs text-gray-400">a/n ALVIAN DIKY PUTRA UTOMO</p>
              <p className="text-lime-400 mt-2">089531277179</p>

              <button
                onClick={() => handleCopy("089531277179", "shopee")}
                className="mt-2 text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20"
              >
                {copied === "shopee" ? "Copied!" : "Copy"}
              </button>
            </div>

          </div>
        </div>

        {/* INFO */}
        <div className="text-left mb-8 space-y-2 text-sm text-gray-300">
          <p>• Silakan lakukan pembayaran</p>
          <p>• Upload bukti transfer di bawah</p>
          <p>• Order akan segera diproses setelah pembayaran</p>
          <p>• Tidak Menerima Pembayaran Selain Di Atas!</p>
        </div>

        {/* UPLOAD */}
        <div className="p-6 border border-white/10 rounded-xl">
          <p className="mb-3 font-semibold">
            Upload Bukti Transfer
          </p>

          {/* 🔥 DRAG & DROP AREA */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
              dragging ? "border-lime-400 bg-white/5" : "border-white/10"
            }`}
          >
            <p className="text-sm text-gray-400 mb-2">
              Drag & drop gambar di sini atau
            </p>

            <input
              type="file"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          {/* 🔥 PREVIEW */}
          {preview && (
            <div className="mt-4 relative group">
              <img
                src={preview}
                alt="preview"
                className="rounded-lg border border-white/10 max-h-60 object-contain mx-auto transition-transform group-hover:scale-105"
              />

              {/* 🔥 REMOVE BUTTON */}
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-1 rounded hover:bg-red-500"
              >
                ✕
              </button>
            </div>
          )}

          {/* 🔥 BUTTON */}
          <button
            onClick={handleUpload}
            disabled={!file}
            className="w-full bg-lime-400 text-black py-3 rounded mt-4 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Bukti"}
          </button>
        </div>

      </div>

      {/*POPUP */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-6 py-3 rounded-lg text-sm shadow-lg">
          ✅ Nomor berhasil disalin
        </div>
      )}
    </main>
  );
}