import React from 'react';
import type { IProduct } from '../types/product'; // Если в файле написано export interface Product // Подправь путь, если создал отдельный product.ts
import { Button } from './ui/Button';

/**
 * Компонент карточки товара
 * @param {IProduct} product - Данные товара
 * @param {function} onAdd - Функция добавления в корзину
 */
interface ProductCardProps {
  product: IProduct;
  onAdd: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className={`product-card ${!product.available ? 'disabled' : ''}`}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-footer">
        <span>Цена: **{product.price}** руб.</span>
        
        {/* Используем твою универсальную кнопку */}
        <Button 
          text={product.available ? "В корзину" : "Нет в наличии"}
          variant="secondary"
          type="button"
          onClick={() => product.available && onAdd(product)}
        />
      </div>
    </div>
  );
};