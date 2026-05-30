import { Request, Response } from "express";
import { ProductsService, ProductsFilter } from "../../services/products/products.service";

interface ProductsQuery {
  search?: string;
  category?: string;
  sort?: "price" | "name";
  available?: "true" | "false";
}

export class ProductsController {
  static get(req: Request<{}, {}, {}, ProductsQuery>, res: Response) {
    const { search, category, sort, available } = req.query;

    const filters: ProductsFilter = {
      search,
      category,
      sort,
      available: available === undefined ? undefined : available === "true"
    };

    const products = ProductsService.getAllProducts(filters);
    return res.json(products);
  }

  static getOne(req: Request<{ id: string }>, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    const product = ProductsService.getById(id);

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    return res.json(product);
  }
}
