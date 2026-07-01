import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext.jsx';
import { api } from '../api.js';

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.getAdminProducts(pw); // use as a test call to validate password
      login(pw);
      navigate('/admin/products');
    } catch {
      setError('Incorrect password.');
    }
  }

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Admin password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={{ padding: 12, width: '100%', marginBottom: 12, border: '1px solid #ddd' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Log In</button>
      </form>
    </div>
  );
}
