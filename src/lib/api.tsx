
import type { Product, Category } from "@/types";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

// API response থেকে array বের করবে
async function getArray<T>(url: string): Promise<T[]> {
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const result: unknown = await response.json();

  if (Array.isArray(result)) {
    return result as T[];
  }

  if (result && typeof result === "object") {
    const payload = result as {
      data?: unknown;
      products?: unknown;
    };

    if (Array.isArray(payload.data)) {
      return payload.data as T[];
    }

    if (Array.isArray(payload.products)) {
      return payload.products as T[];
    }
  }

  throw new Error("Unexpected API response format");
}

// সব পণ্য
export async function getProducts(): Promise<Product[]> {
  return getArray<Product>(`${API_URL}/products`);
}

// নির্দিষ্ট ক্যাটাগরির পণ্য
export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  return getArray<Product>(
    `${API_URL}/products?category=${encodeURIComponent(slug)}`
  );
}

// সব পণ্য থেকে ক্যাটাগরি তৈরি
export async function getCategories(): Promise<Category[]> {
  const products = await getProducts();

  const uniqueCategories = new Map<string, Category>();

  products.forEach((product) => {
    if (!uniqueCategories.has(product.category)) {
      uniqueCategories.set(product.category, {
        slug: product.category,
        nameBn: product.categoryNameBn,
        icon: product.categoryIcon,
      });
    }
  });

  return Array.from(uniqueCategories.values());
}

// slug দিয়ে একটি পণ্য খোঁজা
export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await getProducts();

  return products.find((product) => product.slug === slug);
}
