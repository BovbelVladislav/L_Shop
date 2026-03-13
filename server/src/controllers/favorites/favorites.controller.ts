import { Request, Response } from "express";
import { FavoritesService } from "../../services/favorites/favorites.service";

export class FavoritesController {
  static get(req: Request, res: Response) {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ message: "Не авторизован" });

    const userId = Number(session);
    const favorites = FavoritesService.getUserFavorites(userId);
    res.json(favorites);
  }

  static add(req: Request, res: Response) {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ message: "Не авторизован" });

    const { productId } = req.body;
    const userId = Number(session);

    const updated = FavoritesService.add(userId, productId);
    res.json(updated);
  }

  static decrease(req: Request, res: Response) {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ message: "Не авторизован" });

    const { productId } = req.body;
    const userId = Number(session);

    const updated = FavoritesService.decrease(userId, productId);
    res.json(updated);
  }

  static remove(req: Request, res: Response) {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ message: "Не авторизован" });

    const { productId } = req.body;
    const userId = Number(session);

    const updated = FavoritesService.remove(userId, productId);
    res.json(updated);
  }
}
