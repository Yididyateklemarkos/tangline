import { NavLink } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import { languages } from '../i18n/translations.js';

export default function Navbar() {
  const { lang, changeLang, t } = useLang();

  return (
    <div className="navbar">
      <div className="brand">
        <span className="logo-box">唐</span>
        <span>Tang Line Trading</span>
      </div>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_home')}</NavLink>
        <NavLink to="/catalog" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_catalog')}</NavLink>
        <NavLink to="/request" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_request')}</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_about')}</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_contact')}</NavLink>
      </nav>
      <div className="lang-switch">
        <select value={lang} onChange={(e) => changeLang(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
