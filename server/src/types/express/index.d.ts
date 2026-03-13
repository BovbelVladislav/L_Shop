import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number | string;
        email?: string;
        login?: string;
        phone?: string;
        name?: string;
      };
    }
  }
}
