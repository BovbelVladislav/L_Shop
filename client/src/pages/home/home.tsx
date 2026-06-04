import { useEffect, useState } from "react";
import "./home.css";
import { useLocale } from "../../context/LocaleContext";
import type { Product } from "../../types/product";
import type { User } from "../../types/user";
import { getProducts } from "../../api/products";
import { getMe } from "../../api/auth";
import { addToCart } from "../../api/cart";
import { likeProduct } from "../../api/recommendations";

type SortOrder = "none" | "asc" | "desc";

export default function HomePage() {
  const { t } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortOrder>("none");
  const [category, setCategory] = useState<string>("all");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const [counts, setCounts] = useState<Record<number, number>>({});
  const [liked, setLiked] = useState<Set<number>>(new Set());

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
      alert(t('common.search'));
      return;
    }

    const count = getCount(product.id);
    await addToCart(product.id, count);
    alert(t('product.addedToCart') || 'Добавлено в корзину');
  }

  async function handleLikeProduct(product: Product): Promise<void> {
    if (!user) {
      alert(t('common.search'));
      return;
    }

    try {
      await likeProduct(product.id);
      setLiked(new Set([...liked, product.id]));
    } catch (e) {
      console.error('Like failed:', e);
    }
  }

  return (
    <div>
      <h1>{t('pages.products')}</h1>

      <div className="filters">
        <input
          placeholder={t('filter.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOrder)}
        >
          <option value="none">{t('filter.priceNone')}</option>
          <option value="asc">{t('filter.priceAsc')}</option>
          <option value="desc">{t('filter.priceDesc')}</option>
        </select>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all">{t('filter.allCategories')}</option>
          <option value="coffee">{t('filter.coffee')}</option>
          <option value="drinks">{t('filter.drinks')}</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={e => setOnlyAvailable(e.target.checked)}
          />
          {t('filter.onlyAvailable')}
        </label>
      </div>

      <div className="products-grid">
        {filteredProducts().map(p => (
          <div className="product-card" key={p.id}>
            <h3 data-title>{p.name}</h3>

            <p>{p.description}</p>

            <p data-price>{t('product.price')}: ${p.price}</p>

            {p.rating !== undefined && (
              <p data-rating>⭐ {p.rating.toFixed(1)} ({p.reviewCount || 0} {t('product.reviews')})</p>
            )}

            <input
              type="number"
              min={1}
              value={getCount(p.id)}
              onChange={e => changeCount(p.id, Number(e.target.value))}
            />

            <button onClick={() => void handleAddToCart(p)}>
              {t('product.addToCart')}
            </button>

            {user && (
              <button 
                onClick={() => void handleLikeProduct(p)}
                style={{ marginLeft: '8px', background: liked.has(p.id) ? '#ff6b6b' : '#ccc' }}
              >
                {liked.has(p.id) ? '❤️' : '🤍'} {t('product.like') || 'Like'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
