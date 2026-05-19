"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  Gift,
  Loader2,
  Mail,
  PackageCheck,
  Search,
  ShieldCheck,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import { API_URL } from "@/lib/api";

type RedemptionStatus = "pending" | "approved" | "rejected" | "completed";

interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface RewardData {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  pointsCost: number;
  stock?: number | null;
  active: boolean;
}

interface RedemptionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
}

interface RewardRedemption {
  id: number;
  userId: number;
  rewardId: number;
  pointsCost: number;
  status: RedemptionStatus;
  notes?: string | null;
  createdAt: string;
  user: RedemptionUser;
  reward: RewardData;
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
    label: "Approved",
    value: "approved",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

export default function AdminRewardApprovalPage() {
  const router = useRouter();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFullName = (user: RedemptionUser) => {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return name || user.email;
  };

  const pendingCount = useMemo(() => {
    return redemptions.filter((item) => item.status === "pending").length;
  }, [redemptions]);

  const approvedCount = useMemo(() => {
    return redemptions.filter((item) => item.status === "approved").length;
  }, [redemptions]);

  const completedCount = useMemo(() => {
    return redemptions.filter((item) => item.status === "completed").length;
  }, [redemptions]);

  const rejectedCount = useMemo(() => {
    return redemptions.filter((item) => item.status === "rejected").length;
  }, [redemptions]);

  const filteredRedemptions = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return redemptions.filter((item) => {
      const fullName = getFullName(item.user).toLowerCase();
      const email = item.user.email.toLowerCase();
      const rewardName = item.reward.name.toLowerCase();

      const matchKeyword =
        !keyword ||
        fullName.includes(keyword) ||
        email.includes(keyword) ||
        rewardName.includes(keyword);

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [redemptions, search, statusFilter]);

  const renderStatusBadge = (status: RedemptionStatus) => {
    if (status === "completed") {
      return (
        <span className="inline-flex rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
          Completed
        </span>
      );
    }

    if (status === "approved") {
      return (
        <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-400">
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
        Pending
      </span>
    );
  };

  const fetchData = async () => {
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

      const res = await fetch(`${API_URL}/admin/reward-redemptions`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengambil data redeem reward");
      }

      setRedemptions(data.data || []);
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

  const handleUpdateStatus = async (
    redemptionId: number,
    status: "approved" | "rejected" | "completed"
  ) => {
    try {
      setUpdatingId(redemptionId);

      const res = await fetch(
        `${API_URL}/admin/reward-redemptions/${redemptionId}/status`,
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
        throw new Error(data.error || "Gagal update status redeem");
      }

      showToast("success", data.message || "Status berhasil diupdate");

      await fetchData();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        showToast("error", error.message);
      } else {
        showToast("error", "Terjadi kesalahan");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
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
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-x-0 -top-40 bottom-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute inset-x-0 -top-40 bottom-0 bg-gradient-to-b from-lime-400/5 via-black/70 to-black" />

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

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-400">
              Admin Panel
            </p>

            <h1 className="mt-3 text-4xl font-extrabold text-white">
              Reward Approval
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
              Kelola request redeem reward customer. Approve reward yang valid,
              reject jika tidak sesuai, dan tandai completed setelah reward
              dikirim.
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-300">
              <Clock3 size={24} />
            </div>

            <p className="text-sm text-gray-400">Pending</p>

            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {pendingCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-400">
              <ShieldCheck size={24} />
            </div>

            <p className="text-sm text-gray-400">Approved</p>

            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {approvedCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
              <PackageCheck size={24} />
            </div>

            <p className="text-sm text-gray-400">Completed</p>

            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {completedCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
              <XCircle size={24} />
            </div>

            <p className="text-sm text-gray-400">Rejected</p>

            <h2 className="mt-2 text-3xl font-extrabold text-white">
              {rejectedCount}
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
                placeholder="Cari nama, email, atau nama reward..."
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
          {filteredRedemptions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <Gift className="mx-auto text-gray-500" size={38} />

              <p className="mt-4 text-gray-400">
                Belum ada data redeem reward.
              </p>
            </div>
          ) : (
            filteredRedemptions.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
              >
                <div className="border-b border-white/10 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                        <User size={28} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-extrabold text-white">
                            {getFullName(item.user)}
                          </h2>

                          {renderStatusBadge(item.status)}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <span className="inline-flex items-center gap-2">
                            <Mail size={16} />
                            {item.user.email}
                          </span>

                          <span>Saldo poin: {item.user.points}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                      <p className="text-xs text-gray-500">
                        Tanggal Redeem
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid gap-5 xl:grid-cols-[1fr_220px]">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                          <Trophy size={24} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-extrabold text-white">
                              {item.reward.name}
                            </h3>

                            <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-bold text-lime-400">
                              {item.reward.category}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-relaxed text-gray-400">
                            {item.reward.description || "-"}
                          </p>

                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-sm text-gray-400">
                              Poin yang dipakai
                            </p>

                            <p className="mt-1 text-2xl font-extrabold text-lime-400">
                              {item.pointsCost} Poin
                            </p>
                          </div>

                          {item.notes && (
                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                              <p className="text-sm text-gray-400">
                                Catatan customer
                              </p>

                              <p className="mt-1 text-sm text-white">
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(item.id, "approved")
                        }
                        disabled={
                          updatingId === item.id ||
                          item.status !== "pending"
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === item.id ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(item.id, "completed")
                        }
                        disabled={
                          updatingId === item.id ||
                          item.status !== "approved"
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === item.id ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <PackageCheck size={17} />
                        )}
                        Selesai
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(item.id, "rejected")
                        }
                        disabled={
                          updatingId === item.id ||
                          item.status === "rejected" ||
                          item.status === "completed"
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === item.id ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <XCircle size={17} />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}