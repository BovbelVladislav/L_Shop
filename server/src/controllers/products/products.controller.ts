import { Request, Response } from "express";
import { ProductsService, ProductsFilter } from "../../services/products/products.service";

interface ReviewBody {
  rating: number;
  text: string;
}
interface ProductsQuery {
  search?: string;
  category?: string;
  sort?: "price" | "name";
  available?: "true" | "false";
}
// Добавь этот метод прямо внутрь класса ProductsService:

static addCommentAndRecalculateRating(
  id: number, 
  comment: { username: string; text: string; rating: number; date: string }
) {
  // 1. Ищем товар в твоем массиве данных. 
  // (Замени 'this.products' на имя массива, который используется у тебя внутри сервиса, например, 'productsData' или т.п.)
  const product = this.products.find(p => p.id === id);

  if (!product) return null;

  // 2. Если у товара ещё нет массива комментариев, создаём его
  if (!product.comments) {
    product.comments = [];
  }

  // 3. Добавляем новый отзыв
  product.comments.push(comment);

  // 4. Пересчитываем средний рейтинг (округляем до 1 знака после запятой)
  const totalRating = product.comments.reduce((sum: number, c: any) => sum + c.rating, 0);
  product.averageRating = Number((totalRating / product.comments.length).toFixed(1));

  // 5. 💡 ВАЖНО: Если у тебя в проекте данные сохраняются в JSON-файл (например, через fs.writeFileSync),
  // не забудь прямо здесь вызвать твой метод сохранения, чтобы отзывы не пропадали при перезапуске сервера:
  // this.saveToFile(); 

  return product;
}
export class ProductsController {
  static get(req: Request<{}, {}, {}, ProductsQuery>, res: Response) {
    // ... твой код get
  }

  static getOne(req: Request<{ id: string }>, res: Response) {
    // ... твой код getOne
  }

  /**
   * @openapi
   * /api/products/{id}/review:
   * ... твой JSDoc ...
   */
  static addReview(req: Request<{ id: string }, {}, ReviewBody>, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    const { rating, text } = req.body;
    const username = (req as any).user?.username || "Аноним"; 

    if (!rating || rating < 1 || rating > 5 || !text || !text.trim()) {
      return res.status(400).json({ message: "Некорректные данные отзыва" });
    }

    const product = ProductsService.getById(id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    const updatedProduct = ProductsService.addCommentAndRecalculateRating(id, {
      username,
      text,
      rating: Number(rating),
      date: new Date().toISOString()
    });

    return res.status(201).json(updatedProduct);
  }
} // <-- ФИГУРНАЯ СКОБКА КЛАССА ДОЛЖНА БЫТЬ ЗДЕСЬ!