import { useEffect, useState } from "react";
import "./home.css";
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

  // количество товаров по productId
  const [counts, setCounts] = useState<Record<number, number>>({});

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

  function changeCount(productId: number, value: number) {
    setCounts(prev => ({
      ...prev,
      [productId]: value < 1 || Number.isNaN(value) ? 1 : value
    }));
  }

  function getCount(productId: number): number {
    return counts[productId] ?? 1;
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

  async function handleAddToCart(product: Product): Promise<void> {
    if (!user) {
      alert("Только зарегистрированные пользователи могут добавлять товары");
      return;
    }

    const count = getCount(product.id);
    await addToCart(product.id, count);
  }

 return (
  <div>
    <h1>Товары</h1>

    {/* Блок фильтров */}
    <div className="filters">
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
    </div>

    {/* Сетка карточек */}
    <div className="products-grid">
      {filteredProducts().map(p => (
        <div className="product-card" key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>Цена: {p.price}</p>

          <input
            type="number"
            min={1}
            value={getCount(p.id)}
            onChange={e => changeCount(p.id, Number(e.target.value))}
          />

          <button onClick={() => void handleAddToCart(p)}>
            Добавить
          </button>
        </div>
      ))}
    </div>
  </div>
);

}
