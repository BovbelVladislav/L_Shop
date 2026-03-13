import { Request, Response } from "express";
import { DeliveryService, DeliveryCreateData, DeliveryQueryFilter } from "../../services/delivery/delivery.service";

interface DeliveryBody {
  address: string;
  phone: string;
  email: string;
  payment: string;
  comment?: string;
}

interface DeliveryQuery {
  limit?: string;
  offset?: string;
}

export class DeliveryController {
  static get(req: Request<{}, {}, {}, DeliveryQuery>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const userId = Number(req.user.id);

    const filter: DeliveryQueryFilter = {
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined
    };

    const deliveries = DeliveryService.getDeliveries(userId, filter);
    return res.json(deliveries);
  }

  static create(req: Request<{}, {}, DeliveryBody>, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { address, phone, email, payment, comment } = req.body;

    if (!address || !phone || !email || !payment) {
      return res.status(400).json({ message: "Все поля, кроме комментария, обязательны" });
    }

    const userId = Number(req.user.id);

    const data: DeliveryCreateData = {
      userId,
      address,
      phone,
      email,
      payment,
      comment
    };

    try {
      const delivery = DeliveryService.createDelivery(data);
      return res.json(delivery);
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }
}
