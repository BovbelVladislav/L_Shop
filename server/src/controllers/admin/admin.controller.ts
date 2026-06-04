import { Request, Response } from "express";
import { ProductsService } from "../../services/products/products.service";
import { RecommendationsService } from "../../services/recommendations/recommendations.service";
import { LocalizationService } from "../../services/localization/localization.service";

interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  tags?: string[];
}

interface UpdateProductBody extends CreateProductBody {}

export class AdminController {
  static createProduct(req: Request<{}, {}, CreateProductBody>, res: Response) {
    if (!req.user || (req.user.role !== 'owner' && req.user.role !== 'manager')) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const { name, description, price, category, available, tags } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    const product = (ProductsService as any).addProduct({
      name,
      description,
      price: Number(price),
      category,
      available: Boolean(available),
      tags: tags || []
    });

    return res.status(201).json(product);
  }

  static updateProduct(req: Request<{ id: string }, {}, UpdateProductBody>, res: Response) {
    if (!req.user || (req.user.role !== 'owner' && req.user.role !== 'manager')) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    const product = ProductsService.getById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    const { name, description, price, category, available, tags } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    const updated = (ProductsService as any).updateProduct(productId, {
      name,
      description,
      price: Number(price),
      category,
      available: Boolean(available),
      tags: tags || []
    });

    return res.json(updated);
  }

  static deleteProduct(req: Request<{ id: string }>, res: Response) {
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ message: "Только владелец может удалять товары" });
    }

    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    const product = ProductsService.getById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    (ProductsService as any).deleteProduct(productId);

    return res.json({ message: "Товар удален" });
  }

  static getLocale(req: Request, res: Response) {
    const language = (req.query.lang as any) || 'en';
    const locale = LocalizationService.getLocaleFile(language as any);
    return res.json(locale);
  }

  static getAvailableLanguages(req: Request, res: Response) {
    const languages = LocalizationService.getAvailableLanguages();
    return res.json({ languages });
  }
}
