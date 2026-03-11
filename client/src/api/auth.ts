import type { User } from "../types/user";

export interface AuthResponse {
  user?: User;
  message?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
}

export interface LoginData {
  login: string;
  password: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getMe(): Promise<AuthResponse> {
  const res = await fetch("http://localhost:3000/me", {
    credentials: "include"
  });

  return res.json();
}
