import type { CartItem } from "../types/basket";

export async function addToCart(productId: number, count: number): Promise<void> {
  const res = await fetch("http://localhost:3000/cart/add", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, count })
  });

  if (!res.ok) {
    throw new Error("Не удалось добавить в корзину");
  }
}
export async function getCart(): Promise<CartItem[]> {
  const res = await fetch("http://localhost:3000/cart", {
    credentials: "include"
  });

  return res.json();
}
    