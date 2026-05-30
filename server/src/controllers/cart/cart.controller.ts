import { Request, Response } from "express";
import { CartService } from "../../services/cart/cart.service";

interface AddToCartBody {
  productId: number;
  count: number;
}

interface UpdateCartBody {
  productId: number;
  count: number;
}

interface RemoveCartBody {
  productId: number;
}

export class CartController {
  static add(req: Request<{}, {}, AddToCartBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId, count } = req.body;

    if (typeof productId !== "number" || typeof count !== "number") {
      return res.status(400).json({ message: "productId и count должны быть числами" });
    }

    const userId = Number(req.user.id);

    try {
      const cart = CartService.addToCart(userId, productId, count);
      return res.json(cart);
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }

  static get(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const userId = Number(req.user.id);
    const cart = CartService.getCart(userId);
    return res.json(cart);
  }

  static update(req: Request<{}, {}, UpdateCartBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId, count } = req.body;

    if (typeof productId !== "number" || typeof count !== "number") {
      return res.status(400).json({ message: "productId и count должны быть числами" });
    }

    const userId = Number(req.user.id);

    try {
      const cart = CartService.updateCount(userId, productId, count);
      return res.json(cart);
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }

  static remove(req: Request<{}, {}, RemoveCartBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { productId } = req.body;

    if (typeof productId !== "number") {
      return res.status(400).json({ message: "productId должен быть числом" });
    }

    const userId = Number(req.user.id);

    try {
      const cart = CartService.removeFromCart(userId, productId);
      return res.json(cart);
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }

  static clear(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const userId = Number(req.user.id);

    try {
      const cart = CartService.clearCart(userId);
      return res.json(cart);
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }
}
