import fs from "fs";
import path from "path";

const basketPath = path.join(process.cwd(), "server", "database", "basket.json");

export class BasketService {
  static getBasket() {
    const data = fs.readFileSync(basketPath, "utf-8");
    return JSON.parse(data);
  }

  static saveBasket(basket: any) {
    fs.writeFileSync(basketPath, JSON.stringify(basket, null, 2));
  }

  static increase(userId: string | number, productId: number) {
    const basket = this.getBasket();

    let userBasket = basket.find((b: any) => b.userId === userId);

    if (!userBasket) {
      userBasket = { userId, items: [] };
      basket.push(userBasket);
    }

    const item = userBasket.items.find((i: any) => i.productId === productId);

    if (item) {
      item.count += 1;
    } else {
      userBasket.items.push({ productId, count: 1 });
    }

    this.saveBasket(basket);
    return userBasket;
  }

  static decrease(userId: string | number, productId: number) {
    const basket = this.getBasket();
    const userBasket = basket.find((b: any) => b.userId === userId);

    if (!userBasket) return null;

    const item = userBasket.items.find((i: any) => i.productId === productId);
    if (!item) return userBasket;

    item.count -= 1;

    if (item.count <= 0) {
      userBasket.items = userBasket.items.filter((i: any) => i.productId !== productId);
    }

    this.saveBasket(basket);
    return userBasket;
  }

  static remove(userId: string | number, productId: number) {
    const basket = this.getBasket();
    const userBasket = basket.find((b: any) => b.userId === userId);

    if (!userBasket) return null;

    userBasket.items = userBasket.items.filter((i: any) => i.productId !== productId);

    this.saveBasket(basket);
    return userBasket;
  }
}
