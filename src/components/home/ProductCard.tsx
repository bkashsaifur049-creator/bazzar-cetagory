
import Link from "next/link";
import type { Product } from "@/types";

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

function formatPrice(price: number) {
  return price.toLocaleString("bn-BD");
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { dir, pct } = product.change;

  const changeStyle =
    dir === "up"
      ? "bg-green-50 text-green-700"
      : dir === "down"
        ? "bg-red-50 text-red-600"
        : "bg-gray-100 text-gray-500";

  const changeIcon =
    dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-[#e7eee8] bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-[#168044] hover:shadow-lg hover:shadow-green-900/5"
    >
      {/* Product Emoji */}
      <div className="flex h-32 items-center justify-center rounded-xl bg-[#f3f8f3] transition group-hover:bg-[#eaf5ec]">
        <span className="text-6xl" role="img" aria-label={product.nameBn}>
          {product.image}
        </span>
      </div>

      {/* Product Name and Unit */}
      <div className="mt-4">
        <h3 className="line-clamp-1 text-base font-bold text-[#26372b] group-hover:text-[#168044]">
          {product.nameBn}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {unitNames[product.unit] || `প্রতি ${product.unit}`}
        </p>
      </div>

      {/* Price Row */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-2 border-t border-dashed border-gray-200 pt-3">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-lg font-extrabold text-[#26372b]">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-bold ${changeStyle}`}
        >
          {changeIcon} {formatPrice(pct)}%
        </span>
      </div>
    </Link>
  );
}

