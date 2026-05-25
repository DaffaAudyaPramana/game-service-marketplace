"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { getCart } from "@/lib/cart";

const navLinks = [
  {
    label: "Testimoni",
    href: "/testimoni",
  },
  {
    label: "Money",
    href: "/games/gta-v/services/money",
  },
  {
    label: "Rank",
    href: "/games/gta-v/services/rank",
  },
  {
    label: "Unlock",
    href: "/games/gta-v/services/unlock",
  },
  {
    label: "Bundle",
    href: "/games/gta-v/services/paket",
  },
];

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [checkAuth]);

  useEffect(() => {
    const syncCart = () => {
      const items = getCart();
      const totalQty = items.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalQty);
    };

    syncCart();

    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);

      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 text-white backdrop-blur-xl">
      <div className="flex min-h-[72px] w-full items-center justify-between gap-3 px-4 sm:px-6">
      {/* LOGO */}
      <Link
        href="/"
        className="flex min-w-0 items-center gap-2 transition hover:opacity-80"
      >
          <Image
            src="/logo/hyperindo.png"
            alt="HyperIndo Logo"
            width={60}
            height={60}
            priority
            className="h-10 w-auto shrink-0 object-contain md:h-12"
          />

        <span className="block max-w-[190px] truncate text-base font-extrabold tracking-tight text-white sm:max-w-none sm:text-xl">
          HYPERINDOSTORE
        </span>
      </Link>

        {/* RIGHT MENU */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {/* DESKTOP MENU */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-lime-400 text-black"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CART DESKTOP ONLY */}
          <Link
            href="/cart"
            className="relative hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:border-lime-400/60 hover:bg-lime-400/10 hover:text-lime-400 md:flex"
          >
            Keranjang

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-lime-400 px-2 text-xs font-black text-black">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH AREA */}
          {!loadingUser && user ? (
            <>
              {/* USER EMAIL */}
              <Link
                href="/customer"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition hover:border-lime-400/60 hover:bg-lime-400/10 hover:text-lime-400 sm:w-auto sm:px-3 sm:py-2"
              >
                <UserCircle size={22} className="shrink-0 text-lime-400" />

                <span className="hidden max-w-[190px] truncate lg:block">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </span>
              </Link>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 hover:text-red-200 sm:flex"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            !loadingUser && (
              <Link
                href="/login"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition hover:border-lime-400/60 hover:bg-lime-400/10 hover:text-lime-400 sm:w-auto sm:px-3 sm:py-2"
              >
                <UserCircle size={22} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/cart"
          className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            pathname === "/cart"
              ? "bg-lime-400 text-black"
              : "bg-white/[0.04] text-gray-300"
          }`}
        >
          Keranjang

          {cartCount > 0 && (
            <span className="ml-2 rounded-full bg-lime-400 px-2 py-0.5 text-xs font-black text-black">
              {cartCount}
            </span>
          )}
        </Link>

        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-lime-400 text-black"
                  : "bg-white/[0.04] text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}