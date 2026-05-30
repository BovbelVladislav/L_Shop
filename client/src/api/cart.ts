import { api } from "./api";
import type { CartItem } from "../types/basket";
import type { Product } from "../types/product";

export async function addToCart(productId: number, count: number) {
  const res = await api.post("/cart/add", { productId, count });
  return res.data;
}

export async function getCart(): Promise<CartItem[]> {
  const res = await api.get("/cart");
  const cart: { productId: number; count: number }[] = res.data;

  const productsRes = await api.get("/products");
  const products: Product[] = productsRes.data;

  return cart.map(item => {
    const product = products.find(p => p.id === item.productId);

    return {
      ...item,
      name: product?.name ?? "Неизвестно",
      price: product?.price ?? 0
    };
  });
}
