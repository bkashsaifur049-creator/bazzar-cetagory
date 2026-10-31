
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const categories = [
  { name: "সব পণ্য", slug: "" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "ডিম-দুধ", slug: "dim-dui" },
  { name: "মাছ", slug: "mach" },
  { name: "মাংস", slug: "mangsho" },
  { name: "মসলা", slug: "mosla" },
  { name: "সবজি", slug: "sobji" },
  { name: "তেল", slug: "tel" },
];

type NavbarProps = {
  user?: {
    name?: string;
  } | null;
};

export default function Navbar({ user = null }: NavbarProps) {
  const pathname = usePathname();
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    setBanglaDate(formattedDate);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* First Row: Logo, Date and Authentication */}
      <div className="border-b border-[#e8eee9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo and Bangla Date */}
          <Link href="/" className="group">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🛒</span>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#168044]">
                বাজার দর
              </h1>
            </div>

            <p className="mt-1 pl-10 text-xs text-gray-500">
              {banglaDate || "আজকের বাজার দর"}
            </p>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-lg border border-[#dce9df] px-3 py-2 text-sm font-semibold text-[#168044] hover:bg-[#edf7ef]"
                >
                  👤 {user.name || "প্রোফাইল"}
                </Link>

                <span className="hidden rounded-lg bg-[#edf7ef] px-3 py-2 text-sm font-semibold text-[#168044] sm:inline-block">
                  লগইন করা আছে
                </span>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#168044] transition hover:bg-[#edf7ef]"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-lg bg-[#168044] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#116b38]"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Category Navigation */}
      <div className="border-b border-[#e8eee9] bg-white">
        <nav
          aria-label="Product categories"
          className="mx-auto flex max-w-7xl items-center justify-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8"
        >
          {categories.map((category) => {
            const href = category.slug
              ? `/category/${category.slug}`
              : "/";

            const isActive =
              category.slug === ""
                ? pathname === "/"
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <Link
                key={category.slug || "all"}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#168044] text-white shadow-sm"
                    : "text-[#344239] hover:bg-[#edf7ef] hover:text-[#168044]"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
