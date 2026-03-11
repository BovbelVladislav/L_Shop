import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Пути к JSON
const usersPath = path.join(__dirname, "../database/users.json");
const productsPath = path.join(__dirname, "../database/products.json");

// Чтение JSON
function readJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// -------------------------
//      РЕГИСТРАЦИЯ
// -------------------------
app.post("/register", (req, res) => {
  const users = readJSON(usersPath);
  const { name, email, login, phone, password } = req.body;

  if (users.find((u: any) => u.email === email || u.login === login)) {
    return res.json({ message: "Пользователь уже существует" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    login,
    phone,
    password: hashed,
    cart: [],
    deliveries: []
  };

  users.push(newUser);
  writeJSON(usersPath, users);

  res.cookie("token", String(newUser.id), {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ user: newUser });
});

// -------------------------
//          ЛОГИН
// -------------------------
app.post("/login", (req, res) => {
  const users = readJSON(usersPath);
  const { login, password } = req.body;

  const user = users.find((u: any) =>
    u.login === login || u.email === login
  );

  if (!user) return res.json({ message: "Пользователь не найден" });

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.json({ message: "Неверный пароль" });

  res.cookie("token", String(user.id), {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ user });
});

// -------------------------
//          /me
// -------------------------
app.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ message: "Не авторизован" });

  const users = readJSON(usersPath);
  const user = users.find((u: any) => String(u.id) === token);

  if (!user) return res.json({ message: "Сессия истекла" });

  res.json({ user });
});

// -------------------------
//       ТОВАРЫ
// -------------------------
app.get("/products", (req, res) => {
  const products = readJSON(productsPath);
  res.json(products);
});

// -------------------------
//     ДОБАВИТЬ В КОРЗИНУ
// -------------------------
app.post("/cart/add", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ message: "Не авторизован" });

  const { productId } = req.body;

  const users = readJSON(usersPath);
  const products = readJSON(productsPath);

  const user = users.find((u: any) => String(u.id) === token);
  if (!user) return res.json({ message: "Сессия истекла" });

  const product = products.find((p: any) => p.id === productId);
  if (!product) return res.json({ message: "Товар не найден" });

  user.cart.push(product);

  writeJSON(usersPath, users);

  res.json({ cart: user.cart });
});

// -------------------------

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
