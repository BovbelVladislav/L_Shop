import fs from "fs";
import path from "path";

const basketPath = path.join(process.cwd(), "server", "database", "basket.json");

export interface BasketItem {
  productId: number;
  count: number;
}

export interface UserBasket {
  userId: number;
  items: BasketItem[];
}

export class BasketService {
  static getBasket(): UserBasket[] {
    if (!fs.existsSync(basketPath)) {
      fs.writeFileSync(basketPath, "[]");
    }

    const data = fs.readFileSync(basketPath, "utf-8");
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveBasket(basket: UserBasket[]) {
    fs.writeFileSync(basketPath, JSON.stringify(basket, null, 2));
  }

  static increase(userId: number, productId: number): UserBasket {
    const basket = this.getBasket();

    let userBasket = basket.find(b => b.userId === userId);

    if (!userBasket) {
      userBasket = { userId, items: [] };
      basket.push(userBasket);
    }

    const item = userBasket.items.find(i => i.productId === productId);

    if (item) {
      item.count += 1;
    } else {
      userBasket.items.push({ productId, count: 1 });
    }

    this.saveBasket(basket);
    return userBasket;
  }

  static decrease(userId: number, productId: number): UserBasket | null {
    const basket = this.getBasket();
    const userBasket = basket.find(b => b.userId === userId);

    if (!userBasket) return null;

    const item = userBasket.items.find(i => i.productId === productId);
    if (!item) return userBasket;

    item.count -= 1;

    if (item.count <= 0) {
      userBasket.items = userBasket.items.filter(i => i.productId !== productId);
    }

    this.saveBasket(basket);
    return userBasket;
  }

  static remove(userId: number, productId: number): UserBasket | null {
    const basket = this.getBasket();
    const userBasket = basket.find(b => b.userId === userId);

    if (!userBasket) return null;

    userBasket.items = userBasket.items.filter(i => i.productId !== productId);

    this.saveBasket(basket);
    return userBasket;
  }
}
