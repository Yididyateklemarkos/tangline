import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import { api } from '../api.js';

export default function Home() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getProducts({}).then((all) => setFeatured(all.slice(0, 4)));
  }, []);

  function requestThis(product) {
    navigate('/request', { state: { prefill: product.name } });
  }

  return (
    <>
      <div className="hero">
        <div className="hero-left">
          <div className="hero-tag">{t('hero_tag')}</div>
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-tagline">{t('hero_tagline')}</p>
          <Link to="/request" className="btn btn-primary" style={{ marginRight: 12 }}>{t('hero_cta_quote')} →</Link>
          <Link to="/catalog" className="btn btn-outline">{t('hero_cta_catalog')}</Link>
        </div>
        <div className="hero-right">
          <img src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=900" alt="Shipping containers" />
        </div>
      </div>

      {featured.length > 0 && (
        <>
          <h2 className="section-title">Featured Products</h2>
          <div className="grid">
            {featured.map((p) => (
              <div className="card" key={p.id}>
                <img src={p.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'} alt={p.name} />
                <div className="card-body">
                  <div className="card-cat">{p.category}</div>
                  <div className="card-title">{p.name}</div>
                  <div className="card-desc">{p.description}</div>
                  <div className="card-footer">
                    <span className="price-tag">{p.price_range || t('quote_on_request')}</span>
                    <a onClick={() => requestThis(p)} style={{ color: '#a9842c', fontWeight: 600, cursor: 'pointer' }}>
                      {t('request_this')} →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', paddingBottom: 50 }}>
            <Link to="/catalog" className="btn btn-outline">{t('hero_cta_catalog')}</Link>
          </div>
        </>
      )}
    </>
  );
}
