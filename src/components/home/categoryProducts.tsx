"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import ProductCard from "@/components/home/ProductCard";

type SortOption = "default" | "low-to-high" | "high-to-low";

export default function CategoryProducts({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low-to-high") {
      result.sort((a, b) => a.today - b.today);
    }

    if (sort === "high-to-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          মোট {products.length.toLocaleString("bn-BD")}টি পণ্য
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-semibold">
            সাজান:
          </label>

          <select
            id="sort"
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as SortOption)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">
              দাম: কম থেকে বেশি
            </option>
            <option value="high-to-low">
              দাম: বেশি থেকে কম
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}