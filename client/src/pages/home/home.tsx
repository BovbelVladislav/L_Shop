import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import type { User } from "../../types/user";
import { getProducts } from "../../api/products";
import { getMe } from "../../api/auth";
import { addToCart } from "../../api/cart";

type SortOrder = "none" | "asc" | "desc";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortOrder>("none");
  const [category, setCategory] = useState<string>("all");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load(): Promise<void> {
    const data = await getProducts();
    setProducts(data);

    const me = await getMe();
    if (me.user) {
      setUser(me.user);
    }
  }

  function filteredProducts(): Product[] {
    let list = [...products];

    const searchLower = search.toLowerCase();
    if (searchLower) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (category !== "all") {
      list = list.filter(p => p.category === category);
    }

    if (onlyAvailable) {
      list = list.filter(p => p.available);
    }

    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);

    return list;
  }

  async function handleAddToCart(product: Product, count: number): Promise<void> {
    if (!user) {
      alert("Только зарегистрированные пользователи могут добавлять товары");
      return;
    }

    await addToCart(product.id, count);
  }

  return (
    <div>
      <h1>Товары</h1>

      <input
        placeholder="Поиск..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <select
        value={sort}
        onChange={e => setSort(e.target.value as SortOrder)}
      >
        <option value="none">Без сортировки</option>
        <option value="asc">Цена ↑</option>
        <option value="desc">Цена ↓</option>
      </select>

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="all">Все категории</option>
        <option value="coffee">Кофе</option>
        <option value="drinks">Напитки</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={e => setOnlyAvailable(e.target.checked)}
        />
        Только доступные
      </label>

      <div>
        {filteredProducts().map(p => {
          const defaultCount = 1;
          let currentCount = defaultCount;

          return (
            <div key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>Цена: {p.price}</p>

              <input
                type="number"
                min={1}
                defaultValue={defaultCount}
                onChange={e => {
                  const value = Number(e.target.value);
                  currentCount = Number.isNaN(value) || value < 1 ? 1 : value;
                }}
              />

              <button onClick={() => void handleAddToCart(p, currentCount)}>
                Добавить
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
