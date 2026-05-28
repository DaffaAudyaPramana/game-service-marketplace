import { gtaServiceDetail } from "@/lib/gta-service-detail";
import { notFound } from "next/navigation";
import TermsDialog from "@/components/custom/terms-dialog";
import Link from "next/link";

interface Props {
  params: {
    slug: string;
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const data = gtaServiceDetail[params.slug as keyof typeof gtaServiceDetail];

  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* BACK */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-lime-400"
        >
          ← Kembali ke Beranda
        </Link>

        {/* HEADER */}
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
          {data.title}
        </h1>

        <p className="mb-8 leading-relaxed text-gray-400">
          {data.description}
        </p>

        {/* LIST */}
        <div className="grid gap-5">
          {data.items.map((item, i) => {
            const itemName = item.name || item.label || "";
            const features = item.features || [];

            const isDisabledItem =
              params.slug === "money" &&
              itemName.trim().toLowerCase() === "1x heist";

            return (
              <div
                key={i}
                className={`group rounded-2xl border p-5 transition ${
                  isDisabledItem
                    ? "border-white/10 bg-white/[0.025] opacity-75"
                    : "border-white/10 bg-white/[0.03] hover:border-lime-400/80 hover:bg-lime-400/[0.03]"
                }`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  {/* LEFT CONTENT */}
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full shadow-[0_0_12px_rgba(163,230,53,0.8)] ${
                          isDisabledItem ? "bg-gray-500" : "bg-lime-400"
                        }`}
                      />

                      <h2 className="text-lg font-bold text-white">
                        {itemName}
                      </h2>
                    </div>

                    {features.length > 0 ? (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {features.map((feature, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-300"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-3 text-sm font-semibold text-white">
                        {item.label}
                      </p>
                    )}

                    {item.result && (
                      <p className="text-sm text-gray-400">
                        Estimasi:{" "}
                        <span className="text-gray-300">
                          {item.result}
                        </span>
                      </p>
                    )}

                    {isDisabledItem && (
                      <p className="mt-3 text-sm font-semibold text-red-300">
                        Paket ini tidak tersedia untuk order.
                      </p>
                    )}
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 md:min-w-[190px] md:flex-col md:items-end md:border-t-0 md:pt-0">
                    <p
                      className={`whitespace-nowrap text-xl font-extrabold md:text-right ${
                        isDisabledItem ? "text-gray-500" : "text-lime-400"
                      }`}
                    >
                      {item.price}
                    </p>

                    {isDisabledItem ? (
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-lg bg-gray-700 px-4 py-2 text-sm font-bold text-gray-400 opacity-70"
                      >
                        Tidak Tersedia
                      </button>
                    ) : (
                      <TermsDialog
                        service={params.slug}
                        item={itemName}
                        price={item.price}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}