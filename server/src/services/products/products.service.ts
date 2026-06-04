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
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface ProductsFilter {
  search?: string;
  category?: string;
  sort?: "price" | "name";
  available?: boolean;
}
export interface IBackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  
  averageRating?: number;
  comments?: Array<{ 
    username: string; 
    text: string; 
    rating: number; 
    date: string; 
  }>;
}
export class ProductsService {
  // Добавь этот метод прямо внутрь класса ProductsService:
private static products: IBackendProduct[] = [
    // твои товары...
  ];
static addCommentAndRecalculateRating(
  id: number, 
  comment: { username: string; text: string; rating: number; date: string }
) {
  // 1. Ищем товар в твоем массиве данных. 
  // (Замени 'this.products' на имя массива, который используется у тебя внутри сервиса, например, 'productsData' или т.п.)
  const product = this.products.find(p => p.id === id);

  if (!product) return null;

  // 2. Если у товара ещё нет массива комментариев, создаём его
  if (!product.comments) {
    product.comments = [];
  }

  // 3. Добавляем новый отзыв
  product.comments.push(comment);

  // 4. Пересчитываем средний рейтинг (округляем до 1 знака после запятой)
  const totalRating = product.comments.reduce((sum: number, c: any) => sum + c.rating, 0);
  product.averageRating = Number((totalRating / product.comments.length).toFixed(1));

  // 5. 💡 ВАЖНО: Если у тебя в проекте данные сохраняются в JSON-файл (например, через fs.writeFileSync),
  // не забудь прямо здесь вызвать твой метод сохранения, чтобы отзывы не пропадали при перезапуске сервера:
  // this.saveToFile(); 

  return product;
}
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

  private static saveAll(products: Product[]): void {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
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

  static addProduct(data: Omit<Product, 'id'>): Product {
    const products = this.loadAll();
    const newProduct: Product = {
      id: Date.now(),
      ...data
    };
    products.push(newProduct);
    this.saveAll(products);
    return newProduct;
  }

  static updateProduct(id: number, data: Partial<Omit<Product, 'id'>>): Product | undefined {
    const products = this.loadAll();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return undefined;

    products[index] = { ...products[index], ...data };
    this.saveAll(products);
    return products[index];
  }

  static deleteProduct(id: number): boolean {
    const products = this.loadAll();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return false;

    products.splice(index, 1);
    this.saveAll(products);
    return true;
  }
}
