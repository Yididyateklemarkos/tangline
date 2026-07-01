import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { api } from '../api.js';

export default function AdminRequests() {
  const { password } = useAdmin();
  const [requests, setRequests] = useState([]);

  function load() { api.getAdminRequests(password).then(setRequests); }
  useEffect(load, []);

  async function setStatus(id, status) {
    await api.updateRequestStatus(password, id, status);
    load();
  }

  return (
    <div>
      <h2>Product Requests</h2>
      <table className="table">
        <thead><tr><th>Name</th><th>Destination</th><th>Product</th><th>Email</th><th>Status</th></tr></thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.name}<br /><small>{r.company}</small></td>
              <td>{r.destination_country}</td>
              <td>{r.product_description}</td>
              <td>{r.email}<br /><small>{r.phone}</small></td>
              <td>
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
