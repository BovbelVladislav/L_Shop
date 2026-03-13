import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const usersPath = path.join(process.cwd(), "server", "database", "users.json");

export interface CartItem {
  productId: number;
  count: number;
}

export interface FavoriteItem {
  productId: number;
}

export interface DeliveryRecord {
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

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  cart: CartItem[];
  favorites: FavoriteItem[];
  deliveries: DeliveryRecord[];
}

export interface RegisterData {
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
}

export class UsersService {
  private static loadUsers(): User[] {
    if (!fs.existsSync(usersPath)) {
      fs.writeFileSync(usersPath, "[]");
    }

    const data = fs.readFileSync(usersPath, "utf-8");

    try {
      return JSON.parse(data) as User[];
    } catch {
      return [];
    }
  }

  private static saveUsers(users: User[]): void {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  }

  static getUserById(id: number): User | undefined {
    const users = this.loadUsers();
    return users.find(u => u.id === id);
  }

  static updateUser(user: User): void {
    const users = this.loadUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return;
    users[index] = user;
    this.saveUsers(users);
  }

  static async registerUser(data: RegisterData): Promise<User> {
    const users = this.loadUsers();

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
      favorites: [],
      deliveries: []
    };

    users.push(newUser);
    this.saveUsers(users);

    return newUser;
  }

  static async loginUser(login: string, password: string): Promise<User> {
    const users = this.loadUsers();

    const user = users.find(
      u => u.login === login || u.email === login
    );

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new Error("Неверный пароль");
    }

    return user;
  }
}
