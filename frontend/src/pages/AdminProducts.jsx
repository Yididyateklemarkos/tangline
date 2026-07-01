import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { api } from '../api.js';

const EMPTY = { name: '', description: '', category: '', country_of_origin: '', image_url: '', price_range: 'Quote on request', status: 'active' };

export default function AdminProducts() {
  const { password } = useAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);

  function load() {
    api.getAdminProducts(password).then(setProducts);
    api.getCategories().then(setCategories);
  }
  useEffect(load, []);

  function startNew() { setForm(EMPTY); setEditing('new'); }
  function startEdit(p) { setForm(p); setEditing(p.id); }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(password, file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (editing === 'new') await api.createProduct(password, form);
    else await api.updateProduct(password, editing, form);
    setEditing(null);
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this product?')) return;
    await api.deleteProduct(password, id);
    load();
  }

  return (
    <div>
      <h2>Products</h2>
      <button className="btn btn-primary" onClick={startNew}>+ New Product</button>

      {editing && (
        <div className="ai-message" style={{ marginTop: 20, maxWidth: 500 }}>
          <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>

          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group"><label>Country of origin</label><input value={form.country_of_origin} onChange={(e) => setForm({ ...form, country_of_origin: e.target.value })} /></div>

          <div className="form-group">
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {uploading && <p style={{ fontSize: '0.85rem', color: '#888' }}>Uploading…</p>}
            {form.image_url && (
              <img src={form.image_url} alt="preview" style={{ width: 120, marginTop: 8, borderRadius: 4 }} />
            )}
          </div>

          <div className="form-group"><label>Price range</label><input value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} /></div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={save} disabled={uploading}>Save</button>{' '}
          <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      )}

      <table className="table">
        <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Origin</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.image_url ? <img src={p.image_url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : '—'}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.country_of_origin}</td>
              <td><span className={`badge badge-${p.status === 'active' ? 'closed' : 'new'}`}>{p.status}</span></td>
              <td>
                <a onClick={() => startEdit(p)} style={{ cursor: 'pointer', marginRight: 10 }}>Edit</a>
                <a onClick={() => remove(p.id)} style={{ cursor: 'pointer', color: '#b9603f' }}>Delete</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
