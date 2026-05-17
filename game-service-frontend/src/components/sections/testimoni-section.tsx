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
    service: "Rank Boost",
    image: "/testimonials/testi-4.png",
  },
  {
    name: "Customer #003",
    service: "Unlock Package",
    image: "/testimonials/testi-6.png",
  },
];

export default function TestimoniSection() {
  return (
    <section id="testimoni" className="bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-bold text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]">
              TESTIMONI CUSTOMER
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Bukti Order dari Customer
            </h2>

            <p className="mt-3 max-w-2xl text-gray-400">
              Beberapa screenshot bukti order dan feedback customer
              HyperIndoStore.
            </p>
          </div>

          <Link
            href="/testimoni"
            className="w-fit rounded-full border border-lime-400/40 px-5 py-2 text-sm font-semibold text-lime-400 transition hover:bg-lime-400 hover:text-black"
          >
            Lihat Semua Testimoni
          </Link>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-lime-400/70 hover:bg-lime-400/[0.03]"
            >
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.name}</p>
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
                  width={500}
                  height={700}
                  className="h-[360px] w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}