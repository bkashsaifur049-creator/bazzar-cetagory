
import Hero from "../components/home/Hero";
import ProductSections from "../components/home/ProductSections";
import { getProducts } from "../lib/api";


export default async function Home() {
  let products = [];
  let errorMessage = "";

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Products loading error:", error);
    errorMessage = "পণ্যের তথ্য লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।";
  }

  return (
    <main>
      {/* Hero Banner */}
      <Hero/>

      {/* Product Sections */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        {errorMessage ? (
          <p className="rounded-xl bg-red-50 p-5 text-center text-red-600">
            {errorMessage}
          </p>
        ) : (
          <ProductSections products={products} />
        )}
      </div>
    </main>
  );
}
