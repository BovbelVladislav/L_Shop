import { Request, Response } from "express";
import { UsersService, RegisterData } from "../../services/users/users.service";

interface RegisterBody extends RegisterData {}

interface LoginBody {
  login: string;
  password: string;
}

export class UsersController {
  static async register(req: Request<{}, {}, RegisterBody>, res: Response) {
    try {
      const { name, email, login, phone, password } = req.body;

      if (!name || !email || !login || !phone || !password) {
        return res.status(400).json({ message: "Все поля обязательны" });
      }

      const user = await UsersService.registerUser(req.body);

      res.cookie("session", String(user.id), {
        httpOnly: true,
        maxAge: 10 * 60 * 1000
      });

      return res.json({ message: "Регистрация успешна", user });
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request<{}, {}, LoginBody>, res: Response) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({ message: "Логин и пароль обязательны" });
      }

      const user = await UsersService.loginUser(login, password);

      res.cookie("session", String(user.id), {
        httpOnly: true,
        maxAge: 10 * 60 * 1000
      });

      return res.json({ message: "Вход выполнен", user });
    } catch (e) {
      const error = e as Error;
      return res.status(400).json({ message: error.message });
    }
  }

  static me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const userId = Number(req.user.id);
    const user = UsersService.getUserById(userId);

    if (!user) {
      return res.status(401).json({ message: "Сессия истекла" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      login: user.login,
      phone: user.phone
    });
  }
}
