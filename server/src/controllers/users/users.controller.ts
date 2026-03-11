import { Request, Response } from "express";
import { registerUser, loginUser, getUserById } from "../../services/users/users.service";

export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);

    res.cookie("session", user.id, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000
    });

    res.json({ message: "Регистрация успешна", user });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await loginUser(req.body.login, req.body.password);

    res.cookie("session", user.id, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000
    });

    res.json({ message: "Вход выполнен", user });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export function me(req: Request, res: Response) {
  const session = req.cookies.session;

  if (!session) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const user = getUserById(Number(session));

  if (!user) {
    return res.status(401).json({ message: "Сессия истекла" });
  }

  res.json(user);
}
