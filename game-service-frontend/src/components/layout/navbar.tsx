"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

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

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
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
      <div className="flex min-h-[76px] items-center justify-between px-6">
      {/* LOGO */}
      <Link
        href="/"
        className="flex items-center gap-3 transition hover:opacity-80"
      >
          <Image
            src="/logo/hyperindo.png"
            alt="HyperIndo Logo"
            width={60}
            height={60}
            priority
            className="h-12 w-auto object-contain"
          />

        <span className="text-xl font-extrabold tracking-tight text-white">
          HYPERINDOSTORE
        </span>
      </Link>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-3">
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

          {/* AUTH AREA */}
          {!loadingUser && user ? (
            <>
              {/* USER EMAIL */}
              <Link
                href="/customer"
                className="flex max-w-[230px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white transition hover:border-lime-400/60 hover:bg-lime-400/10 hover:text-lime-400"
              >
                <UserCircle size={22} className="shrink-0 text-lime-400" />

                <span className="hidden truncate sm:block">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </span>
              </Link>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 hover:text-red-200"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            !loadingUser && (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white transition hover:border-lime-400/60 hover:bg-lime-400/10 hover:text-lime-400"
              >
                <UserCircle size={22} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 md:hidden">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
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