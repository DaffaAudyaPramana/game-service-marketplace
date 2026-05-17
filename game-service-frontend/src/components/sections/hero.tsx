// import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-black text-white px-6 pt-12 pb-24 text-center overflow-visible">
      {/* GRID BACKGROUND */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-3xl mx-auto pt-12">

        {/* BADGE */}
        <div className="inline-block px-4 py-1 mb-6 text-xs border border-green-500 text-green-400 rounded-full">
          GTA V PC ONLY - INDONESIA
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          JOKI GTA V{" "}
          <span className="text-lime-400">ONLINE</span>{" "}
        </h1>

        {/* DESC */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          Money drop, rank boost, unlock all, heist service — semua dikerjakan
          oleh joki berpengalaman. Proses cepat, aman, harga terbaik.
        </p>
        
              {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/#layanan"
            className="rounded-full bg-lime-400 px-6 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-lime-300"
          >
            Lihat Layanan
          </Link>

          <Link
            href="/#kritik-saran"
            className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-lime-400/60 hover:bg-lime-400/10 hover:text-lime-400"
          >
            Kritik & Saran
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="relative z-10 mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 border border-white/10 rounded-xl p-6 bg-black/30 backdrop-blur-sm">

        <div>
          <p className="text-xl font-bold">100+</p>
          <p className="text-gray-400 text-sm">Order selesai</p>
        </div>

        <div>
          <p className="text-xl font-bold">4.5★</p>
          <p className="text-gray-400 text-sm">Rating kepuasan</p>
        </div>

        <div>
          <p className="text-xl font-bold">&lt;30 mnt</p>
          <p className="text-gray-400 text-sm">Rata-rata proses</p>
        </div>

        <div>
          <p className="text-xl font-bold">24/7</p>
          <p className="text-gray-400 text-sm">Admin Siap melayani</p>
        </div>
      </div>
    </section>
  );
}