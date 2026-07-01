import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { api } from '../api.js';

export default function AdminMessages() {
  const { password } = useAdmin();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.getAdminContactMessages(password).then(setMessages);
  }, []);

  return (
    <div>
      <h2>Contact Messages</h2>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr></thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.message}</td>
              <td>{new Date(m.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
