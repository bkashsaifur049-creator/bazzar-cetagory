
"use client";

import { useEffect, useState } from "react";

type Product = {
  id?: number | string;
  _id?: string;
  name?: string;
  productName?: string;
  price?: number | string;
  unit?: string;
  emoji?: string;
  priceChange?: number;
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("পণ্য লোড করা যায়নি");

        const result = await response.json();

        // API যদি data property-তে array দেয়
        const items = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.products)
              ? result.products
              : [];

        setProducts(items);
      } catch (error) {
        console.error("Price ticker error:", error);
      }
    }

    loadProducts();
  }, []);

  if (products.length === 0) {
    return (
      <div className="bg-green-900 px-4 py-3 text-sm text-white">
        বাজারদরের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  // ধারাবাহিক স্ক্রলিংয়ের জন্য একই তালিকা দুইবার
  const tickerItems = [...products, ...products];

  return (
    <div
      className="overflow-hidden bg-green-900 py-3 text-white"
      aria-label="বর্তমান বাজারদর"
    >
      <div className="ticker-track flex w-max items-center">
        {tickerItems.map((product, index) => {
          const name =
            product.name ?? product.productName ?? "পণ্য";

          const price = product.price ?? "—";
          const unit = product.unit ?? "একক";

          return (
            <div
              key={`${product.id ?? product._id ?? name}-${index}`}
              className="mx-6 flex shrink-0 items-center gap-2 whitespace-nowrap text-sm"
            >
              <span>{product.emoji ?? "🛒"}</span>
              <span className="font-semibold">{name}</span>
              <span>
                ৳{price}/{unit}
              </span>

              {typeof product.priceChange === "number" && (
                <span
                  className={
                    product.priceChange >= 0
                      ? "font-bold text-red-300"
                      : "font-bold text-green-300"
                  }
                >
                  {product.priceChange >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(product.priceChange)}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 35s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
