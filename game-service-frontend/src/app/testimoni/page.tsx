import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    name: "Customer #001",
    service: "Money Heist",
    image: "/testimonials/testi-1.png",
  },
  {
    name: "Customer #002",
    service: "Money Heist",
    image: "/testimonials/testi-2.png",
  },
  {
    name: "Customer #003",
    service: "Money Heist",
    image: "/testimonials/testi-3.png",
  },
  {
    name: "Customer #004",
    service: "Money Heist",
    image: "/testimonials/testi-4.png",
  },
  {
    name: "Customer #005",
    service: "Money Heist",
    image: "/testimonials/testi-5.png",
  },
  {
    name: "Customer #006",
    service: "Paket Lengkap",
    image: "/testimonials/testi-6.png",
  },
  {
    name: "Customer #007",
    service: "Money Heist",
    image: "/testimonials/testi-7.png",
  },
    {
    name: "Customer #008",
    service: "Money Heist",
    image: "/testimonials/testi-8.png",
  },
      {
    name: "Customer #009",
    service: "Money Heist",
    image: "/testimonials/testi-9.png",
  },
      {
    name: "Customer #010",
    service: "Money Heist",
    image: "/testimonials/testi-10.png",
  },
];

export default function TestimoniPage() {
  return (
        <main className="min-h-screen bg-black text-white">
    {/* HERO */}
    <section className="relative z-10 px-6 pt-12 pb-16">
        <div className="pointer-events-none absolute inset-x-0 -top-20 bottom-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-black/40 to-black" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-5 inline-flex rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-1 text-xs font-semibold text-lime-400">
            BUKTI ORDER & TESTIMONI
        </div>

        <h1 className="mb-5 text-4xl font-extrabold tracking-tight md:text-6xl">
            Testimoni Customer
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
            Beberapa bukti order dan feedback customer HyperIndoStore. Semua
            screenshot ditampilkan sebagai dokumentasi transaksi dan hasil layanan.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
            href="/#layanan"
            className="rounded-full bg-lime-400 px-6 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-lime-300"
            >
            Order Sekarang
            </Link>

            <Link
            href="/"
            className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-lime-400/60 hover:text-lime-400"
            >
            Kembali ke Beranda
            </Link>
        </div>
    </div>
</section>

      {/* STATS */}
      <section className="px-6 pb-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
            <p className="text-2xl font-extrabold text-lime-400">100+</p>
            <p className="mt-1 text-xs text-gray-400">Order selesai</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
            <p className="text-2xl font-extrabold text-lime-400">4.5★</p>
            <p className="mt-1 text-xs text-gray-400">Rating customer</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
            <p className="text-2xl font-extrabold text-lime-400">PC</p>
            <p className="mt-1 text-xs text-gray-400">GTA V Online</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
            <p className="text-2xl font-extrabold text-lime-400">24/7</p>
            <p className="mt-1 text-xs text-gray-400">Siap melayani</p>
          </div>
        </div>
      </section>

      {/* TESTIMONI GRID */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Testimoni</h2>
            </div>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl transition hover:-translate-y-1 hover:border-lime-400/70 hover:bg-lime-400/[0.03]"
              >
                <div className="border-b border-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.service}
                      </p>
                    </div>

                    <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="relative bg-black">
                  <Image
                    src={item.image}
                    alt={`Testimoni ${item.name}`}
                    width={600}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}