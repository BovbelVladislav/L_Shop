import { useEffect, useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import './locale-modal.css';

export function LocaleModal() {
  const { language, setLanguage, t, availableLanguages } = useLocale();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('localeModalShown');
    if (!hasSeenModal) {
      setShown(true);
      sessionStorage.setItem('localeModalShown', 'true');
    }
  }, []);

  if (!shown) return null;

  return (
    <div className="locale-modal-overlay">
      <div className="locale-modal">
        <h2>{t('locale.question')}</h2>
        <div className="locale-buttons">
          {availableLanguages.map(lang => (
            <button
              key={lang}
              className={`locale-btn ${language === lang ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang);
                setShown(false);
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
