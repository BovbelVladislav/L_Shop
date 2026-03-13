import fs from "fs";
import path from "path";

const favoritesPath = path.join(process.cwd(), "server", "database", "favorites.json");

export class FavoritesService {
  static getAll() {
    if (!fs.existsSync(favoritesPath)) return [];
    return JSON.parse(fs.readFileSync(favoritesPath, "utf-8"));
  }

  static saveAll(data: any) {
    fs.writeFileSync(favoritesPath, JSON.stringify(data, null, 2));
  }

  static getUserFavorites(userId: number) {
    const all = this.getAll();
    let userFav = all.find((f: any) => f.userId === userId);

    if (!userFav) {
      userFav = { userId, favorites: [] };
      all.push(userFav);
      this.saveAll(all);
    }

    return userFav;
  }

  static add(userId: number, productId: number) {
    const all = this.getAll();
    let userFav = all.find((f: any) => f.userId === userId);

    if (!userFav) {
      userFav = { userId, favorites: [] };
      all.push(userFav);
    }

    const item = userFav.favorites.find((i: any) => i.productId === productId);

    if (item) {
      item.count++;
    } else {
      userFav.favorites.push({ productId, count: 1 });
    }

    this.saveAll(all);
    return userFav;
  }

  static decrease(userId: number, productId: number) {
    const all = this.getAll();
    const userFav = all.find((f: any) => f.userId === userId);

    if (!userFav) return null;

    const item = userFav.favorites.find((i: any) => i.productId === productId);

    if (!item) return userFav;

    if (item.count > 1) {
      item.count--;
    } else {
      userFav.favorites = userFav.favorites.filter((i: any) => i.productId !== productId);
    }

    this.saveAll(all);
    return userFav;
  }

  static remove(userId: number, productId: number) {
    const all = this.getAll();
    const userFav = all.find((f: any) => f.userId === userId);

    if (!userFav) return null;

    userFav.favorites = userFav.favorites.filter((i: any) => i.productId !== productId);

    this.saveAll(all);
    return userFav;
  }
}
