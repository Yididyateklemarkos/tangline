import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import { api } from '../api.js';

const COUNTRIES = ['Ethiopia', 'Georgia', 'UAE', 'Kazakhstan', 'Tajikistan', 'Russia'];

export default function RequestProduct() {
  const { t } = useLang();
  const location = useLocation();
  const prefill = location.state?.prefill || '';

  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', destination_country: '',
    product_description: prefill, quantity: '', budget_range: '', notes: '',
  });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.submitRequest(form);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-page">
        <h2>Thank you — your request has been received.</h2>
        <p>We'll get back to you shortly with a quote.</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <h1 className="section-title" style={{ padding: 0, marginBottom: 20 }}>{t('request_title')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>{t('f_name')} *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('f_company')}</label>
            <input value={form.company} onChange={(e) => update('company', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('f_email')} *</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('f_phone')}</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('f_destination')} *</label>
            <select required value={form.destination_country} onChange={(e) => update('destination_country', e.target.value)}>
              <option value="">{t('f_select_country')}</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flexBasis: '100%' }}>
            <label>{t('f_product')} *</label>
            <textarea required value={form.product_description} onChange={(e) => update('product_description', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('f_quantity')}</label>
            <input value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('f_budget')}</label>
            <input value={form.budget_range} onChange={(e) => update('budget_range', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flexBasis: '100%' }}>
            <label>{t('f_notes')}</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </div>
        </div>
        {status === 'error' && <p style={{ color: 'red' }}>Something went wrong. Please try again.</p>}
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : t('f_submit')}
        </button>
      </form>
    </div>
  );
}
