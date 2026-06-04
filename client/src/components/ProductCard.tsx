import React from 'react';
import type { IProduct } from '../types/product'; 
import { useLang } from '../context/LanguageContext';

interface ProductCardProps {
  product: IProduct;
  onAdd: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const { t } = useLang();

  return (
    <div className={`product-card ${!product.available ? 'disabled' : ''}`}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      
      {/* Рендеринг блока рейтинга */}
      <div className="product-rating" style={{ margin: '8px 0', color: '#ffb400', fontSize: '14px' }}>
        ⭐ {product.averageRating ? `${product.averageRating} / 5` : '0.0'} 
        <span style={{ color: '#777', marginLeft: '6px' }}>
          ({product.comments?.length || 0} {t.reviews})
        </span>
      </div>

      <div className="product-footer">
  <span>{t.price}: <strong>{product.price}</strong> руб.</span>
  
  <button 
    type="button"
    className="btn-secondary" // добавь сюда свои CSS-классы для стилизации, если они есть
    disabled={!product.available}
    onClick={() => product.available && onAdd(product)}
    style={{ padding: '6px 12px', cursor: product.available ? 'pointer' : 'not-allowed' }} // пример стилей
  >
    {product.available ? t.inCart : t.notAvailable}
  </button>
</div>
    </div>
  );
};