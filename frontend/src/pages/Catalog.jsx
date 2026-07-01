import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import { api } from '../api.js';

export default function Catalog() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getProducts({ category, search }).then(setProducts).finally(() => setLoading(false));
  }, [category, search]);

  function requestThis(product) {
    navigate('/request', { state: { prefill: product.name } });
  }

  return (
    <>
      <h1 className="section-title">{t('catalog_title')}</h1>
      <div className="toolbar">
        <input
          placeholder={t('catalog_search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">{t('catalog_all')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid">
        {loading && <p>Loading…</p>}
        {!loading && products.length === 0 && <p>No products found.</p>}
        {products.map((p) => (
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
    </>
  );
}
