import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { api } from '../api.js';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.submitContact(form);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="form-page">
      <h1 className="section-title" style={{ padding: 0, marginBottom: 20 }}>{t('contact_title')}</h1>

      {status === 'sent' ? (
        <p>Thanks — we'll be in touch shortly.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('f_name')} *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('f_email')} *</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flexBasis: '100%' }}>
              <label>{t('f_message')} *</label>
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>
          {status === 'error' && <p style={{ color: 'red' }}>Something went wrong. Please try again.</p>}
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : t('f_send')}
          </button>
        </form>
      )}

      <div style={{ marginTop: 40 }}>
        <a href="https://wa.me/yourwhatsappnumber" className="btn btn-outline" style={{ marginRight: 12 }}>WhatsApp</a>
        <a href="https://t.me/yourtelegramhandle" className="btn btn-outline">Telegram</a>
      </div>
    </div>
  );
}
