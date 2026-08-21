const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function token() { return localStorage.getItem('socialconnect_token'); }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const authToken = token();
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  campaigns: () => request('/campaigns'),
  myCampaigns: () => request('/campaigns/mine'),
  pendingCampaigns: () => request('/campaigns/pending'),
  createCampaign: (payload) => request('/campaigns', { method: 'POST', body: JSON.stringify(payload) }),
  joinCampaign: (id) => request(`/campaigns/${id}/join`, { method: 'POST' }),
  reviewCampaign: (id, decision, rejectionReason) => request(`/campaigns/${id}/review`, { method: 'PATCH', body: JSON.stringify({ decision, rejectionReason }) }),
  reports: () => request('/reports'),
  createReport: (payload) => request('/reports', { method: 'POST', body: JSON.stringify(payload) }),
  resolveReport: (id) => request(`/reports/${id}/resolve`, { method: 'PATCH' }),
  dismissReport: (id) => request(`/reports/${id}/dismiss`, { method: 'PATCH' }),
  leads: () => request('/leads'),
  createLead: (payload) => request('/leads', { method: 'POST', body: JSON.stringify(payload) }),
  respondToLead: (id, message = '') => request(`/leads/${id}/respond`, { method: 'POST', body: JSON.stringify({ message }) }),
};

export function saveSession(tokenValue) {
  localStorage.setItem('socialconnect_token', tokenValue);
}
export function clearSession() { localStorage.removeItem('socialconnect_token'); }
