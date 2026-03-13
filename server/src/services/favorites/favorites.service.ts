import { UsersService, FavoriteItem } from "../users/users.service";

export class FavoritesService {
  static getFavorites(userId: number, productId?: number): FavoriteItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      return [];
    }

    if (productId !== undefined) {
      return user.favorites.filter(f => f.productId === productId);
    }

    return user.favorites;
  }

  static addFavorite(userId: number, productId: number): FavoriteItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const exists = user.favorites.some(f => f.productId === productId);
    if (!exists) {
      user.favorites.push({ productId });
      UsersService.updateUser(user);
    }

    return user.favorites;
  }

  static removeFavorite(userId: number, productId: number): FavoriteItem[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    user.favorites = user.favorites.filter(f => f.productId !== productId);
    UsersService.updateUser(user);

    return user.favorites;
  }
}
