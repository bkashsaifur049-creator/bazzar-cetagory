
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number | string;
  slug: string;
  nameBn: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  unit?: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number;
  };
  markets?: Market[];
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

const bn = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  packet: "প্যাকেট",
  bag: "বস্তা",
};

function formatPrice(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${bn(value)} টাকা`
    : "তথ্য নেই";
}

function PriceCard({
  title,
  value,
  color = "text-gray-900",
}: {
  title: string;
  value?: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-3 text-2xl font-extrabold ${color}`}>
        {formatPrice(value)}
      </p>
    </div>
  );
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  let product: Product;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      notFound();
    }

    const result = await response.json();

    const item = result?.data ?? result?.product ?? result;

    if (
      !item ||
      String(item.id) !== id ||
      typeof item.nameBn !== "string" ||
      typeof item.today !== "number"
    ) {
      notFound();
    }

    product = item as Product;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String(error.digest).startsWith("NEXT_HTTP_ERROR_FALLBACK")
    ) {
      throw error;
    }

    notFound();
  }

  if (product.slug && product.slug !== slug) {
    redirect(`/Products/${id}/${product.slug}`);
  }

  const markets = Array.isArray(product.markets)
    ? product.markets.filter(
        (market) =>
          Number.isFinite(market.min) &&
          Number.isFinite(market.max)
      )
    : [];

  const prices = markets.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const minimum = prices.length
    ? Math.min(...prices)
    : product.today;

  const maximum = prices.length
    ? Math.max(...prices)
    : product.today;

  const average = markets.length
    ? markets.reduce(
        (sum, market) => sum + (market.min + market.max) / 2,
        0
      ) / markets.length
    : product.today;

  const unit =
    units[product.unit?.toLowerCase() || ""] ||
    product.unit ||
    "একক";

  const image = product.image?.trim() || "";
  const imageUrl =
    product.imageUrl ||
    product.image_url ||
    (/^https?:\/\//i.test(image) ? image : "");

  const emoji =
    image && !/^https?:\/\//i.test(image)
      ? image
      : product.categoryIcon || "🛒";

  const change = product.change;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/Products"
          className="font-semibold text-green-700 hover:underline"
        >
          ← সব পণ্যে ফিরে যান
        </Link>

        <section className="mt-6 grid gap-8 rounded-3xl bg-white p-6 shadow-sm sm:p-10 md:grid-cols-2">
          <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-2xl bg-green-50">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={product.nameBn}
                className="h-72 w-full object-contain p-4"
              />
            ) : (
              <span
                className="text-8xl"
                role="img"
                aria-label={product.nameBn}
              >
                {emoji}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-green-700">
              {product.categoryNameBn || product.category || "বাজারের পণ্য"}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
              {product.nameBn}
            </h1>

            <p className="mt-2 text-gray-500">প্রতি {unit}</p>

            <div className="mt-7 rounded-2xl bg-green-50 p-5">
              <p className="text-sm text-gray-600">আজকের দাম</p>
              <p className="mt-1 text-3xl font-extrabold text-green-700">
                {formatPrice(product.today)}
              </p>

              <p
                className={`mt-3 text-sm font-bold ${
                  change?.dir === "up"
                    ? "text-red-600"
                    : change?.dir === "down"
                      ? "text-green-700"
                      : "text-gray-500"
                }`}
              >
                {change?.dir === "up"
                  ? `▲ ${bn(Math.abs(change.pct ?? 0))}% দাম বেড়েছে`
                  : change?.dir === "down"
                    ? `▼ ${bn(Math.abs(change.pct ?? 0))}% দাম কমেছে`
                    : "— দামের পরিবর্তন নেই"}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "গতকাল", price: product.yesterday },
                { label: "গত সপ্তাহ", price: product.lastWeek },
                { label: "গত মাস", price: product.lastMonth },
              ].map(({ label, price }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-100 p-3"
                >
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="mt-2 font-bold text-gray-800">
                    {formatPrice(price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            মূল্য সংক্ষেপ
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <PriceCard title="সর্বনিম্ন দাম" value={minimum} color="text-green-700" />
            <PriceCard title="গড় দাম" value={average} color="text-blue-700" />
            <PriceCard title="সর্বোচ্চ দাম" value={maximum} color="text-red-600" />
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            বিভিন্ন বাজারের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="mt-5 divide-y">
              {markets.map((market, index) => (
                <div
                  key={`${market.market}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {market.market}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {market.division}
                    </p>
                  </div>

                  <p className="font-bold text-green-700">
                    {bn(market.min)}–{bn(market.max)} টাকা
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            আগের দামের তথ্য
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <PriceCard title="গতকাল" value={product.yesterday} />
            <PriceCard title="গত সপ্তাহ" value={product.lastWeek} />
            <PriceCard title="গত মাস" value={product.lastMonth} />
          </div>
        </section>
      </div>
    </main>
  );
}

