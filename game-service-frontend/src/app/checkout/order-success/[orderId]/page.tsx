"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  Home,
  MessageCircle,
  ReceiptText,
  Send,
} from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const discordUrl = "https://discord.gg/yQ7X7ceF8v";

  const whatsappMessage = encodeURIComponent(
    `Halo admin HyperIndoStore, saya sudah upload bukti transfer untuk order ${orderId}. Mohon dibantu proses konfirmasinya.`
  );

  const whatsappAdmins = [
    {
      label: "WhatsApp Admin 1",
      number: "6282227529815",
      description:
        "Hubungi admin WhatsApp kami untuk konfirmasi manual jika kamu tidak memakai Discord.",
    },
    {
      label: "WhatsApp Admin 2",
      number: "6282296221189",
      description:
        "Alternatif admin WhatsApp kami jika admin pertama belum merespon.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-white">
      {/* GRID BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* GRADIENT */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lime-400/10 via-black/70 to-black" />

      <div className="relative z-10 mx-auto flex min-h-[75vh] max-w-4xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
          {/* TOP DECORATION */}
          <div className="border-b border-white/10 bg-lime-400/10 px-6 py-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-lime-400/40 bg-lime-400/15 text-lime-400 shadow-[0_0_40px_rgba(163,230,53,0.2)]">
              <CheckCircle2 size={46} />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-white md:text-4xl">
              Order Berhasil
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300 md:text-base">
              Bukti transfer kamu berhasil diupload. Silakan lanjut ke Discord
              atau WhatsApp admin untuk proses konfirmasi order.
            </p>
          </div>

          {/* CONTENT */}
          <div className="p-6 md:p-8">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                  <ReceiptText size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Order ID</p>

                  <h2 className="mt-1 break-all text-xl font-extrabold text-lime-400">
                    {orderId}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    Simpan Order ID ini untuk tracking dan konfirmasi ke admin.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {/* DISCORD */}
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-lime-400/30 bg-lime-400/10 p-5 transition hover:-translate-y-1 hover:bg-lime-400 hover:text-black"
              >
                <div className="flex h-full items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-black group-hover:bg-black group-hover:text-lime-400">
                      <Send size={22} />
                    </div>

                    <h3 className="font-extrabold">
                      Klik untuk lanjut ke Discord
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-300 group-hover:text-black/80">
                      Masuk ke Discord untuk proses konfirmasi order dan update
                      pengerjaan.
                    </p>
                  </div>

                  <ExternalLink size={18} className="shrink-0" />
                </div>
              </a>

              {/* WHATSAPP ADMINS */}
              {whatsappAdmins.map((admin) => {
                const whatsappUrl = `https://wa.me/${admin.number}?text=${whatsappMessage}`;

                return (
                  <a
                    key={admin.number}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-lime-400/50 hover:bg-lime-400/10"
                  >
                    <div className="flex h-full items-start justify-between gap-4">
                      <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lime-400 group-hover:bg-lime-400 group-hover:text-black">
                          <MessageCircle size={22} />
                        </div>

                        <h3 className="font-extrabold text-white">
                          Klik untuk lanjut ke {admin.label}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
                          {admin.description}
                        </p>
                      </div>

                      <ExternalLink
                        size={18}
                        className="shrink-0 text-gray-400"
                      />
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-lime-400/20 bg-lime-400/10 p-5">
              <p className="text-sm leading-relaxed text-gray-300">
                Admin akan melakukan pengecekan pembayaran terlebih dahulu.
                Setelah pembayaran valid, order kamu akan segera diproses.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/customer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-bold text-white transition hover:border-lime-400/50 hover:text-lime-400"
              >
                <ReceiptText size={18} />
                Lihat Dashboard
              </Link>

              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-5 py-4 text-sm font-bold text-black transition hover:bg-lime-300"
              >
                <Home size={18} />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}