import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-white">
          <div className="relative z-10 mx-auto max-w-md">
            <p className="text-gray-400">Loading reset password...</p>
          </div>
        </main>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}