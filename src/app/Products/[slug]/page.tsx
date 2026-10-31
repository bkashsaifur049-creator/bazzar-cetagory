
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";

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

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const markets = product.markets ?? [];

  // সব বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম
  const minimumPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : 0;

  const maximumPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : 0;

  // প্রতিটি বাজারের min ও max-এর মাঝামাঝি দাম নিয়ে গড়
  const averagePrice =
    markets.length > 0
      ? Math.round(
          markets.reduce(
            (total, market) => total + (market.min + market.max) / 2,
            0
          ) / markets.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#f7faf7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#168044]">
            হোম
          </Link>
          <span>/</span>
          <span className="text-[#168044]">{product.nameBn}</span>
        </div>

        {/* Product Summary */}
        <section className="rounded-3xl border border-[#e7eee8] bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">

            {/* Product Emoji */}
            <div className="flex h-48 items-center justify-center rounded-2xl bg-[#f0f7f1] sm:h-56">
              <span
                className="text-8xl"
                role="img"
                aria-label={product.nameBn}
              >
                {product.image}
              </span>
            </div>

            {/* Product Information */}
            <div>
              <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-[#168044]">
                {product.categoryIcon} {product.categoryNameBn}
              </span>

              <h1 className="mt-4 text-2xl font-extrabold text-[#26372b] sm:text-4xl">
                {product.nameBn}
              </h1>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                বাংলাদেশের বিভিন্ন বাজারে {product.nameBn}-এর
                আজকের দামের তুলনা ও সর্বশেষ বাজারদর।
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-[#edf7ef] px-4 py-2 text-sm font-semibold text-[#168044]">
                  {product.categoryNameBn}
                </span>

                <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                  {unitNames[product.unit] || `প্রতি ${product.unit}`}
                </span>

                <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                  {formatPrice(markets.length)}টি বাজার
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-8">
          <h2 className="mb-5 text-xl font-extrabold text-[#26372b] sm:text-2xl">
            আজকের দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Minimum */}
            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                সর্বনিম্ন দাম
              </p>
              <p className="mt-3 text-2xl font-extrabold text-green-700">
                {formatPrice(minimumPrice)} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-400">
                বাজারগুলোর মধ্যে সর্বনিম্ন
              </p>
            </div>

            {/* Maximum */}
            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                সর্বোচ্চ দাম
              </p>
              <p className="mt-3 text-2xl font-extrabold text-red-600">
                {formatPrice(maximumPrice)} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-400">
                বাজারগুলোর মধ্যে সর্বোচ্চ
              </p>
            </div>

            {/* Average */}
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                গড় দাম
              </p>
              <p className="mt-3 text-2xl font-extrabold text-blue-700">
                {formatPrice(averagePrice)} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-400">
                বাজারগুলোর আনুমানিক গড়
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            গড় দাম প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবর্তী
            মানের গড় হিসেবে হিসাব করা হয়েছে।
          </p>
        </section>

        {/* Market-wise Prices */}
        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#26372b] sm:text-2xl">
                বাজারভিত্তিক আজকের দাম
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                বিভিন্ন বাজারে {product.nameBn}-এর দামের তুলনা
              </p>
            </div>

            <span className="rounded-full bg-[#edf7ef] px-3 py-1 text-xs font-bold text-[#168044]">
              {formatPrice(markets.length)}টি বাজার
            </span>
          </div>

          {markets.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#e7eee8] bg-white shadow-sm">
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left">
                  <thead className="bg-[#f0f7f1] text-sm text-[#344239]">
                    <tr>
                      <th className="px-6 py-4 font-bold">বাজার</th>
                      <th className="px-6 py-4 font-bold">বিভাগ</th>
                      <th className="px-6 py-4 font-bold">সর্বনিম্ন দাম</th>
                      <th className="px-6 py-4 font-bold">সর্বোচ্চ দাম</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {markets.map((market, index) => (
                      <tr
                        key={`${market.market}-${index}`}
                        className="transition hover:bg-[#f8fbf8]"
                      >
                        <td className="px-6 py-5 font-semibold text-[#26372b]">
                          📍 {market.market}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">
                          {market.division}
                        </td>
                        <td className="px-6 py-5 font-bold text-green-700">
                          {formatPrice(market.min)} টাকা
                        </td>
                        <td className="px-6 py-5 font-bold text-red-600">
                          {formatPrice(market.max)} টাকা
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="grid gap-3 p-3 sm:hidden">
                {markets.map((market, index) => (
                  <div
                    key={`${market.market}-${index}`}
                    className="rounded-xl border border-gray-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[#26372b]">
                          📍 {market.market}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {market.division}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                        বাজার {formatPrice(index + 1)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-green-50 p-3">
                        <p className="text-xs text-gray-500">সর্বনিম্ন</p>
                        <p className="mt-1 font-extrabold text-green-700">
                          {formatPrice(market.min)} টাকা
                        </p>
                      </div>

                      <div className="rounded-lg bg-red-50 p-3">
                        <p className="text-xs text-gray-500">সর্বোচ্চ</p>
                        <p className="mt-1 font-extrabold text-red-600">
                          {formatPrice(market.max)} টাকা
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[#168044] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#116b38]"
          >
            ← সব পণ্যে ফিরে যাও
          </Link>
        </div>
      </div>
    </main>
  );
}


