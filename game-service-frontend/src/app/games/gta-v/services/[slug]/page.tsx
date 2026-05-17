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
  const data =
    gtaServiceDetail[params.slug as keyof typeof gtaServiceDetail];

  if (!data) return notFound();

  return (
    <main className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* 🔙 BACK */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-lime-400 mb-6 transition"
        >
          ← Kembali ke Beranda
        </Link>

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-4">
          {data.title}
        </h1>

        <p className="text-gray-400 mb-8">
          {data.description}
        </p>

        {/* LIST */}
        <div className="grid gap-5">
          {data.items.map((item, i) => {
            const itemName = item.name || item.label || "";
            const features = item.features || [];

            return (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-lime-400/80 hover:bg-lime-400/[0.03]"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  {/* LEFT CONTENT */}
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.8)]" />

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
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 md:min-w-[190px] md:flex-col md:items-end md:border-t-0 md:pt-0">
                    <p className="whitespace-nowrap text-xl font-extrabold text-lime-400 md:text-right">
                      {item.price}
                    </p>

                    <TermsDialog
                      service={params.slug}
                      item={itemName}
                      price={item.price}
                    />
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