"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Mail,
  ReceiptText,
  Save,
  ShieldCheck,
  User,
  UserCog,
  WalletCards,
  Gift,
  Coins,
  Trophy,
} from "lucide-react";
import { API_URL } from "@/lib/api";

type MenuKey =
  | "dashboard"
  | "transactions"
  | "savedId"
  | "membership"
  | "mutation"
  | "rewards"
  | "profile";

interface RewardData {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  pointsCost: number;
  stock?: number | null;
  active: boolean;
}

interface PointLedgerData {
  id: number;
  type: "EARN" | "REDEEM" | "ADJUST";
  points: number;
  description?: string | null;
  balanceAfter: number;
  createdAt: string;
  order?: {
    orderId: string;
    totalPrice: number;
    status: string;
  } | null;
  redemption?: {
    id: number;
    status: string;
    reward?: RewardData;
  } | null;
}

interface RewardRedemptionData {
  id: number;
  pointsCost: number;
  status: string;
  notes?: string | null;
  createdAt: string;
  reward: RewardData;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
}

const menuItems = [
  {
    key: "dashboard" as MenuKey,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "transactions" as MenuKey,
    label: "Transaksi",
    icon: ReceiptText,
  },
  {
    key: "savedId" as MenuKey,
    label: "Save ID",
    icon: Save,
  },
  {
    key: "membership" as MenuKey,
    label: "Membership",
    icon: BadgeCheck,
  },
  {
    key: "mutation" as MenuKey,
    label: "Mutasi",
    icon: WalletCards,
  },
  {
  key: "rewards" as MenuKey,
  label: "Poin",
  icon: Gift,
  },
  {
    key: "profile" as MenuKey,
    label: "Profil",
    icon: UserCog,
  },
];

interface ProductData {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  description?: string | null;
}

interface PaymentData {
  id: number;
  method: string;
  status: string;
  proof?: string | null;
  gatewayRef?: string | null;
}

interface CustomerOrder {
  id: number;
  orderId: string;
  userId: number;
  productId: number;
  status: string;
  totalPrice: number;

  name?: string | null;
  method?: string | null;
  platform?: string | null;
  version?: string | null;
  gameUserId?: string | null;
  whatsapp?: string | null;
  discordUsername?: string | null;
  notes?: string | null;

  createdAt: string;

  product?: ProductData;
  payment?: PaymentData | null;
  orderItems?: OrderItemData[];
}

interface OrderItemData {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productCategory: string;
  productType: string;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
  product?: ProductData;
}

export default function CustomerPage() {
  const router = useRouter();
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [myPoints, setMyPoints] = useState(0);
  const [pointLedgers, setPointLedgers] = useState<PointLedgerData[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemptionData[]>([]);
  const [redeemingRewardId, setRedeemingRewardId] = useState<number | null>(null);

  const refreshRewards = async () => {
    const rewardRes = await fetch(`${API_URL}/rewards`, {
      method: "GET",
    });

    if (rewardRes.ok) {
      const rewardData = await rewardRes.json();
      setRewards(rewardData.data || []);
    }

    const pointsRes = await fetch(`${API_URL}/rewards/me`, {
      method: "GET",
      credentials: "include",
    });

    if (pointsRes.ok) {
      const pointsData = await pointsRes.json();

      setMyPoints(pointsData.data.points || 0);
      setPointLedgers(pointsData.data.ledgers || []);
      setRedemptions(pointsData.data.redemptions || []);
    }
  };

const serviceLabels: Record<string, string> = {
  money: "Money Heist",
  rank: "Rank Boost",
  unlock: "Unlock Package",
  paket: "Paket Lengkap",
};

const formatRupiah = (value: number) => {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrderItemsText = (order: CustomerOrder) => {
  if (order.orderItems && order.orderItems.length > 0) {
    return order.orderItems
      .map((item: OrderItemData) => {
        const qty = item.quantity > 1 ? ` x${item.quantity}` : "";
        return `${item.productName}${qty}`;
      })
      .join(", ");
  }

  return order.product?.name || "-";
};

const getServiceName = (order: CustomerOrder) => {
  if (order.orderItems && order.orderItems.length > 0) {
    const services = [
      ...new Set(
        order.orderItems.map((item: OrderItemData) => {
          return serviceLabels[item.productType] || item.productType;
        })
      ),
    ];

    return services.length === 1 ? services[0] : "Custom Order";
  }

  const key = order.product?.type || order.product?.category || "";

  return serviceLabels[key] || key || "Order";
};

const getItemName = (order: CustomerOrder) => {
  return order.product?.name || "-";
};

const savedGameIds = useMemo(() => {
  const map = new Map<
    string,
    {
      label: string;
      game: string;
      username: string;
      platform: string;
      version: string;
      lastOrderAt: string;
    }
  >();

  orders.forEach((order) => {
    const gameUserId = order.gameUserId?.trim();

    if (!gameUserId) return;

    const platform = order.platform || "-";
    const version = order.version || "-";
    const key = `${gameUserId}-${platform}-${version}`;

    if (!map.has(key)) {
      map.set(key, {
        label: `Akun ${map.size + 1}`,
        game: "GTA V Online",
        username: gameUserId,
        platform,
        version,
        lastOrderAt: order.createdAt,
      });
    }
  });

  return Array.from(map.values());
}, [orders]);

const totalSpent = useMemo(() => {
  return orders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + order.totalPrice, 0);
}, [orders]);

const membershipLevel = useMemo(() => {
  if (totalSpent >= 500000) return "VIP Member";
  if (totalSpent >= 150000) return "Silver Member";
  return "Regular Member";
}, [totalSpent]);

const mutationItems = useMemo(() => {
  return orders.flatMap((order) => {
    const items = [
      {
        title: "Order dibuat",
        desc: `${getServiceName(order)} - ${getItemName(order)} berhasil dibuat.`,
        date: order.createdAt,
        status: order.status,
      },
    ];

    if (order.payment?.proof) {
      items.push({
        title: "Bukti transfer diupload",
        desc: `Bukti pembayaran untuk ${order.orderId} berhasil diterima sistem.`,
        date: order.createdAt,
        status: order.payment.status,
      });
    }

    if (order.status === "completed") {
      items.push({
        title: "Order selesai",
        desc: `${order.orderId} telah diselesaikan oleh admin.`,
        date: order.createdAt,
        status: order.status,
      });
    }

    if (order.status === "rejected") {
      items.push({
        title: "Order ditolak",
        desc: `${order.orderId} ditolak atau pembayaran tidak valid.`,
        date: order.createdAt,
        status: order.status,
      });
    }

    return items;
  });
}, [orders]);

  const fullName = useMemo(() => {
    if (!user) return "-";

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return name || user.email;
  }, [user]);

    const completedOrders = orders.filter(
    (order) => order.status === "completed"
    ).length;

    const processingOrders = orders.filter(
    (order) => order.status === "processing"
    ).length;

    const pendingOrders = orders.filter(
    (order) => order.status === "pending"
    ).length;

useEffect(() => {
  const getUserAndOrders = async () => {
    try {
      const userRes = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      const orderRes = await fetch(`${API_URL}/orders/my`, {
        method: "GET",
        credentials: "include",
      });

      if (!orderRes.ok) {
        throw new Error("Gagal mengambil data order");
      }

      const orderData = await orderRes.json();
      setOrders(orderData.data || []);

      const rewardRes = await fetch(`${API_URL}/rewards`, {
        method: "GET",
      });

      if (rewardRes.ok) {
        const rewardData = await rewardRes.json();
        setRewards(rewardData.data || []);
      }

      const pointsRes = await fetch(`${API_URL}/rewards/me`, {
        method: "GET",
        credentials: "include",
      });

      if (pointsRes.ok) {
        const pointsData = await pointsRes.json();

        setMyPoints(pointsData.data.points || 0);
        setPointLedgers(pointsData.data.ledgers || []);
        setRedemptions(pointsData.data.redemptions || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUser(false);
      setLoadingOrders(false);
    }
  };
  
  getUserAndOrders();
}, [router]);

const handleRedeemReward = async (rewardId: number) => {
    try {
      setRedeemingRewardId(rewardId);

      const res = await fetch(
        `${API_URL}/rewards/${rewardId}/redeem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            notes: "Redeem dari dashboard customer",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal redeem reward");
      }

      alert("Redeem berhasil. Menunggu diproses admin.");

      await refreshRewards();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setRedeemingRewardId(null);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

const renderStatus = (status: string) => {
  if (status === "completed" || status === "approved") {
    return (
      <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
        Selesai
      </span>
    );
  }

  if (status === "processing") {
    return (
      <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-400">
        Diproses
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
        Ditolak
      </span>
    );
  }

  return (
    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
      Pending
    </span>
  );
};
    const rewardDisplayOrder = [
      "5x Heist",
      "10x Heist",
      "15x Heist",
      "10 Kendaraan",
      "Pilih & Pasang 1 Set Outfit",
      "SPESIAL - Bebas Pilih Layanan",
    ];

    const sortedRewards = useMemo(() => {
      return [...rewards].sort((a, b) => {
        const orderA = rewardDisplayOrder.indexOf(a.name);
        const orderB = rewardDisplayOrder.indexOf(b.name);

        const safeOrderA = orderA === -1 ? 999 : orderA;
        const safeOrderB = orderB === -1 ? 999 : orderB;

        if (safeOrderA !== safeOrderB) {
          return safeOrderA - safeOrderB;
        }

        return a.pointsCost - b.pointsCost;
      });
    }, [rewards]);

  const renderContent = () => {
    if (!user) return null;

    if (activeMenu === "dashboard") {
      return (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-400">
              Customer Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
              Halo, {user.firstName || "Customer"}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Selamat datang di dashboard akun HyperIndoStore.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <Coins size={22} />
            </div>

            <p className="text-sm text-gray-400">Poin</p>

            <h2 className="mt-2 text-3xl font-extrabold text-lime-400">
              {myPoints}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                <ReceiptText size={22} />
              </div>

              <p className="text-sm text-gray-400">Total Order</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {orders.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300">
                <Clock3 size={22} />
              </div>

              <p className="text-sm text-gray-400">Pending</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {pendingOrders}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
                <CreditCard size={22} />
              </div>

              <p className="text-sm text-gray-400">Diproses</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {processingOrders}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                <BadgeCheck size={22} />
              </div>

              <p className="text-sm text-gray-400">Selesai</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {completedOrders}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Order Terbaru
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Pantau order terbaru kamu.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu("transactions")}
                  className="text-sm font-semibold text-lime-400 hover:underline"
                >
                  Lihat semua
                </button>
              </div>

              <div className="space-y-4">
                {loadingOrders ? (
                <p className="text-sm text-gray-400">Memuat order...</p>
                ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-center">
                    <p className="text-sm text-gray-400">
                    Belum ada order.
                    </p>
                </div>
                ) : (
                orders.slice(0, 3).map((order) => (
                    <div
                    key={order.orderId}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                        <p className="text-sm text-gray-400">
                            {order.orderId}
                        </p>

                        <h3 className="mt-1 font-bold text-white">
                            {getServiceName(order)} — {getOrderItemsText(order)}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                        </p>
                        </div>

                        <div className="flex flex-col items-start gap-2 md:items-end">
                        <p className="font-bold text-lime-400">
                            {formatRupiah(order.totalPrice)}
                        </p>

                        {renderStatus(order.status)}
                        </div>
                    </div>
                    </div>
                ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-bold text-white">
                  Profil Customer
                </h2>

                <div className="mt-5 flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                    <User size={28} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-white">
                      {fullName}
                    </h3>

                    <p className="mt-1 truncate text-sm text-gray-400">
                      {user.email}
                    </p>

                    <button
                      type="button"
                      onClick={() => setActiveMenu("profile")}
                      className="mt-3 text-sm font-semibold text-lime-400 hover:underline"
                    >
                      profil
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-bold text-white">Membership</h2>

                <div className="mt-5 rounded-2xl border border-lime-400/20 bg-lime-400/10 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-lime-400" size={24} />

                    <div>
                      <p className="font-bold text-white">Regular Member</p>
                      <p className="text-sm text-gray-400">
                        Status akun aktif sebagai customer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeMenu === "transactions") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Transaksi</h1>
            <p className="mt-2 text-sm text-gray-400">
              Riwayat order customer.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-gray-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">Order ID</th>
                    <th className="px-5 py-4 font-medium">Layanan</th>
                    <th className="px-5 py-4 font-medium">Harga</th>
                    <th className="px-5 py-4 font-medium">Tanggal</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                {orders.length === 0 ? (
                    <tr>
                    <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-gray-400"
                    >
                        Belum ada transaksi.
                    </td>
                    </tr>
                ) : (
                    orders.map((order) => (
                    <tr
                        key={order.orderId}
                        className="border-t border-white/10"
                    >
                        <td className="px-5 py-4 text-white">
                        {order.orderId}
                        </td>

                        <td className="px-5 py-4">
                        <p className="font-semibold text-white">
                            {getServiceName(order)} — {getOrderItemsText(order)}
                        </p>
                        <p className="mt-1 text-gray-400">
                            {getItemName(order)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Rockstar ID: {order.gameUserId || "-"}
                        </p>
                        </td>

                        <td className="px-5 py-4 font-bold text-lime-400">
                        {formatRupiah(order.totalPrice)}
                        </td>

                        <td className="px-5 py-4 text-gray-300">
                        {formatDate(order.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                        {renderStatus(order.status)}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeMenu === "savedId") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Save ID</h1>
            <p className="mt-2 text-sm text-gray-400">
              Simpan ID game agar checkout lebih cepat.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {savedGameIds.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:col-span-2">
                <p className="text-sm text-gray-400">
                    Belum ada ID game yang tersimpan. ID akan otomatis muncul setelah kamu membuat order.
                </p>
                </div>
            ) : (
                savedGameIds.map((saved) => (
                <div
                    key={`${saved.username}-${saved.platform}-${saved.version}`}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                    <Gamepad2 size={24} />
                    </div>

                    <h2 className="text-xl font-bold text-white">
                    {saved.label}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                    {saved.game}
                    </p>

                    <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-black/30 p-4">
                        <p className="text-sm text-gray-400">
                        Username / ID Game
                        </p>
                        <p className="mt-1 font-bold text-white">
                        {saved.username}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-black/30 p-4">
                        <p className="text-sm text-gray-400">
                        Platform
                        </p>
                        <p className="mt-1 font-bold text-white">
                        {saved.platform}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-black/30 p-4">
                        <p className="text-sm text-gray-400">
                        Versi GTA
                        </p>
                        <p className="mt-1 font-bold text-white">
                        {saved.version}
                        </p>
                    </div>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>
      );
    }

if (activeMenu === "membership") {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Membership
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Informasi membership customer.
        </p>
      </div>

      {/* MEMBERSHIP CARD */}
      <div className="rounded-3xl border border-lime-400/20 bg-gradient-to-br from-lime-400/10 via-white/[0.03] to-white/[0.02] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-extrabold text-black">
              ACTIVE
            </span>

            <h2 className="mt-5 text-2xl font-extrabold text-white">
              {membershipLevel}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300">
              Membership dihitung otomatis dari total order selesai di
              HyperIndoStore.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-sm text-gray-400">Total Belanja</p>

            <p className="mt-2 text-2xl font-extrabold text-lime-400">
              {formatRupiah(totalSpent)}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-sm text-gray-400">
              Total Order
            </p>

            <p className="mt-2 text-2xl font-extrabold text-white">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-sm text-gray-400">
              Order Selesai
            </p>

            <p className="mt-2 text-2xl font-extrabold text-lime-400">
              {completedOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-sm text-gray-400">
              Status Akun
            </p>

            <p className="mt-2 text-2xl font-extrabold text-lime-400">
              Aktif
            </p>
          </div>
        </div>
      </div>

      {/* INFO LEVEL */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-xl font-bold text-white">
          Level Membership
        </h2>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white">Regular Member</p>
                <p className="mt-1 text-sm text-gray-400">
                  Total belanja di bawah Rp 150.000
                </p>
              </div>

              {membershipLevel === "Regular Member" && (
                <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                  Kamu
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white">Silver Member</p>
                <p className="mt-1 text-sm text-gray-400">
                  Total belanja minimal Rp 150.000
                </p>
              </div>

              {membershipLevel === "Silver Member" && (
                <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                  Kamu
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white">VIP Member</p>
                <p className="mt-1 text-sm text-gray-400">
                  Total belanja minimal Rp 500.000
                </p>
              </div>

              {membershipLevel === "VIP Member" && (
                <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                  Kamu
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    if (activeMenu === "mutation") {
    return (
        <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-extrabold text-white">
            Mutasi
            </h1>

            <p className="mt-2 text-sm text-gray-400">
            Aktivitas terbaru akun customer.
            </p>
        </div>

        <div className="space-y-4">
            {mutationItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm text-gray-400">
                Belum ada aktivitas.
                </p>
            </div>
            ) : (
            mutationItems.map((item, index) => (
                <div
                key={`${item.title}-${item.date}-${index}`}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                    <h2 className="font-bold text-white">
                        {item.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                        {item.desc}
                    </p>

                    <p className="mt-3 text-xs text-lime-400">
                        {formatDate(item.date)}
                    </p>
                    </div>

                    {renderStatus(item.status)}
                </div>
                </div>
            ))
            )}
        </div>
        </div>
    );
    }

if (activeMenu === "rewards") {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Poin & Voucher
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Kumpulkan poin dari setiap order selesai dan tukarkan dengan reward.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-lime-400/20 bg-gradient-to-br from-lime-400/15 via-white/[0.04] to-white/[0.02] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black">
              <Coins size={28} />
            </div>

            <div>
              <p className="text-sm text-gray-300">
                Poin Kamu
              </p>

              <h2 className="text-4xl font-extrabold text-white">
                {myPoints}
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-sm font-semibold text-white">
              Cara mendapatkan poin
            </p>

            <div className="mt-4 rounded-2xl border border-lime-400/20 bg-lime-400/10 p-4">
              <p className="text-sm font-semibold text-lime-400">
                Bonus Poin
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Order di atas Rp. 200.000 otomatis mendapatkan tambahan 3 poin.
              </p>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Setiap order yang sudah selesai akan otomatis mendapatkan poin.
              Saat ini, Rp 10.000 order selesai = 1 poin. Poin bisa ditukarkan dengan reward seperti Heist, Vehicle, Outift, atau layanan spesial
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-bold text-white">
            Riwayat Poin Terbaru
          </h2>

          <div className="mt-5 space-y-3">
            {pointLedgers.length === 0 ? (
              <p className="text-sm text-gray-400">
                Belum ada riwayat poin.
              </p>
            ) : (
              pointLedgers.slice(0, 5).map((ledger) => (
                <div
                  key={ledger.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {ledger.description || "Aktivitas poin"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(ledger.createdAt)}
                      </p>
                    </div>

                    <p
                      className={`font-extrabold ${
                        ledger.points > 0
                          ? "text-lime-400"
                          : "text-red-300"
                      }`}
                    >
                      {ledger.points > 0 ? "+" : ""}
                      {ledger.points}
                    </p>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Saldo setelah transaksi: {ledger.balanceAfter}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Daftar Reward
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Tukarkan poin kamu dengan reward yang tersedia.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rewards.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 md:col-span-2 xl:col-span-3">
              <p className="text-sm text-gray-400">
                Belum ada reward tersedia.
              </p>
            </div>
          ) : (
            sortedRewards.map((reward) => {
              const enoughPoints = myPoints >= reward.pointsCost;
              const outOfStock =
                reward.stock !== null &&
                reward.stock !== undefined &&
                reward.stock <= 0;

              return (
                <div
                  key={reward.id}
                  className="rounded-3xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                    <Trophy size={24} />
                  </div>

                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {reward.name}
                    </h3>

                    <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-bold text-lime-400">
                      {reward.category}
                    </span>
                  </div>

                  <p className="mt-2 min-h-[44px] text-sm leading-relaxed text-gray-400">
                    {reward.description || "-"}
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm text-gray-400">
                      Dibutuhkan
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-lime-400">
                      {reward.pointsCost} Poin
                    </p>

                    {reward.stock !== null && reward.stock !== undefined && (
                      <p className="mt-1 text-xs text-gray-500">
                        Stock: {reward.stock}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRedeemReward(reward.id)}
                    disabled={
                      !enoughPoints ||
                      outOfStock ||
                      redeemingRewardId === reward.id
                    }
                    className="mt-5 w-full rounded-2xl bg-lime-400 px-4 py-3 font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {redeemingRewardId === reward.id
                      ? "Memproses..."
                      : outOfStock
                      ? "Stock Habis"
                      : enoughPoints
                      ? "Redeem Reward"
                      : "Poin Belum Cukup"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-bold text-white">
          Riwayat Redeem
        </h2>

        <div className="mt-5 space-y-3">
          {redemptions.length === 0 ? (
            <p className="text-sm text-gray-400">
              Belum pernah redeem reward.
            </p>
          ) : (
            redemptions.map((redeem) => (
              <div
                key={redeem.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-white">
                      {redeem.reward.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {redeem.pointsCost} poin • {formatDate(redeem.createdAt)}
                    </p>
                  </div>

                  {renderStatus(redeem.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

     if (activeMenu === "profile") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Profil
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Data akun customer yang terhubung dengan sistem.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Nama Depan
                </label>

                <input
                  type="text"
                  value={user.firstName || ""}
                  readOnly
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Nama Belakang
                </label>

                <input
                  type="text"
                  value={user.lastName || ""}
                  readOnly
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-11 pr-4 text-white outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Perubahan email dan nama bisa disambungkan ke backend update
                  profile nanti.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Role
                </label>

                <input
                  type="text"
                  value={user.role || "user"}
                  readOnly
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Status Akun
                </label>

                <input
                  type="text"
                  value="Aktif"
                  readOnly
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lime-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-64 rounded-xl bg-white/10" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="h-[560px] rounded-3xl bg-white/5" />
            <div className="h-[560px] rounded-3xl bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-white ">
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lime-400/5 via-black/70 to-black" />

      <div className="relative min-h-screen overflow-hidden bg-black px-4 pt-8 pb-28 text-white sm:px-6 lg:px-8 lg:pb-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-400">
            HyperIndoStore Account
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-white">
            Akun Saya
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            Kelola akun customer, pantau transaksi, simpan ID game, dan lihat
            aktivitas order dalam satu dashboard.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                  <User size={28} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-white">
                    {fullName}
                  </h2>

                  <p className="truncate text-sm text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 hidden space-y-2 lg:block">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveMenu(item.key)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition ${
                      active
                        ? "bg-lime-400 text-black"
                        : "text-gray-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={20} />

                <span className="font-semibold">
                  {loggingOut ? "Logging out..." : "Log Out"}
                </span>
              </button>
            </div>
          </aside>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6 lg:p-8">
            {renderContent()}
          </section>
        </div>
      </div>
      {/* MOBILE BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
            {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeMenu === item.key;

            return (
                <button
                key={item.key}
                type="button"
                onClick={() => setActiveMenu(item.key)}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition ${
                    active
                    ? "bg-lime-400 text-black"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
                >
                <Icon size={20} />

                <span className="leading-none">
                    {item.label}
                </span>
                </button>
            );
            })}
        </div>
        </div>
    </main>
  );
}