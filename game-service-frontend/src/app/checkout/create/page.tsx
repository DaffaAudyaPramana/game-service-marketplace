import { Suspense } from "react";
import CheckoutCreateClient from "./CheckoutCreateClient";

export default function CheckoutCreatePage() {
  return (
    <Suspense
      fallback={
        <main className="bg-black text-white min-h-screen px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-400">Loading checkout...</p>
          </div>
        </main>
      }
    >
      <CheckoutCreateClient />
    </Suspense>
  );
}