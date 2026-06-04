import { Request, Response } from "express";
import { RatingsService } from "../../services/ratings/ratings.service";
import { ProductsService } from "../../services/products/products.service";

interface AddRatingBody {
  productId: number;
  rating: number;
  comment: string;
}

export class RatingsController {
  static addRating(req: Request<{}, {}, AddRatingBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    const product = ProductsService.getById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    const newRating = RatingsService.addRating(
      productId,
      req.user.id,
      rating,
      comment
    );

    return res.status(201).json(newRating);
  }

  static getProductRatings(req: Request<{ id: string }>, res: Response) {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    const ratings = RatingsService.getRatingsByProduct(productId);
    const averageRating = RatingsService.getAverageRating(productId);

    return res.json({
      productId,
      ratings,
      averageRating,
      count: ratings.length
    });
  }

  static deleteRating(req: Request<{ id: string }>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    const ratingId = Number(req.params.id);

    if (Number.isNaN(ratingId)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    const success = RatingsService.deleteRating(ratingId, req.user.id);

    if (!success) {
      return res.status(404).json({ message: "Отзыв не найден" });
    }

    return res.json({ message: "Отзыв удален" });
  }
}
