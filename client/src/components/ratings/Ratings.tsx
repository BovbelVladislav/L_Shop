import { useState, useEffect } from 'react';
import { useLocale } from '../../context/LocaleContext';
import type { Rating } from '../../types/rating';
import './ratings.css';

interface RatingsProps {
  productId: number;
  isLoggedIn: boolean;
}

export function Ratings({ productId, isLoggedIn }: RatingsProps) {
  const { t } = useLocale();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    void loadRatings();
  }, [productId]);

  async function loadRatings() {
    try {
      const res = await fetch(`/api/ratings/${productId}`);
      const data = await res.json();
      setRatings(data.ratings);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    }
  }

  async function handleSubmit() {
    if (!comment.trim()) return;

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: newRating,
          comment
        })
      });

      if (res.ok) {
        setComment('');
        setNewRating(5);
        setShowForm(false);
        void loadRatings();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  }

  return (
    <div className="ratings-section">
      <div className="ratings-header">
        <span className="rating-average">⭐ {averageRating.toFixed(1)}</span>
        <span className="rating-count">({ratings.length} {t('product.reviews')})</span>
      </div>

      {isLoggedIn && !showForm && (
        <button className="add-review-btn" onClick={() => setShowForm(true)}>
          {t('product.addReview')}
        </button>
      )}

      {showForm && (
        <form className="rating-form" onSubmit={e => { e.preventDefault(); void handleSubmit(); }}>
          <div className="form-group">
            <label>{t('product.yourRating')}:</label>
            <select value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
              <option value="5">5 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="1">1 ⭐</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('product.yourComment')}:</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={t('product.yourComment')}
              rows={4}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">{t('product.submit')}</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {ratings.map(r => (
          <div key={r.id} className="review-item">
            <div className="review-header">
              <span className="review-rating">{'⭐'.repeat(r.rating)}</span>
              <span className="review-date">
                {new Date(r.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="review-comment">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
