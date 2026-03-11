import { Request, Response } from "express";
import { getAllProducts } from "../../services/products/products.service";

export function getProducts(req: Request, res: Response) {
  const products = getAllProducts();
  res.json(products);
}
