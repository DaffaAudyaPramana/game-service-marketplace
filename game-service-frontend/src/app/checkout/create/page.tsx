"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const params = useSearchParams();

  // GET QUERY PARAMS
  const service = params.get("service") || "";
  const item = params.get("item") || "";
  const price = params.get("price") || "";

  // FORM STATE
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    method: "login",
    payment: "bank",
    notes: "",
  });

  return (
    <main className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* ORDER INFO */}
        <div className="p-4 border border-white/10 rounded-xl mb-6">
          <p><strong>Service:</strong> {service}</p>
          <p><strong>Item:</strong> {item}</p>
          <p className="text-lime-400 font-bold">
            <strong>Price:</strong> {price}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* NAME */}
          <input
            placeholder="Nama"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* NICKNAME */}
          <input
            placeholder="Nickname Social Club"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
            value={form.nickname}
            onChange={(e) =>
              setForm({ ...form, nickname: e.target.value })
            }
          />

          {/* METHOD */}
          <select
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
            value={form.method}
            onChange={(e) =>
              setForm({ ...form, method: e.target.value })
            }
          >
            <option className= "bg-black text-white" value="login">
              Via Login
            </option>
            <option className= "bg-black text-white" value="invite">
              Invite Session
            </option>
          </select>

          {/* PAYMENT */}
          <select
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
            value={form.payment}
            onChange={(e) =>
              setForm({ ...form, payment: e.target.value })
            }
          >
            <option className= "bg-black text-white" value="bank">
              Transfer Bank
            </option>
            <option className= "bg-black text-white" value="ewallet">
              E-Wallet
            </option>
            <option className= "bg-black text-white" value="crypto">
              Crypto
            </option>
          </select>

          {/* NOTES */}
          <textarea
            placeholder="Request tambahan...(Opsional)"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          {/* SUBMIT */}
          <Button
            className="w-full bg-lime-400 text-black"
            onClick={() => {
              console.log({
                service,
                item,
                price,
                ...form,
              });

              alert("Order berhasil dikirim (dummy)");
            }}
          >
            Submit Order
          </Button>

        </div>
      </div>
    </main>
  );
}