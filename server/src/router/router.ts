import { Router } from "express";
import { register, login, me } from "../controllers/users/users.controller";
import { getProducts } from "../controllers/products/products.controller";
import { addToCartController, getCartController } from "../controllers/cart/cart.controller";


const router = Router();
router.get("/products", getProducts);
router.post("/register", register);
router.post("/login", login);
router.get("/me", me);
router.post("/cart/add", addToCartController);
router.get("/cart", getCartController);

export default router;
