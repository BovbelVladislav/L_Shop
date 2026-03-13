import { Router } from "express";
import { register, login, me } from "../controllers/users/users.controller";
import { getProducts } from "../controllers/products/products.controller";
import { addToCartController, getCartController } from "../controllers/cart/cart.controller";
import { FavoritesController } from "../controllers/favorites/favorites.controller";
import { BasketController } from "../controllers/basket/basket.controller";
import { DeliveryController } from "../controllers/delivery/delivery.controller";

const router = Router();

router.get("/products", getProducts);

router.post("/register", register);
router.post("/login", login);

router.get("/me", me);

router.post("/cart/add", addToCartController);
router.get("/cart", getCartController);

router.post("/basket/increase", BasketController.increase);
router.post("/basket/decrease", BasketController.decrease);
router.post("/basket/remove", BasketController.remove);

router.get("/delivery", DeliveryController.get);
router.post("/delivery/create", DeliveryController.create);

router.get("/favorites", FavoritesController.get);
router.post("/favorites/add", FavoritesController.add);
router.post("/favorites/decrease", FavoritesController.decrease);
router.post("/favorites/remove", FavoritesController.remove);
export default router;
