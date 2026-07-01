import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminContext.jsx';
import { api } from '../api.js';

export default function AdminAssistant() {
  const { password } = useAdmin();
  const [drafts, setDrafts] = useState([]);
  const [file, setFile] = useState(null);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function loadDrafts() {
    api.getDrafts(password).then(setDrafts);
  }
  useEffect(loadDrafts, []);

  async function handleCreateDraft(e) {
    e.preventDefault();
    if (!file && !instructions) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      if (file) fd.append('file', file);
      if (instructions) fd.append('instructions', instructions);
      await api.createDraft(password, fd);
      setFile(null);
      setInstructions('');
      loadDrafts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function approve(draft) {
    const imageUrl = prompt('Optional: paste an image URL for this product (or leave blank)') || null;
    await api.approveDraft(password, draft.id, imageUrl);
    loadDrafts();
  }

  async function reject(draft) {
    await api.rejectDraft(password, draft.id);
    loadDrafts();
  }

  const pending = drafts.filter((d) => d.status === 'draft');
  const history = drafts.filter((d) => d.status !== 'draft');

  return (
    <div>
      <h2>AI Assistant — Add Products from Documents</h2>
      <p style={{ color: '#666', maxWidth: 600 }}>
        Upload a supplier PDF or a product photo, and/or type instructions. The AI will draft a
        catalog entry for you to review — nothing publishes until you approve it.
      </p>

      <form onSubmit={handleCreateDraft} className="ai-chat">
        <div className="ai-message">
          <div className="form-group">
            <label>Upload PDF or photo (optional)</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label>Instructions (optional)</label>
            <textarea
              placeholder='e.g. "Add this as Construction Machinery, price quote on request, origin China"'
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Reading…' : 'Send to AI'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </form>

      <h3 style={{ marginTop: 30 }}>Pending Review ({pending.length})</h3>
      <div className="ai-chat">
        {pending.length === 0 && <p style={{ color: '#888' }}>No drafts waiting for review.</p>}
        {pending.map((d) => (
          <div className="ai-message" key={d.id}>
            <span className="badge badge-draft">{d.source_type}</span>
            <p>{d.ai_summary}</p>
            <pre>{JSON.stringify(d.extracted_data, null, 2)}</pre>
            <button className="btn btn-primary" onClick={() => approve(d)}>Approve &amp; Publish</button>{' '}
            <button className="btn btn-outline" onClick={() => reject(d)}>Reject</button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 30 }}>History</h3>
      <table className="table">
        <thead><tr><th>Source</th><th>Name</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {history.map((d) => (
            <tr key={d.id}>
              <td>{d.source_type}</td>
              <td>{d.extracted_data?.name}</td>
              <td><span className={`badge badge-${d.status === 'approved' ? 'closed' : 'new'}`}>{d.status}</span></td>
              <td>{new Date(d.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
