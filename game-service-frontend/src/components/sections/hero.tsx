import { Button } from "@/components/ui/button"
// import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-black text-white py-24 px-6 text-center relative overflow-hidden">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* BADGE */}
        <div className="inline-block px-4 py-1 mb-6 text-xs border border-green-500 text-green-400 rounded-full">
          GTA V PC ONLY - INDONESIA
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Jasa GTA V{" "}
          <span className="text-lime-400">Online</span>{" "}
          <span className="text-gray-400">Terpercaya</span>
        </h1>

        {/* DESC */}
        <p className="text-gray-400 mb-8">
          Money drop, rank boost, unlock all, heist service — semua dikerjakan
          operator berpengalaman. Proses cepat, aman, harga terbaik.
        </p>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          <Button className="bg-white text-black hover:bg-gray-200">
            Lihat Semua Layanan
          </Button>

          <Button variant="outline" className="border-white text-white">
            Cara Kerja
          </Button>
        </div>

      </div>

      {/* STATS */}
      <div className="relative z-10 mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 border border-white/10 rounded-xl p-6">

        <div>
          <p className="text-xl font-bold">15+</p>
          <p className="text-gray-400 text-sm">Order selesai</p>
        </div>

        <div>
          <p className="text-xl font-bold">4.9★</p>
          <p className="text-gray-400 text-sm">Rating kepuasan</p>
        </div>

        <div>
          <p className="text-xl font-bold">&lt;30 mnt</p>
          <p className="text-gray-400 text-sm">Rata-rata proses</p>
        </div>

        <div>
          <p className="text-xl font-bold">24/7</p>
          <p className="text-gray-400 text-sm">Siap melayani</p>
        </div>

      </div>

    </section>
  );
}