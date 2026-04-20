"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  service: string;
  item: string;
  price: string;
}

export default function TermsDialog({ service, item, price }: Props) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-lime-400 text-black">
          Order
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black text-white max-h-[80vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">
          Syarat & Ketentuan
        </h2>

        {/* WAJIB */}
        <div className="mb-4">
          <p className="text-lime-400 font-semibold mb-2">WAJIB</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Wajib menginfokan akun Legacy / Enhanced</li>
            <li>• Wajib login Rockstar / Steam / Epic</li>
            <li>• Joki via login, bukan mabar</li>
            <li>• Data login harus valid & bisa diakses</li>
            <li>• Wajib nonaktifkan 2FA</li>
            <li>• Tidak mengubah data saat proses</li>
          </ul>
        </div>

        {/* DILARANG */}
        <div className="mb-4">
          <p className="text-red-400 font-semibold mb-2">DILARANG</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Login akun saat proses berjalan</li>
            <li>• Order di tempat lain</li>
            <li>• Mengubah password / email</li>
            <li>• Memberikan data salah</li>
            <li>• Meminta refund saat proses berjalan</li>
          </ul>
        </div>

        {/* CATATAN */}
        <div className="mb-4">
          <p className="text-yellow-400 font-semibold mb-2">CATATAN</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Money dari run heist (bukan drop)</li>
            <li>• Hasil bisa berbeda tiap akun</li>
            <li>• Estimasi bukan jaminan pasti</li>
            <li>• No refund jika proses dimulai</li>
          </ul>
        </div>

        {/* CHECKBOX */}
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            checked={checked}
            onCheckedChange={(val) => setChecked(!!val)}
          />
          <p className="text-sm">
            Saya setuju dengan semua syarat & ketentuan
          </p>
        </div>

        {/* ACTION */}
        <Button
          disabled={!checked}
          className="w-full bg-lime-400 text-black"
          onClick={() =>
            router.push(
              `/checkout/create?service=${service}&item=${encodeURIComponent(
                item
              )}&price=${price}`
            )
          }
        >
          Lanjut ke Checkout
        </Button>

      </DialogContent>
    </Dialog>
  );
}