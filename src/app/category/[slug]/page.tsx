
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

type Category = {
  id?: string | number;
  slug?: string;
  category?: string;
  name?: string;
  nameBn?: string;
  categoryNameBn?: string;
  icon?: string;
  categoryIcon?: string;
  image?: string;
  imageUrl?: string;
  categoryImage?: string;
};

type Product = {
  id: string | number;
  slug?: string;
  nameBn: string;
  category?: string;
  categoryId?: string | number;
  categorySlug?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  imageUrl?: string;
  unit?: string;
  today: number;
  yesterday?: number;
  change?: {
    dir?: string;
    pct?: number;
  };
};

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

async function fetchAPI(path: string) {
  for (const base of API_URLS) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
      });

      if (!response.ok) continue;

      return await response.json();
    } catch {
      // Try the next API.
    }
  }

  throw new Error("সব API থেকে তথ্য আনা যায়নি");
}

function unwrap(data: any): any {
  let current = data;

  for (let i = 0; i < 4; i++) {
    if (Array.isArray(current)) return current;
    if (!current || typeof current !== "object") return current;

    const next =
      current.data ??
      current.categories ??
      current.products ??
      current.result;

    if (next === undefined || next === current) break;
    current = next;
  }

  return current;
}

function getArray<T>(data: any): T[] {
  const result = unwrap(data);
  return Array.isArray(result) ? result : [];
}

function categorySlug(category: Category) {
  return normalize(
    category.slug ?? category.category ?? category.id
  );
}

function categoryName(category: Category) {
  return (
    category.nameBn ||
    category.categoryNameBn ||
    category.name ||
    category.category ||
    "ক্যাটাগরি"
  );
}

function getCategoryImage(category: Category) {
  return (
    category.imageUrl ||
    category.categoryImage ||
    category.image ||
    ""
  );
}

function getCategoryIcon(category: Category) {
  return category.icon || category.categoryIcon || "🛒";
}

function isImageUrl(value: string) {
  return (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("/")
  );
}

function CategoryVisual({
  category,
}: {
  category: Category | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [category?.id, category?.slug]);

  const image = category ? getCategoryImage(category) : "";
  const icon = category ? getCategoryIcon(category) : "🛒";

  if (image && isImageUrl(image) && !imageFailed) {
    return (
      <img
        src={image}
        alt={category ? categoryName(category) : "Category"}
        onError={() => setImageFailed(true)}
        className="h-20 w-20 rounded-2xl object-cover"
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-5xl">
      {icon}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const image = product.imageUrl || product.image;

  return (
    <Link
      href={
        product.slug
          ? `/product/${product.slug}`
          : `/product/${product.id}`
      }
      className="group rounded-xl border border-gray-200 bg-white p-3 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-3 flex h-36 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
        {image ? (
          <img
            src={image}
            alt={product.nameBn}
            loading="lazy"
            className="h-full w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-5xl">
            {product.categoryIcon || "🛒"}
          </span>
        )}
      </div>

      <h2 className="font-semibold text-gray-800 group-hover:text-green-700">
        {product.nameBn}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        প্রতি {product.unit || "একক"}
      </p>

      <p className="mt-2 text-lg font-bold text-green-700">
        ৳{product.today}
      </p>

      {product.change?.pct !== undefined && (
        <p
          className={`mt-1 text-sm ${
            product.change.dir === "up"
              ? "text-red-600"
              : product.change.dir === "down"
                ? "text-green-600"
                : "text-gray-500"
          }`}
        >
          {product.change.dir === "up"
            ? "▲"
            : product.change.dir === "down"
              ? "▼"
              : "•"}{" "}
          {Math.abs(product.change.pct)}%
        </p>
      )}
    </Link>
  );
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = normalize(params.slug);

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [categoryResult, productResult] =
          await Promise.all([
            fetchAPI("/categories"),
            fetchAPI("/products"),
          ]);

        const categories = getArray<Category>(categoryResult);
        const allProducts = getArray<Product>(productResult);

        const foundCategory =
          categories.find(
            (item) => categorySlug(item) === slug
          ) ||
          categories.find(
            (item) =>
              normalize(item.nameBn) === slug ||
              normalize(item.categoryNameBn) === slug
          ) ||
          null;

        const matchedProducts = allProducts.filter((product) => {
          const values = [
            product.category,
            product.categorySlug,
            product.categoryId,
            product.categoryNameBn,
          ];

          return values.some(
            (value) => normalize(value) === slug
          );
        });

        if (active) {
          setCategory(foundCategory);
          setProducts(matchedProducts);
        }
      } catch {
        if (active) {
          setError("তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") return a.today - b.today;
    if (sort === "high") return b.today - a.today;
    return 0;
  });

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 h-24 animate-pulse rounded-2xl bg-gray-100" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <Link
        href="/"
        className="mb-5 inline-block text-sm text-green-700 hover:underline"
      >
        ← হোম পেজে ফিরে যান
      </Link>

      <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <CategoryVisual category={category} />

        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {category ? categoryName(category) : slug}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            এই ক্যাটাগরির পণ্যের আজকের বাজারদর
          </p>

          <p className="mt-1 text-sm text-green-700">
            মোট {products.length}টি পণ্য
          </p>
        </div>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-white"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center">
          <p className="text-4xl">📦</p>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            API-এর category মান ও URL slug মিলিয়ে দেখুন।
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </main>
  );
}
