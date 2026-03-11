export interface CartItem {
  productId: number;
  count: number;
}
export interface Delivery {
  id: number;
  address: string;
  status: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  cart?: CartItem[];
  deliveries?: Delivery[];
}

