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
        <div className="grid gap-4">

          {data.items.map((item, i) => (
            <div
              key={i}
              className="p-5 border border-white/10 rounded-xl flex justify-between items-center hover:border-lime-400 transition"
            >
              <div>
                <p className="font-semibold">{item.label}</p>

                {item.result && (
                  <p className="text-gray-400 text-sm">
                    Estimasi: {item.result}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p className="text-lime-400 font-bold">
                  {item.price}
                </p>

                <TermsDialog
                  service={params.slug}
                  item={item.label}
                  price={item.price}
                />
              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}