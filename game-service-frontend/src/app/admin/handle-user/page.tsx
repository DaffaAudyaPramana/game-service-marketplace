"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  PackageCheck,
  Search,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { API_URL } from "@/lib/api";

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

interface GTAOrderData {
  id: number;
  serviceType: string;
  targetAccount: string;
  progress: number;
}

interface OrderData {
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
  gtaOrder?: GTAOrderData | null;
}

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  orders: OrderData[];
}

interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const statusOptions = [
  {
    label: "Semua",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Diproses",
    value: "processing",
  },
  {
    label: "Selesai",
    value: "completed",
  },
  {
    label: "Ditolak",
    value: "rejected",
  },
];

const serviceLabels: Record<string, string> = {
  money: "Money Heist",
  rank: "Rank Boost",
  unlock: "Unlock Package",
  paket: "Paket Lengkap",
};

export default function AdminHandleUserPage() {
  const router = useRouter();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 2600);
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

  const getFullName = (user: AdminUser) => {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return name || user.email;
  };

  const getServiceName = (order: OrderData) => {
    const key = order.product?.type || order.product?.category || "";

    return serviceLabels[key] || key || "Order";
  };

  const getItemName = (order: OrderData) => {
    return order.product?.name || "-";
  };

  const allOrders = useMemo(() => {
    return users.flatMap((user) =>
      user.orders.map((order) => ({
        ...order,
        customer: user,
      }))
    );
  }, [users]);

  const totalRevenue = useMemo(() => {
    return allOrders
      .filter((order) => order.status === "completed")
      .reduce((total, order) => total + order.totalPrice, 0);
  }, [allOrders]);

  const pendingOrders = useMemo(() => {
    return allOrders.filter((order) => order.status === "pending").length;
  }, [allOrders]);

  const completedOrders = useMemo(() => {
    return allOrders.filter((order) => order.status === "completed").length;
  }, [allOrders]);

  const rejectedOrders = useMemo(() => {
    return allOrders.filter((order) => order.status === "rejected").length;
  }, [allOrders]);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users
      .map((user) => {
        const matchedOrders =
          statusFilter === "all"
            ? user.orders
            : user.orders.filter((order) => order.status === statusFilter);

        return {
          ...user,
          orders: matchedOrders,
        };
      })
      .filter((user) => {
        const fullName = getFullName(user).toLowerCase();
        const email = user.email.toLowerCase();

        const matchKeyword =
          !keyword ||
          fullName.includes(keyword) ||
          email.includes(keyword) ||
          user.orders.some((order) =>
            order.orderId.toLowerCase().includes(keyword)
          );

        const matchStatus =
          statusFilter === "all" || user.orders.length > 0;

        return matchKeyword && matchStatus;
      });
  }, [users, search, statusFilter]);

  const renderStatusBadge = (status: string) => {
    if (status === "completed" || status === "approved") {
      return (
        <span className="inline-flex rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
          Selesai
        </span>
      );
    }

    if (status === "processing") {
      return (
        <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-400">
          Diproses
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
          Ditolak
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
        Pending
      </span>
    );
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const meRes = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!meRes.ok) {
        router.push("/login");
        return;
      }

      const meData = await meRes.json();
      setAuthUser(meData.user);

      if (meData.user.role !== "admin") {
        router.push("/");
        return;
      }

      const usersRes = await fetch(`${API_URL}/admin/users`, {
        method: "GET",
        credentials: "include",
      });

      const usersData = await usersRes.json();

      if (!usersRes.ok) {
        throw new Error(usersData.error || "Gagal mengambil data user");
      }

      setUsers(usersData.data || []);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        showToast("error", error.message);
      } else {
        showToast("error", "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await fetch(
        `${API_URL}/orders/${orderId}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal update status pembayaran");
      }

      showToast(
        "success",
        status === "approved"
          ? "Pembayaran berhasil diapprove"
          : "Pembayaran berhasil ditolak"
      );

      await fetchAdminData();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        showToast("error", error.message);
      } else {
        showToast("error", "Terjadi kesalahan");
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-80 rounded-xl bg-white/10" />
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            <div className="h-32 rounded-3xl bg-white/5" />
            <div className="h-32 rounded-3xl bg-white/5" />
            <div className="h-32 rounded-3xl bg-white/5" />
            <div className="h-32 rounded-3xl bg-white/5" />
          </div>
          <div className="mt-8 h-[500px] rounded-3xl bg-white/5" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 -top-40 bottom-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute inset-x-0 -top-40 bottom-0 bg-gradient-to-b from-lime-400/5 via-black/70 to-black" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8"></div>
      
      {toast && (
        <div className="fixed left-1/2 top-6 z-50 w-[92%] max-w-md -translate-x-1/2">
          <div
            className={`rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-lime-400/30 bg-lime-400/10 text-lime-300"
                : "border-red-400/30 bg-red-500/10 text-red-300"
            }`}
          >
            <p className="font-bold">
              {toast.type === "success" ? "Berhasil" : "Gagal"}
            </p>
            <p className="mt-1 text-sm text-white/80">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-400">
              Admin Panel
            </p>

            <h1 className="mt-3 text-4xl font-extrabold text-white">
              Handle User
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
              Kelola customer, pantau pesanan, dan validasi pembayaran order
              HyperIndoStore.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Login sebagai
            </p>
            <p className="mt-1 font-bold text-white">
              {authUser?.firstName} {authUser?.lastName}
            </p>
            <p className="text-sm text-lime-400">{authUser?.email}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                <PackageCheck size={24} />
            </div>

            <p className="text-sm text-gray-400">Total Revenue</p>

            <h2 className="mt-2 text-2xl font-extrabold text-lime-400">
                {formatRupiah(totalRevenue)}
            </h2>
            </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
              <Users size={24} />
            </div>
            <p className="text-sm text-gray-400">Total User</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {users.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-300">
              <Clock3 size={24} />
            </div>
            <p className="text-sm text-gray-400">Order Pending</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {pendingOrders}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
              <PackageCheck size={24} />
            </div>
            <p className="text-sm text-gray-400">Order Di Approve</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {completedOrders}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
              <XCircle size={24} />
            </div>
            <p className="text-sm text-gray-400">Order Ditolak</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {rejectedOrders}
            </h2>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Cari nama, email, atau order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-11 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-lime-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition focus:border-lime-400"
            >
              {statusOptions.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  className="bg-black text-white"
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-gray-400">Data user tidak ditemukan.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
              >
                <div className="border-b border-white/10 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                        <User size={28} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-extrabold text-white">
                            {getFullName(user)}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              user.role === "admin"
                                ? "bg-red-500/10 text-red-300"
                                : "bg-lime-400/10 text-lime-400"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <span className="inline-flex items-center gap-2">
                            <Mail size={16} />
                            {user.email}
                          </span>

                          <span>
                            Bergabung: {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Order</p>
                        <p className="font-bold text-white">
                          {user.orders.length}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Selesai</p>
                        <p className="font-bold text-lime-400">
                          {
                            user.orders.filter(
                              (order) => order.status === "completed"
                            ).length
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Belanja</p>
                        <p className="font-bold text-lime-400">
                          {formatRupiah(
                            user.orders
                              .filter((order) => order.status === "completed")
                              .reduce(
                                (total, order) => total + order.totalPrice,
                                0
                              )
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {user.orders.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-center">
                      <p className="text-sm text-gray-400">
                        User ini belum memiliki order.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.orders.map((order) => (
                        <div
                          key={order.orderId}
                          className="rounded-2xl border border-white/10 bg-black/30 p-4"
                        >
                          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-lime-400">
                                  {order.orderId}
                                </p>

                                {renderStatusBadge(order.status)}

                                {order.payment && (
                                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-gray-300">
                                    Payment: {order.payment.status}
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-3 text-lg font-bold text-white">
                                {getServiceName(order)} — {getItemName(order)}
                              </h3>

                              <div className="mt-3 grid gap-2 text-sm text-gray-400 md:grid-cols-2 xl:grid-cols-4">
                                <p>
                                  <span className="text-gray-500">Harga:</span>{" "}
                                  <span className="font-bold text-lime-400">
                                    {formatRupiah(order.totalPrice)}
                                  </span>
                                </p>

                                <p>
                                  <span className="text-gray-500">
                                    Platform:
                                  </span>{" "}
                                  {order.platform || "-"}
                                </p>

                                <p>
                                  <span className="text-gray-500">Versi:</span>{" "}
                                  {order.version || "-"}
                                </p>

                                <p>
                                  <span className="text-gray-500">WhatsApp:</span>{" "}
                                  {order.whatsapp || "-"}
                                </p>

                                <p>
                                  <span className="text-gray-500">
                                    Rockstar ID:
                                  </span>{" "}
                                  {order.gameUserId || "-"}
                                </p>

                                <p>
                                  <span className="text-gray-500">
                                    User Discord:
                                  </span>{" "}
                                  {order.discordUsername || "-"}
                                </p>

                                <p>
                                  <span className="text-gray-500">Metode:</span>{" "}
                                  {order.method || "-"}
                                </p>

                                <p>
                                  <span className="text-gray-500">
                                    Tanggal:
                                  </span>{" "}
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>

                              {order.notes && (
                                <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                                  Notes: {order.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 xl:min-w-[190px]">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdatePaymentStatus(
                                    order.orderId,
                                    "approved"
                                  )
                                }
                                disabled={
                                  updatingOrderId === order.orderId ||
                                  order.status === "completed"
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updatingOrderId === order.orderId ? (
                                  <Loader2
                                    size={17}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCircle2 size={17} />
                                )}
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdatePaymentStatus(
                                    order.orderId,
                                    "rejected"
                                  )
                                }
                                disabled={
                                  updatingOrderId === order.orderId ||
                                  order.status === "rejected"
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updatingOrderId === order.orderId ? (
                                  <Loader2
                                    size={17}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <XCircle size={17} />
                                )}
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}