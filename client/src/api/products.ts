import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/products");

  if (!res.ok) {
    throw new Error("Не удалось загрузить товары");
  }

  return res.json();
}
