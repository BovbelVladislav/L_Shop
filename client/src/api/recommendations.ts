import type { Product } from "../types/product";

export async function likeProduct(productId: number): Promise<void> {
  const res = await fetch(`http://localhost:3000/recommendations/like/${productId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to like product");
  }
}

export async function getRecommendations(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/recommendations", {
    credentials: "include",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}
