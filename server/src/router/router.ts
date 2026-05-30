import { Router } from "express";

import { UsersController } from "../controllers/users/users.controller";
import { ProductsController } from "../controllers/products/products.controller";
import { CartController } from "../controllers/cart/cart.controller";
import { FavoritesController } from "../controllers/favorites/favorites.controller";
import { DeliveryController } from "../controllers/delivery/delivery.controller";

import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.get("/me", auth, UsersController.me);

router.get("/products", ProductsController.get);
router.get("/products/:id", ProductsController.getOne);

router.get("/cart", auth, CartController.get);
router.post("/cart/add", auth, CartController.add);
router.put("/cart/update", auth, CartController.update);
router.delete("/cart/remove", auth, CartController.remove);
router.delete("/cart/clear", auth, CartController.clear);

router.get("/favorites", auth, FavoritesController.get);
router.post("/favorites/add", auth, FavoritesController.add);
router.delete("/favorites/remove", auth, FavoritesController.remove);

router.get("/delivery", auth, DeliveryController.get);
router.post("/delivery/create", auth, DeliveryController.create);

export default router;
