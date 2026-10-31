
import Link from "next/link";
import { getProductsByCategory } from "@/lib/api";
import type { Product } from "@/types";
import CategoryProducts from "@/components/home/categoryProducts";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let products: Product[] = [];

  try {
    products = await getProductsByCategory(slug);
  } catch (error) {
    console.error("Category loading error:", error);
  }

  // Empty state
  if (products.length === 0) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#f7faf7] px-4">
        <div className="max-w-md text-center">
          <div className="text-7xl">🔎</div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#26372b]">
            ৪০৪ — পণ্য পাওয়া যায়নি!
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            অন্য ক্যাটাগরি থেকে পণ্য খুঁজে দেখুন।
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#168044] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#116b38]"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const categoryName = products[0].categoryNameBn;
  const categoryIcon = products[0].categoryIcon;

  return (
    <main className="min-h-screen bg-[#f7faf7]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#168044]">
            হোম
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#168044]">
            {categoryName}
          </span>
        </div>

        {/* Category Heading */}
        <div className="mb-8 rounded-2xl border border-[#e7eee8] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf7ef] text-4xl">
              {categoryIcon}
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#26372b] sm:text-3xl">
                {categoryName}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {categoryName} ক্যাটাগরির সব পণ্যের আজকের বাজারদর।
              </p>
            </div>
          </div>
        </div>

        {/* Product List + Sort */}
        <CategoryProducts products={products} />

      </div>
    </main>
  );
}
