import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import type { Language } from "../../locales/i18n";
import type { User } from "../../types/user";
import { getMe } from "../../api/auth";
import "./header.css";

export default function Header() {
  const { t, language, setLanguage, availableLanguages } = useLocale();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void loadUser();
  }, []);

  async function loadUser() {
    const me = await getMe();
    if (me.user) {
      setUser(me.user);
    }
  }

  const isAdmin = user?.role === 'owner' || user?.role === 'manager';

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">{t('common.title')}</Link>
        </div>

        <nav className="nav">
          <Link to="/">{t('pages.home')}</Link>
          <Link to="/delivery">{t('pages.delivery')}</Link>
          <Link to="/profile">{t('pages.profile')}</Link>
          {isAdmin && <Link to="/admin">{t('pages.admin')}</Link>}
          <Link to="/login">{t('auth.login')}</Link>
          <Link to="/register">{t('auth.register')}</Link>
        </nav>

        <div className="language-selector">
          <select value={language} onChange={e => setLanguage(e.target.value as Language)}>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
