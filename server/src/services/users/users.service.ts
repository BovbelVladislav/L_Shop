import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const usersPath = path.join(__dirname, "../../../database/users.json");

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  cart: any[];
  deliveries: any[];
}

function readUsers(): User[] {
  return JSON.parse(fs.readFileSync(usersPath, "utf8"));
}

function writeUsers(users: User[]) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

export async function registerUser(data: any) {
  const users = readUsers();

  const exists = users.find(
    u => u.email === data.email || u.login === data.login
  );

  if (exists) {
    throw new Error("Пользователь уже существует");
  }

  const hashed = await bcrypt.hash(data.password, 10);

  const newUser: User = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    login: data.login,
    phone: data.phone,
    password: hashed,
    cart: [],
    deliveries: []
  };

  users.push(newUser);
  writeUsers(users);

  return newUser;
}

export async function loginUser(login: string, password: string) {
  const users = readUsers();

  const user = users.find(
    u => u.login === login || u.email === login
  );

  if (!user) throw new Error("Пользователь не найден");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Неверный пароль");

  return user;
}

export function getUserById(id: number) {
  const users = readUsers();
  return users.find(u => u.id === id);
}
