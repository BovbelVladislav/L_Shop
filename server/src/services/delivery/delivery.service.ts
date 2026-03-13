import fs from "fs";
import path from "path";

const deliveryPath = path.join(process.cwd(), "server", "database", "delivery.json");
const basketPath = path.join(process.cwd(), "server", "database", "basket.json");

export class DeliveryService {
  static getAll() {
    if (!fs.existsSync(deliveryPath)) return [];
    return JSON.parse(fs.readFileSync(deliveryPath, "utf-8"));
  }

  static saveAll(data: any) {
    fs.writeFileSync(deliveryPath, JSON.stringify(data, null, 2));
  }

  static getUserDeliveries(userId: number) {
    const all = this.getAll();
    return all.filter((d: any) => d.userId === userId);
  }

  static createDelivery(userId: number, address: string, phone: string, email: string, payment: string, comment?: string) {
    const basket = fs.existsSync(basketPath)
      ? JSON.parse(fs.readFileSync(basketPath, "utf-8"))
      : [];

    const userBasket = basket.find((b: any) => b.userId === userId);
    const items = userBasket ? userBasket.items : [];

    const all = this.getAll();

    const newDelivery = {
      id: Date.now(),
      userId,
      address,
      phone,
      email,
      payment,
      comment,
      items,
      createdAt: new Date().toISOString()
    };

    all.push(newDelivery);
    this.saveAll(all);

    // ОЧИСТКА КОРЗИНЫ ПОСЛЕ УСПЕШНОЙ ДОСТАВКИ
    if (userBasket) {
      userBasket.items = [];
      fs.writeFileSync(basketPath, JSON.stringify(basket, null, 2));
    }

    return newDelivery;
  }
}
