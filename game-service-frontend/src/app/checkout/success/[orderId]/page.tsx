/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  UploadCloud,
  ImagePlus,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

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

  const [uploaded, setUploaded] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

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
    if (selected.size > 2 * 1024 * 1024) {
      showToast("error", "File maksimal 2MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(selected.type)) {
      showToast("error", "Hanya file JPG atau PNG yang diperbolehkan");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

  setUploaded(false);
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

  const handleRemoveFile = () => {
  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setFile(null);
  setPreview(null);
  setUploaded(false);
};

const handleUpload = async () => {
  if (!file) {
    showToast("error", "Pilih bukti transfer terlebih dahulu");
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

    if (!res.ok) {
      throw new Error(data.error || "Upload gagal");
    }

    setUploaded(true);
    showToast("success", "Upload berhasil! Silakan lanjut ke Discord atau ke Whatsapp.");
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan saat upload";

    showToast("error", message);
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
          Order Berhasil!
        </h1>

        <p className="text-gray-400 mb-8">
          Proses lebih lanjut akan diarahkan ke Server Discord kami
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
<div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
  {/* HEADER */}
  <div className="border-b border-white/10 bg-white/[0.02] p-5 text-left">
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-lime-400/10 p-3 text-lime-400">
        <UploadCloud size={24} />
      </div>

      <div>
        <h2 className="font-bold text-white">
          Upload Bukti Transfer
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Upload screenshot pembayaran agar order segera diproses.
        </p>
      </div>
    </div>
  </div>

  <div className="p-5">
    {/* DRAG AREA */}
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition ${
        dragging
          ? "border-lime-400 bg-lime-400/10 shadow-lg shadow-lime-400/10"
          : "border-white/10 bg-black/40 hover:border-lime-400/50 hover:bg-lime-400/[0.03]"
      }`}
    >
      <input
        id="proof-upload"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="proof-upload"
        className="flex cursor-pointer flex-col items-center justify-center"
      >
        <div className="mb-4 rounded-full border border-lime-400/30 bg-lime-400/10 p-4 text-lime-400">
          <ImagePlus size={34} />
        </div>

        <p className="text-sm font-semibold text-white">
          Drag & drop bukti transfer di sini
        </p>

        <p className="mt-1 text-sm text-gray-400">
          atau klik untuk memilih gambar
        </p>

        <div className="mt-4 inline-flex rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-lime-300">
          Pilih Gambar
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Format JPG / PNG • Maksimal 2MB
        </p>
      </label>
    </div>

    {/* PREVIEW */}
    {preview && file && (
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-left">
            <p className="max-w-[220px] truncate text-sm font-semibold text-white sm:max-w-sm">
              {file.name}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>

          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={uploading}
            className="rounded-full border border-red-400/30 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
          <img
            src={preview}
            alt="Preview bukti transfer"
            className="mx-auto max-h-72 w-full object-contain"
          />

          {uploaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-black">
                Upload Berhasil
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* SUCCESS INFO */}
    {uploaded && (
      <div className="mt-5 rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4 text-left">
        <div className="flex gap-3">
          <CheckCircle className="mt-0.5 shrink-0 text-lime-400" size={22} />

          <div>
            <p className="font-bold text-lime-300">
              Bukti transfer berhasil diupload
            </p>

            <p className="mt-1 text-sm text-gray-300">
              Silakan lanjut ke Discord untuk proses konfirmasi order.
            </p>

            <a
              href="https://discord.gg/vB5bfRKFfH"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-lime-300"
            >
              Lanjut ke Discord
              <ExternalLink size={16} />
            </a>
                        <p className="mt-1 text-sm text-gray-300">
              Atau lanjut ke admin whatsapp kami untuk proses konfirmasi order.
            </p>

            <a
              href="http://wa.me/6282227529815"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-lime-300"
            >
              Lanjut ke Whatsapp
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    )}

    {/* BUTTON */}
    <button
      type="button"
      onClick={handleUpload}
      disabled={!file || uploading || uploaded}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-4 font-bold text-black transition hover:scale-[1.01] hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      {uploading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Mengupload...
        </>
      ) : uploaded ? (
        <>
          <CheckCircle size={20} />
          Sudah Diupload
        </>
      ) : (
        <>
          <UploadCloud size={20} />
          Upload Bukti Transfer
        </>
      )}
    </button>
  </div>
</div>

{/* TOAST */}
{toast && (
  <div className="fixed left-1/2 top-24 z-[999] w-[90%] max-w-md -translate-x-1/2">
    <div
      className={`flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
        toast.type === "success"
          ? "border-lime-400/40 bg-lime-400/15 text-lime-300"
          : "border-red-400/40 bg-red-500/15 text-red-300"
      }`}
    >
      <div
        className={`rounded-full p-1 ${
          toast.type === "success"
            ? "bg-lime-400/20"
            : "bg-red-500/20"
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
        <p className="mt-1 text-sm text-white/80">
          {toast.message}
        </p>
      </div>
    </div>
  </div>
)}
</div>
    </main>
  );
}