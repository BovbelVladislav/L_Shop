import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

export const LanguageBanner: React.FC = () => {
  const { setLanguage, t } = useLang();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const hasLangCookie = document.cookie.split(';').some(item => item.trim().startsWith('store_lang='));
    if (!hasLangCookie) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (isBelarus: boolean) => {
    setLanguage(isBelarus ? 'be' : 'en');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      zIndex: 1000,
      border: '1px solid #333',
      fontFamily: 'sans-serif'
    }}>
      <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>{t.bannerTitle}</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => handleChoice(true)} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          {t.bannerYes}
        </button>
        <button onClick={() => handleChoice(false)} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          {t.bannerNo}
        </button>
      </div>
    </div>
  );
};