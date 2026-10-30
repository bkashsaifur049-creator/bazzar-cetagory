
import ProductCard from "./ProductCard";

type Product = {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir?: "up" | "down" | "flat" | "same";
    pct?: number;
  };
  markets?: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
};

type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
  anchor: string;
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

const banglaNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

function getChange(product: Product) {
  if (
    product.change &&
    typeof product.change.pct === "number"
  ) {
    return {
      dir: product.change.dir || "flat",
      pct: Math.abs(product.change.pct),
    };
  }

  if (
    typeof product.yesterday === "number" &&
    product.yesterday !== 0
  ) {
    const difference =
      ((product.today - product.yesterday) /
        product.yesterday) *
      100;

    return {
      dir:
        difference > 0
          ? "up"
          : difference < 0
            ? "down"
            : "flat",
      pct: Math.abs(difference),
    };
  }

  return { dir: "flat", pct: 0 };
}

function extractProducts(result: unknown): Product[] {
  let data: unknown = result;

  for (let i = 0; i < 6; i++) {
    if (Array.isArray(data)) {
      return data.filter(
        (item): item is Product =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "slug" in item &&
          "nameBn" in item &&
          "category" in item &&
          typeof item.today === "number"
      );
    }

    if (!data || typeof data !== "object") {
      return [];
    }

    const object = data as Record<string, unknown>;

    if (Array.isArray(object.products)) {
      data = object.products;
      continue;
    }

    if ("data" in object) {
      data = object.data;
      continue;
    }

    if ("products" in object) {
      data = object.products;
      continue;
    }

    return [];
  }

  return [];
}

/* একই Products API থেকে Category তৈরি */
function makeCategories(products: Product[]): Category[] {
  const groups = new Map<string, Product[]>();

  for (const product of products) {
    const id = product.category?.trim();
    if (!id) continue;

    const items = groups.get(id) || [];
    items.push(product);
    groups.set(id, items);
  }

  return Array.from(groups.entries()).map(([id, items]) => ({
    id,
    name: items[0]?.categoryNameBn?.trim() || id,
    icon: items[0]?.categoryIcon || items[0]?.image || "🛒",
    count: items.length,
    anchor: `category-${id}`,
  }));
}

function CategorySection({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          পণ্য অনুযায়ী ক্যাটাগরি
        </h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          আপনার প্রয়োজনীয় পণ্য সহজেই খুঁজে নিন
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.anchor}`}
            className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
          >
            <div className="flex h-24 items-center justify-center rounded-xl bg-green-50">
              <span className="text-5xl" role="img" aria-label={category.name}>
                {category.icon}
              </span>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-gray-900">
                {category.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {banglaNumber(category.count)}টি পণ্য
              </p>

              <p className="mt-2 text-xs font-semibold text-green-700">
                পণ্য দেখুন →
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  anchor,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  anchor?: string;
}) {
  return (
    <section id={anchor} className="mb-12 scroll-mt-24">
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-gray-50 p-5 text-gray-500">
          এই তালিকায় কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}

export default async function Products() {
  let products: Product[] = [];
  let apiError = false;

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result: unknown = await response.json();
    products = extractProducts(result);
  } catch (error) {
    console.error("BazarDor Products API error:", error);
    apiError = true;
  }

  const categories = makeCategories(products);

  const risers = products
    .filter((product) => getChange(product).dir === "up")
    .sort((a, b) => getChange(b).pct - getChange(a).pct)
    .slice(0, 6);

  const fallers = products
    .filter((product) => getChange(product).dir === "down")
    .sort((a, b) => getChange(b).pct - getChange(a).pct)
    .slice(0, 6);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {apiError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-bold text-red-800">
            পণ্যের তথ্য লোড করা যায়নি
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            API URL, ইন্টারনেট সংযোগ এবং Terminal-এর error পরীক্ষা করো।
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-bold text-gray-900">
            পণ্যের তথ্য পাওয়া যাচ্ছে না
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            API response-এর structure পরীক্ষা করো।
          </p>
        </div>
      ) : (
        <>
          <CategorySection categories={categories} />

          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category?.trim() === category.id
            );

            return (
              <ProductSection
                key={category.id}
                title={`${category.icon} ${category.name}`}
                subtitle={`${category.name} বিভাগের বাজারদর`}
                products={categoryProducts}
                anchor={category.anchor}
              />
            );
          })}

          <ProductSection
            title="আজ দাম বেড়েছে ▲"
            subtitle="গতকালের তুলনায় যেসব পণ্যের দাম বেড়েছে"
            products={risers}
          />

          <ProductSection
            title="আজ দাম কমেছে ▼"
            subtitle="গতকালের তুলনায় যেসব পণ্যের দাম কমেছে"
            products={fallers}
          />

          <ProductSection
            title="সব পণ্য"
            subtitle="নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন"
            products={products}
            anchor="all-products"
          />
        </>
      )}
    </main>
  );
}



