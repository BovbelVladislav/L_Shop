import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import type { User } from '../../types/user';
import type { Product } from '../../types/product';
import { getMe } from '../../api/auth';
import { getProducts } from '../../api/products';
import './admin.css';

export default function AdminPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'coffee',
    available: true,
    tags: []
  });

  useEffect(() => {
    void checkAuth();
  }, []);

  async function checkAuth() {
    const me = await getMe();
    if (!me.user || (me.user.role !== 'owner' && me.user.role !== 'manager')) {
      navigate('/');
      return;
    }
    setUser(me.user);
    void loadProducts();
  }

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setFormData(product);
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'coffee',
      available: true,
      tags: []
    });
  }

  async function handleSave() {
    if (!formData.name || !formData.description || formData.price === undefined) {
      alert(t('common.search'));
      return;
    }

    try {
      const url = editingId 
        ? `/api/admin/products/${editingId}` 
        : '/api/admin/products';
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        void loadProducts();
        handleCancel();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        void loadProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }

  if (!user) return <div>{t('common.search')}</div>;

  return (
    <div className="admin-page">
      <h1>{t('pages.admin')}</h1>

      <div className="admin-grid">
        <div className="products-list">
          <h2>{t('pages.products')}</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('product.description')}</th>
                <th>{t('product.price')}</th>
                <th>{t('common.edit')}</th>
                <th>{t('common.delete')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>{t('common.edit')}</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(p.id)}>{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="product-form">
          <h2>{editingId ? t('common.edit') : t('common.add')} {t('pages.products')}</h2>
          <form onSubmit={e => { e.preventDefault(); void handleSave(); }}>
            <div className="form-group">
              <label>{t('product.description')}:</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('product.description')}
              />
            </div>

            <div className="form-group">
              <label>{t('product.description')}:</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('product.description')}
              />
            </div>

            <div className="form-group">
              <label>{t('product.price')}:</label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder={t('product.price')}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>{t('filter.category')}:</label>
              <select
                value={formData.category || 'coffee'}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="coffee">{t('filter.coffee')}</option>
                <option value="drinks">{t('filter.drinks')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.available || false}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                />
                {t('product.available')}
              </label>
            </div>

            <div className="form-buttons">
              <button type="submit">{t('common.save')}</button>
              <button type="button" onClick={handleCancel}>{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
