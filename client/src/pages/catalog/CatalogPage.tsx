import React, { useState } from 'react';
import type { IProduct } from '../../types/product';
import { ProductCard } from '../../components/ProductCard';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState('');

  /**
   * Фильтрует массив товаров на основе поискового запроса
   * @param {IProduct[]} items - Исходный список товаров
   * @param {string} query - Строка поиска
   * @returns {IProduct[]} Отфильтрованный список
   */
  const filterProducts = (items: IProduct[], query: string): IProduct[] => {
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredProducts = filterProducts(products, search);

  return (
    <div>
      <h1>Каталог</h1>
      {/* Здесь будет рендер списка карточек */}
    </div>
  );
};