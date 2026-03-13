import { Request, Response } from "express";
import { DeliveryService } from "../../services/delivery/delivery.service";

export class DeliveryController {
  static get(req: Request, res: Response) {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ message: "Не авторизован" });

    const userId = Number(session);
    const deliveries = DeliveryService.getUserDeliveries(userId);
    res.json(deliveries);
  }

  static create(req: Request, res: Response) {
    const session = req.cookies.session;
    if (!session) return res.status(401).json({ message: "Не авторизован" });

    const userId = Number(session);
    const { address, phone, email, payment, comment } = req.body;

    if (!address || !phone || !email || !payment) {
      return res.status(400).json({ message: "Адрес, телефон, почта и способ оплаты обязательны" });
    }

    const delivery = DeliveryService.createDelivery(
      userId,
      address,
      phone,
      email,
      payment,
      comment
    );

    res.json(delivery);
  }
}
