const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Category load failed");
  }

  const result = await res.json();

  return result.data ?? result.categories ?? result;
}