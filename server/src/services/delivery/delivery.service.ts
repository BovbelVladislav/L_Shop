import { UsersService, CartItem, DeliveryRecord } from "../users/users.service";

export interface DeliveryCreateData {
  userId: number;
  address: string;
  phone: string;
  email: string;
  payment: string;
  comment?: string;
}

export interface DeliveryQueryFilter {
  limit?: number;
  offset?: number;
}

export class DeliveryService {
  static getDeliveries(userId: number, filter: DeliveryQueryFilter = {}): DeliveryRecord[] {
    const user = UsersService.getUserById(userId);
    if (!user) {
      return [];
    }

    let deliveries = user.deliveries;

    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? deliveries.length;

    return deliveries.slice(offset, offset + limit);
  }

  static createDelivery(data: DeliveryCreateData): DeliveryRecord {
    const user = UsersService.getUserById(data.userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    if (user.cart.length === 0) {
      throw new Error("Корзина пуста");
    }

    const newDelivery: DeliveryRecord = {
      id: Date.now(),
      userId: data.userId,
      address: data.address,
      phone: data.phone,
      email: data.email,
      payment: data.payment,
      comment: data.comment,
      items: [...user.cart],
      createdAt: new Date().toISOString()
    };

    user.deliveries.push(newDelivery);
    user.cart = [];

    UsersService.updateUser(user);

    return newDelivery;
  }
}
