import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users/users.service";

export function auth(req: Request, res: Response, next: NextFunction): void {
  const session = req.cookies.session;

  if (!session) {
    req.user = undefined;
    return next();
  }

  const userId = Number(session);
  if (Number.isNaN(userId)) {
    req.user = undefined;
    return next();
  }

  const user = UsersService.getUserById(userId);

  if (!user) {
    req.user = undefined;
    return next();
  }

  req.user = {
    id: user.id,
    email: user.email,
    login: user.login,
    phone: user.phone,
    name: user.name
  };

  next();
}
