import { Request, Response } from "express";
import { FavoritesService } from "../../services/favorites/favorites.service";

interface FavoritesBody {
  productId: number;
}

interface FavoritesQuery {
  productId?: string;
}

export class FavoritesController {
  static get(req: Request<{}, {}, {}, FavoritesQuery>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const userId = Number(req.user.id);
    const productId = req.query.productId ? Number(req.query.productId) : undefined;

    const favorites = FavoritesService.getFavorites(userId, productId);
    return res.json(favorites);
  }

  static add(req: Request<{}, {}, FavoritesBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId } = req.body;

    if (typeof productId !== "number") {
      return res.status(400).json({ message: "productId должен быть числом" });
    }

    const userId = Number(req.user.id);

    try {
      const favorites = FavoritesService.addFavorite(userId, productId);
      return res.json(favorites);
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }

  static remove(req: Request<{}, {}, FavoritesBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId } = req.body;

    if (typeof productId !== "number") {
      return res.status(400).json({ message: "productId должен быть числом" });
    }

    const userId = Number(req.user.id);

    try {
      const favorites = FavoritesService.removeFavorite(userId, productId);
      return res.json(favorites);
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }
}
