const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  // Public
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/products?${qs}`).then(handle);
  },
  submitRequest: (data) =>
    fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handle),
  submitContact: (data) =>
    fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handle),

  // Admin (requires password)
  adminHeaders: (password) => ({ 'x-admin-password': password, 'Content-Type': 'application/json' }),

  getAdminProducts: (password) =>
    fetch(`${API_URL}/admin/products`, { headers: api.adminHeaders(password) }).then(handle),
  createProduct: (password, data) =>
    fetch(`${API_URL}/admin/products`, { method: 'POST', headers: api.adminHeaders(password), body: JSON.stringify(data) }).then(handle),
  updateProduct: (password, id, data) =>
    fetch(`${API_URL}/admin/products/${id}`, { method: 'PUT', headers: api.adminHeaders(password), body: JSON.stringify(data) }).then(handle),
  deleteProduct: (password, id) =>
    fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE', headers: { 'x-admin-password': password } }).then(handle),

  getAdminRequests: (password) =>
    fetch(`${API_URL}/admin/requests`, { headers: api.adminHeaders(password) }).then(handle),
  updateRequestStatus: (password, id, status) =>
    fetch(`${API_URL}/admin/requests/${id}`, { method: 'PUT', headers: api.adminHeaders(password), body: JSON.stringify({ status }) }).then(handle),

  getAdminContactMessages: (password) =>
    fetch(`${API_URL}/admin/contact-messages`, { headers: api.adminHeaders(password) }).then(handle),

  // Categories
  getCategories: () => fetch(`${API_URL}/categories`).then(handle),
  createCategory: (password, name) =>
    fetch(`${API_URL}/admin/categories`, { method: 'POST', headers: api.adminHeaders(password), body: JSON.stringify({ name }) }).then(handle),
  updateCategory: (password, id, name) =>
    fetch(`${API_URL}/admin/categories/${id}`, { method: 'PUT', headers: api.adminHeaders(password), body: JSON.stringify({ name }) }).then(handle),
  deleteCategory: (password, id) =>
    fetch(`${API_URL}/admin/categories/${id}`, { method: 'DELETE', headers: { 'x-admin-password': password } }).then(handle),

  // Image upload
  uploadImage: (password, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return fetch(`${API_URL}/admin/upload`, { method: 'POST', headers: { 'x-admin-password': password }, body: fd }).then(handle);
  },

  // AI assistant
  createDraft: (password, formData) =>
    fetch(`${API_URL}/admin/ai-assistant/draft`, {
      method: 'POST',
      headers: { 'x-admin-password': password }, // no Content-Type, browser sets multipart boundary
      body: formData,
    }).then(handle),
  getDrafts: (password) =>
    fetch(`${API_URL}/admin/ai-assistant/drafts`, { headers: api.adminHeaders(password) }).then(handle),
  approveDraft: (password, id, image_url) =>
    fetch(`${API_URL}/admin/ai-assistant/drafts/${id}/approve`, { method: 'POST', headers: api.adminHeaders(password), body: JSON.stringify({ image_url }) }).then(handle),
  rejectDraft: (password, id) =>
    fetch(`${API_URL}/admin/ai-assistant/drafts/${id}/reject`, { method: 'POST', headers: { 'x-admin-password': password } }).then(handle),
};
