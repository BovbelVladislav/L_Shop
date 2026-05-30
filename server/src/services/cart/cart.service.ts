import { UsersService, CartItem, User } from "../users/users.service";
import { ProductsService } from "../products/products.service";

export class CartService {
  static getCart(userId: number): CartItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      return [];
    }
    return user.cart;
  }

  static addToCart(userId: number, productId: number, count: number): CartItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const product = ProductsService.getById(productId);
    if (!product || !product.available) {
      throw new Error("Товар недоступен");
    }

    const existing = user.cart.find(item => item.productId === productId);

    if (existing) {
      existing.count += count;
    } else {
      user.cart.push({ productId, count });
    }

    UsersService.updateUser(user);
    return user.cart;
  }

  static updateCount(userId: number, productId: number, count: number): CartItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const item = user.cart.find(i => i.productId === productId);
    if (!item) {
      throw new Error("Товар не найден в корзине");
    }

    item.count = count;

    if (item.count <= 0) {
      user.cart = user.cart.filter(i => i.productId !== productId);
    }

    UsersService.updateUser(user);
    return user.cart;
  }

  static removeFromCart(userId: number, productId: number): CartItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    user.cart = user.cart.filter(i => i.productId !== productId);
    UsersService.updateUser(user);
    return user.cart;
  }

  static clearCart(userId: number): CartItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    user.cart = [];
    UsersService.updateUser(user);
    return user.cart;
  }
}
