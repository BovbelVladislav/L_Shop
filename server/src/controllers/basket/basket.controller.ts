import { Request, Response } from "express";
import { BasketService } from "../../services/basket/basket.service";

interface BasketBody {
  productId: number;
}

export class BasketController {
  static increase(req: Request<{}, {}, BasketBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId } = req.body;

    if (typeof productId !== "number") {
      return res.status(400).json({ message: "productId должен быть числом" });
    }

    const basket = BasketService.increase(req.user.id, productId);
    return res.json(basket);
  }

  static decrease(req: Request<{}, {}, BasketBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId } = req.body;

    if (typeof productId !== "number") {
      return res.status(400).json({ message: "productId должен быть числом" });
    }

    const basket = BasketService.decrease(req.user.id, productId);
    return res.json(basket);
  }

  static remove(req: Request<{}, {}, BasketBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId } = req.body;

    if (typeof productId !== "number") {
      return res.status(400).json({ message: "productId должен быть числом" });
    }

    const basket = BasketService.remove(req.user.id, productId);
    return res.json(basket);
  }
}
