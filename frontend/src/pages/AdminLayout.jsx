import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext.jsx';

export default function AdminLayout() {
  const { isAuthed, logout } = useAdmin();

  if (!isAuthed) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <div className="admin-sidebar">
        <h3 style={{ marginBottom: 24 }}>Tang Line Admin</h3>
        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink>
        <NavLink to="/admin/requests" className={({ isActive }) => isActive ? 'active' : ''}>Requests</NavLink>
        <NavLink to="/admin/messages" className={({ isActive }) => isActive ? 'active' : ''}>Contact Messages</NavLink>
        <NavLink to="/admin/assistant" className={({ isActive }) => isActive ? 'active' : ''}>AI Assistant</NavLink>
        <a onClick={logout} style={{ marginTop: 20, display: 'block', cursor: 'pointer', color: '#f0a' }}>Log out</a>
      </div>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
