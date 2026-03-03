const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const getEntries = (period = 'day') =>
  request(`/api/entries?period=${period}`);

export const createEntry = (data) =>
  request('/api/entries', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const voteEntry = (id, type) =>
  request(`/api/entries/${id}/vote`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  });

export const getComments = (id) =>
  request(`/api/entries/${id}/comments`);

export const addComment = (id, data) =>
  request(`/api/entries/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const searchEntries = (q) =>
  request(`/api/entries/search?q=${encodeURIComponent(q)}`);
