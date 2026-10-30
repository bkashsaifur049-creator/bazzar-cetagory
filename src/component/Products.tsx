

import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit: string;
  today: number;
  yesterday?: number;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number;
  };
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

const banglaNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

const unitLabel: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  l: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
  piece: "প্রতি পিস",
  gm: "প্রতি ১০০ গ্রাম",
  g: "প্রতি গ্রাম",
  packet: "প্রতি প্যাকেট",
  bag: "প্রতি বস্তা",
};

function getChange(product: Product) {
  if (product.change?.dir && product.change.pct != null) {
    return {
      dir: product.change.dir,
      pct: product.change.pct,
    };
  }

  if (product.yesterday != null && product.yesterday !== 0) {
    const diff = ((product.today - product.yesterday) /
      product.yesterday) * 100;

    return {
      dir: diff > 0 ? "up" : diff < 0 ? "down" : "flat",
      pct: Math.abs(diff),
    };
  }

  return { dir: "flat", pct: 0 };
}

function ProductCard({ product }: { product: Product }) {
  const change = getChange(product);

  const badgeStyle =
    change.dir === "up"
      ? "bg-green-100 text-green-700"
      : change.dir === "down"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600";

  const changeText =
    change.dir === "up"
      ? `▲ ${banglaNumber(change.pct)}%`
      : change.dir === "down"
        ? `▼ ${banglaNumber(change.pct)}%`
        : `— ${banglaNumber(0)}%`;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-4xl transition group-hover:bg-green-100">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeStyle}`}
        >
          {changeText}
        </span>
      </div>

      <h3 className="mt-4 line-clamp-2 min-h-12 font-bold leading-6 text-gray-800 group-hover:text-green-700">
        {product.nameBn}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {unitLabel[product.unit?.toLowerCase()] ||
          `প্রতি ${product.unit || "ইউনিট"}`}
      </p>

      <div className="mt-auto flex items-end justify-between gap-2 pt-5">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-xl font-extrabold text-gray-900">
            {banglaNumber(product.today)}
            <span className="ml-1 text-sm font-semibold">টাকা</span>
          </p>
        </div>

        <span className="mb-1 text-lg text-green-600 transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  type,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  type?: "up" | "down";
}) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {subtitle}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-600">
          {banglaNumber(products.length)}টি পণ্য
        </span>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-gray-50 p-5 text-gray-500">
          {type
            ? "এই মুহূর্তে এই তালিকার পণ্য পাওয়া যায়নি।"
            : "কোনো পণ্য পাওয়া যায়নি।"}
        </p>
      )}
    </section>
  );
}

export default async function Products() {
  let products: Product[] = [];

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("পণ্যের তথ্য আনা যায়নি");
    }

    const result = await response.json();

    const list = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.products)
          ? result.products
          : [];

    products = list.filter(
      (item: Product) =>
        item.id != null &&
        item.nameBn &&
        typeof item.today === "number"
    );
  } catch (error) {
    console.error("BazarDor API error:", error);
  }

  const getPercent = (product: Product) => getChange(product);

  const risers = [...products]
    .filter((p) => getPercent(p).dir === "up")
    .sort((a, b) => getPercent(b).pct - getPercent(a).pct)
    .slice(0, 6);

  const fallers = [...products]
    .filter((p) => getPercent(p).dir === "down")
    .sort((a, b) => getPercent(a).pct - getPercent(b).pct)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ProductSection
        title="আজ দাম বেড়েছে ▲"
        subtitle="যেসব পণ্যের দাম গতকালের তুলনায় বেড়েছে"
        products={risers}
        type="up"
      />

      <ProductSection
        title="আজ দাম কমেছে ▼"
        subtitle="যেসব পণ্যের দাম গতকালের তুলনায় কমেছে"
        products={fallers}
        type="down"
      />

      <section id="সব-পণ্য" className="scroll-mt-24">
        <ProductSection
          title="সব পণ্য"
          subtitle="নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন"
          products={products}
        />
      </section>
    </div>
  );
}
