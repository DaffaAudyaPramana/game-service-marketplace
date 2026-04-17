"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const services = [
  {
    id: "money",
    title: "Money Heist",
    desc: "Dapatkan GTA$ dari hasil run heist (bukan drop).",
    price: "Mulai dari Rp 2.500",
    highlight: true,
  },
  {
    id: "rank",
    title: "Rank Boost",
    desc: "Boost level karakter GTA Online kamu.",
    price: "Mulai dari Rp 20.000",
  },
  {
    id: "unlock",
    title: "Unlock Package",
    desc: "Buka semua item, senjata, kendaraan.",
    price: "Mulai dari Rp 10.000",
  },
  {
    id: "paket",
    title: "Paket Lengkap",
    desc: "Bundle hemat + bonus fitur.",
    price: "Mulai dari Rp 89.000",
  },
];

export default function GTAServicesSection() {
  const router = useRouter();

  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <p className="text-lime-400 font-bold drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]">
            LAYANAN TERSEDIA
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Semua yang Kamu Butuhkan di GTA V
          </h2>
          <p className="text-gray-400">
            Pilih layanan sesuai kebutuhan — semua dikerjakan manual oleh operator berpengalaman.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {services.map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                ${item.highlight ? "border-lime-400" : "border-white/10"}`}
            >
              {/* BADGE */}
              {item.highlight && (
                <span className="text-xs bg-lime-400 text-black px-2 py-1 rounded mb-4 inline-block">
                  🔥 Paling Laris
                </span>
              )}

              {/* TITLE */}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

              {/* DESC */}
              <p className="text-gray-400 text-sm mb-4">{item.desc}</p>

              {/* PRICE + BUTTON */}
              <div className="flex items-center justify-between">
                <p className="text-lime-400 font-bold">{item.price}</p>
                <Button
                  size="sm"
                  className="bg-lime-400 text-black"
                  onClick={() => router.push(`/games/gta-v/services/${item.id}`)}
                >
                  →
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}