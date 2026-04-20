interface ServiceItem {
  label: string;
  price: string;
  result?: string; // opsional, tidak semua item punya result
}

interface ServiceDetail {
  title: string;
  description: string;
  items: ServiceItem[];
}

export const gtaServiceDetail: Record<string, ServiceDetail> = {
  money: {
    title: "Money Heist",
    description: "Money didapat dari hasil run heist, bukan drop money. Berlaku untuk Legacy dan Enhanced. Estimasi hasil bisa berbeda tiap run. Proses menyesuaikan cooldown akun. PC Only.",
    items: [
      { label: "1x Heist", price: "Rp 2.500", result: "3jt - 3,4jt" },
      { label: "5x Heist", price: "Rp 12.500", result: "15jt - 17jt" },
      { label: "10x Heist", price: "Rp 25.000", result: "30jt - 34jt" },
      { label: "20x Heist", price: "Rp 50.000", result: "60jt - 68jt" },
      { label: "50x Heist", price: "Rp 120.000", result: "150jt - 170jt" },
      { label: "100x Heist", price: "Rp 240.000", result: "300jt - 340jt" },
    ],
  },

  rank: {
    title: "Rank Boost & Stats",
    description: "Boost level, stats, dan berbagai progression karakter GTA Online kamu. Berlaku untuk Legacy dan Enhanced. PC Only.",
    items: [
      // Rank Boost
      { label: "+100 Rank", price: "Rp 20.000" },
      { label: "+250 Rank", price: "Rp 35.000" },
      { label: "+500 Rank", price: "Rp 60.000" },
      { label: "+1000 Rank", price: "Rp 100.000" },
      { label: "+8000 Rank", price: "Rp 200.000" },
      { label: "Request Crew Rank", price: "Rp 15.000" },
      { label: "+1000 LSCM Rep", price: "Rp 25.000" },
      // Max Stats
      { label: "Max Stamina", price: "Rp 8.000" },
      { label: "Max Strength", price: "Rp 8.000" },
      { label: "Max Shooting", price: "Rp 8.000" },
      { label: "Max Stealth", price: "Rp 8.000" },
      { label: "Max Driving", price: "Rp 8.000" },
      { label: "Max Flying", price: "Rp 8.000" },
      { label: "Max Lung Capacity", price: "Rp 8.000" },
      { label: "Full Max Stats (Semua)", price: "Rp 35.000" },
    ],
  },

  unlock: {
    title: "Unlock Package",
    description: "Buka semua item, senjata, kendaraan, outfit, dan berbagai konten tersembunyi di GTA Online. PC Only.",
    items: [
      { label: "Unlock All DLC", price: "Rp 25.000" },
      { label: "Unlock Rare Weapons", price: "Rp 15.000" },
      { label: "Unlock Services", price: "Rp 15.000" },
      { label: "Unlock Fast Run", price: "Rp 15.000" },
      { label: "Unlock Arena War", price: "Rp 15.000" },
      { label: "Unlock All Trophies", price: "Rp 20.000" },
      { label: "All Weapons", price: "Rp 15.000" },
      { label: "All Ammo", price: "Rp 10.000" },
      { label: "All Outfits", price: "Rp 15.000" },
      { label: "All Liveries", price: "Rp 15.000" },
      { label: "All Tattoos", price: "Rp 10.000" },
      { label: "All Hairstyles", price: "Rp 10.000" },
      { label: "All Masks", price: "Rp 10.000" },
      { label: "All Accessories", price: "Rp 10.000" },
      { label: "1 Modded Outfit", price: "Rp 10.000" },
      // Recovery
      { label: "K/D Reset", price: "Rp 10.000" },
      { label: "Bad Sport Clean", price: "Rp 15.000" },
      { label: "Race Wins", price: "Rp 10.000" },
      { label: "Skill Unlock", price: "Rp 10.000" },
      // Special
      { label: "Ganti Gender", price: "Rp 15.000" },
      { label: "Cayo + Casino Max Prep", price: "Rp 20.000" },
      { label: "LSCM Prize Ride", price: "Rp 20.000" },
      { label: "Casino Podium Car", price: "Rp 20.000" },
      // Properti
      { label: "CEO Office", price: "Rp 10.000" },
      { label: "Kosatka", price: "Rp 10.000" },
      { label: "Agency", price: "Rp 10.000" },
      { label: "Arcade", price: "Rp 10.000" },
      { label: "Nightclub", price: "Rp 10.000" },
      { label: "Bunker", price: "Rp 10.000" },
      { label: "Facility", price: "Rp 10.000" },
      { label: "Auto Shop", price: "Rp 10.000" },
      { label: "MC Clubhouse", price: "Rp 8.000" },
      { label: "Hangar", price: "Rp 10.000" },
      { label: "Penthouse", price: "Rp 10.000" },
      { label: "Yacht", price: "Rp 10.000" },
      { label: "Terrorbyte", price: "Rp 15.000" },
      { label: "Avenger", price: "Rp 15.000" },
      { label: "1 Mansion", price: "Rp 10.000" },
      { label: "3 Mansion", price: "Rp 20.000" },
      { label: "5 High-End Apartment", price: "Rp 15.000" },
      { label: "8 High-End Apartment", price: "Rp 20.000" },
      { label: "10 High-End Apartment (Max)", price: "Rp 25.000" },
      // Kendaraan
      { label: "1 Kendaraan", price: "Rp 5.000" },
      { label: "5 Kendaraan", price: "Rp 20.000" },
      { label: "10 Kendaraan", price: "Rp 35.000" },
      { label: "15 Kendaraan", price: "Rp 50.000" },
      { label: "20 Kendaraan", price: "Rp 65.000" },
    ],
  },

  paket: {
    title: "Paket Lengkap",
    description: "Bundle hemat dibanding beli satuan. Money tetap hasil run heist. Proses menyesuaikan cooldown akun. Berlaku untuk Legacy dan Enhanced. PC Only.",
    items: [
      {
        label: "Paket Saudagar — +100 Rank · Full Max Stats · 3 Kendaraan",
        price: "Rp 89.000",
        result: "30jt - 34jt (±10x Heist)",
      },
      {
        label: "Paket Juragan — +250 Rank · Full Max Stats · +1000 LSCM Rep · Fast Run · 5 Kendaraan",
        price: "Rp 149.000",
        result: "60jt - 68jt (±20x Heist)",
      },
      {
        label: "Paket Ningrat — +500 Rank · Full Max Stats · +1000 LSCM Rep · Fast Run · Unlock All DLC · Unlock Rare Weapons · 10 Kendaraan · 3 Modded Outfit",
        price: "Rp 299.000",
        result: "150jt - 170jt (±50x Heist)",
      },
      {
        label: "Paket Raja — +1000 Rank · Full Max Stats · +1000 LSCM Rep · Fast Run · Unlock All DLC · Unlock Rare Weapons · Unlock Arena War · Unlock All Trophies · 15 Kendaraan · 5 Modded Outfit",
        price: "Rp 449.000",
        result: "240jt - 272jt (±80x Heist)",
      },
      {
        label: "Paket Sultan — +8000 Rank · Full Max Stats · +1000 LSCM Rep · Fast Run · Unlock All DLC · Unlock Rare Weapons · Unlock Arena War · Unlock All Trophies · Unlock Bisnis · Unlock Services · 20 Kendaraan · 10 Modded Outfit",
        price: "Rp 649.000",
        result: "300jt - 340jt (±100x Heist)",
      },
    ],
  },
};