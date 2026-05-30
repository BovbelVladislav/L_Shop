import type { Delivery } from "../types/delivery";

export async function getDeliveries(): Promise<Delivery[]> {
  const res = await fetch("http://localhost:3000/delivery", {
    credentials: "include"
  });

  return res.json();
}

export async function createDelivery(data: {
  address: string;
  phone: string;
  email: string;
  payment: string;
  comment?: string;
}): Promise<Delivery> {
  const res = await fetch("http://localhost:3000/delivery/create", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}
