import fs from "fs";
import path from "path";

const productsPath = path.join(__dirname, "../../../database/products.json");

export function getAllProducts() {
  const data = fs.readFileSync(productsPath, "utf-8");
  return JSON.parse(data);
}
