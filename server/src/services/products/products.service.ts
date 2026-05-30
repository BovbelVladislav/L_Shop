import fs from "fs";
import path from "path";

const productsPath = path.join(process.cwd(), "server", "database", "products.json");

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

export interface ProductsFilter {
  search?: string;
  category?: string;
  sort?: "price" | "name";
  available?: boolean;
}

export class ProductsService {
  private static loadAll(): Product[] {
    if (!fs.existsSync(productsPath)) {
      fs.writeFileSync(productsPath, "[]");
    }

    const data = fs.readFileSync(productsPath, "utf-8");

    try {
      return JSON.parse(data) as Product[];
    } catch {
      return [];
    }
  }

  static getAllProducts(filters: ProductsFilter = {}): Product[] {
    let products = this.loadAll();

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters.available !== undefined) {
      products = products.filter(p => p.available === filters.available);
    }

    if (filters.sort === "price") {
      products = [...products].sort((a, b) => a.price - b.price);
    }

    if (filters.sort === "name") {
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  }

  static getById(id: number): Product | undefined {
    const products = this.loadAll();
    return products.find(p => p.id === id);
  }
}
