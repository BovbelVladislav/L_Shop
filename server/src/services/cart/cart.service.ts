import fs from "fs";
import path from "path";

const usersPath = path.join(__dirname, "../../../database/users.json");

function loadUsers() {
  return JSON.parse(fs.readFileSync(usersPath, "utf-8"));
}

function saveUsers(users: any) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

export function addToCart(userId: number, productId: number, count: number) {
  const users = loadUsers();
  const user = users.find((u: any) => u.id === userId);

  if (!user) return null;

  if (!user.cart) user.cart = [];

  const existing = user.cart.find((c: any) => c.productId === productId);

  if (existing) {
    existing.count += count;
  } else {
    user.cart.push({ productId, count });
  }

  saveUsers(users);
  return user.cart;
}

export function getCart(userId: number) {
  const users = loadUsers();
  const user = users.find((u: any) => u.id === userId);
  return user?.cart || [];
}
