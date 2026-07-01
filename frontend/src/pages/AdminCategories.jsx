import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { api } from '../api.js';

export default function AdminCategories() {
  const { password } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  function load() {
    api.getCategories().then(setCategories);
  }
  useEffect(load, []);

  async function addCategory(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await api.createCategory(password, newName.trim());
    setNewName('');
    load();
  }

  async function saveEdit(id) {
    await api.updateCategory(password, id, editingName.trim());
    setEditingId(null);
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this category? Products using it will keep the old name as plain text.')) return;
    await api.deleteCategory(password, id);
    load();
  }

  return (
    <div>
      <h2>Categories</h2>
      <p style={{ color: '#666', maxWidth: 600 }}>
        Manage the categories shown in the catalog filter and the product form.
      </p>

      <form onSubmit={addCategory} className="ai-input-row" style={{ maxWidth: 500 }}>
        <input placeholder="New category name" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ flex: 1, padding: 10, border: '1px solid #ddd5c5' }} />
        <button className="btn btn-primary">Add</button>
      </form>

      <table className="table" style={{ maxWidth: 500 }}>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>
                {editingId === c.id ? (
                  <input value={editingName} onChange={(e) => setEditingName(e.target.value)} style={{ padding: 6 }} />
                ) : (
                  c.name
                )}
              </td>
              <td style={{ textAlign: 'right' }}>
                {editingId === c.id ? (
                  <>
                    <a onClick={() => saveEdit(c.id)} style={{ cursor: 'pointer', marginRight: 10 }}>Save</a>
                    <a onClick={() => setEditingId(null)} style={{ cursor: 'pointer' }}>Cancel</a>
                  </>
                ) : (
                  <>
                    <a onClick={() => { setEditingId(c.id); setEditingName(c.name); }} style={{ cursor: 'pointer', marginRight: 10 }}>Edit</a>
                    <a onClick={() => remove(c.id)} style={{ cursor: 'pointer', color: '#b9603f' }}>Delete</a>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
