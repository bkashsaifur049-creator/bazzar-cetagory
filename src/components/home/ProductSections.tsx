
import type { Product } from "@/types";
import ProductCard from "./ProductCard";

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-extrabold text-[#26372b] sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductSections({
  products,
}: {
  products: Product[];
}) {
  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <div className="space-y-14">
      {/* Section A: Price Increased */}
      <section>
        <SectionHeading
          title="আজ দাম বেড়েছে ▲"
          subtitle="যেসব পণ্যের দাম আজ বৃদ্ধি পেয়েছে"
        />
        <ProductGrid products={risers} />
      </section>

      {/* Section B: Price Decreased */}
      <section>
        <SectionHeading
          title="আজ দাম কমেছে ▼"
          subtitle="যেসব পণ্যের দাম আজ কমেছে"
        />
        <ProductGrid products={fallers} />
      </section>

      {/* Section C: All Products */}
      <section id="সব-পণ্য" className="scroll-mt-40">
        <SectionHeading
          title="সব পণ্য"
          subtitle="নিত্যপ্রয়োজনীয় সব পণ্যের আজকের বাজারদর এক জায়গায়"
        />
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
