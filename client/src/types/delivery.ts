import type { CartItem } from "./basket";

export interface Delivery {
  id: number;
  userId: number;
  address: string;
  phone: string;
  email: string;
  payment: string;
  comment?: string;
  items: CartItem[];
  createdAt: string;
}
