
"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const categories = [
  { name: "সব পণ্য", href: "/" },
  { name: "চাল", href: "/category/chal" },
  { name: "ডাল", href: "/category/dal" },
  { name: "তেল", href: "/category/tel" },
  { name: "সবজি", href: "/category/sobji" },
  { name: "মাছ", href: "/category/mach" },
  { name: "মাংস", href: "/category/mangsho" },
  { name: "ডিম-দুধ", href: "/category/dim-dui" },
  { name: "মসলা", href: "/category/mosla" },
];

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

function NavbarContent() {
  const pathname = usePathname();
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(getBanglaDate());
  }, []);

  // পরে এখানে Better Auth session যুক্ত করবেন।
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      {/* Top Navbar */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        {/* Logo and Date */}
        <Link href="/" className="shrink-0">
          <div className="text-2xl font-extrabold tracking-tight text-green-700">
            🛒 বাজার দর
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {date || "বাংলাদেশের বাজারদর"}
          </p>
        </Link>

        {/* Search */}
        <form
          action="/"
          method="GET"
          className="order-3 flex w-full max-w-md sm:order-none sm:mx-6 sm:flex-1"
        >
          <input
            type="search"
            name="search"
            placeholder="পণ্যের নাম লিখে খুঁজুন..."
            className="min-w-0 flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />
          <button
            type="submit"
            className="rounded-r-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            খুঁজুন
          </button>
        </form>

        {/* Authentication */}
        <div className="flex shrink-0 items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/my-profile"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                প্রোফাইল
              </Link>
              <button
                type="button"
                onClick={() =>
                  alert("এখানে Better Auth signOut যুক্ত করতে হবে।")
                }
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                সাইন আউট
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
              >
                সাইন ইন
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-gray-100 bg-gray-50"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2">
          {categories.map((category) => {
            const active =
              category.href === "/"
                ? pathname === "/"
                : pathname === category.href ||
                pathname.startsWith(`${category.href}/`);

            return (
              <Link
                key={category.href}
                href={category.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${active
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-800"
                  }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="h-16 w-full border-b border-gray-200 bg-white" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
