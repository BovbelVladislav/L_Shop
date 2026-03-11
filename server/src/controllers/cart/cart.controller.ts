import { Request, Response } from "express";
import { addToCart, getCart } from "../../services/cart/cart.service";

export function addToCartController(req: Request, res: Response) {
  const userId = req.cookies.session;
  if (!userId) return res.status(401).json({ message: "Не авторизован" });

  const { productId, count } = req.body;

  const cart = addToCart(Number(userId), productId, count);
  res.json(cart);
}

export function getCartController(req: Request, res: Response) {
  const userId = req.cookies.session;
  if (!userId) return res.status(401).json({ message: "Не авторизован" });

  const cart = getCart(Number(userId));
  res.json(cart);
}
