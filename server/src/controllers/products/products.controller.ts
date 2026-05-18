import { Request, Response } from "express";
import { ProductsService, ProductsFilter } from "../../services/products/products.service";

interface ProductsQuery {
  search?: string;
  category?: string;
  sort?: "price" | "name";
  available?: "true" | "false";
}

/**
 * @swagger
 * components:
 * schemas:
 * Product:
 * type: object
 * properties:
 * id:
 * type: number
 * name:
 * type: string
 * description:
 * type: string
 * price:
 * type: number
 * category:
 * type: string
 * available:
 * type: boolean
 */

export class ProductsController {

/**
   * @swagger
   * /products:
   * get:
   * summary: Получение списка товаров с фильтрацией и поиском
   * tags: [Catalog]
   * parameters:
   * - in: query
   * name: search
   * schema: { type: string }
   * description: Поиск по названию товара
   * - in: query
   * name: category
   * schema: { type: string }
   * description: Фильтр по категории (например, phones, home)
   * - in: query
   * name: sort
   * schema: { type: string, enum: [price, name] }
   * description: Сортировка
   * - in: query
   * name: available
   * schema: { type: string, enum: ["true", "false"] }
   * description: Только товары в наличии
   * responses:
   * 200:
   * description: Список товаров
   * content:
   * application/json:
   * schema:
   * type: array
   * items:
   * $ref: '#/components/schemas/Product'
   */

  /**
   * @param {Request} req 
   * @param {Response} res 
   * @returns {Response} 
   */

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
