import ServiceCard from "@/components/custom/service-card";
import { gtaServices } from "@/lib/gta-services";

export default function GTAVPage() {
  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">

      {/* HEADER */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          GTA V Online Services
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto">
          Choose your service and boost your GTA Online experience.
          Fast, secure, and handled by professionals.
        </p>
      </section>

      {/* SERVICE GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gtaServices.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            price={service.price}
          />
        ))}
      </section>

    </main>
  );
}