const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const ORG_KEY = 'opshub_org_id';
const TOKEN_KEY = 'opshub_access_token';
const REFRESH_KEY = 'opshub_refresh_token';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredOrgId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ORG_KEY);
}

export function setAuthSession(data: {
  accessToken: string;
  refreshToken: string;
  organizationId?: string;
}) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  if (data.organizationId) localStorage.setItem(ORG_KEY, data.organizationId);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ORG_KEY);
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const orgId = getStoredOrgId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (orgId) headers['x-organization-id'] = orgId;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: ['Request failed'] }));
    throw new Error(Array.isArray(body.message) ? body.message.join(', ') : body.message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  register: (data: Record<string, string>) =>
    apiFetch<{ accessToken: string; refreshToken: string; organization: { id: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(data) },
    ),
  login: (data: Record<string, string>) =>
    apiFetch<{
      accessToken: string;
      refreshToken: string;
      organizations: Array<{ id: string; name: string }>;
    }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => apiFetch<{ user: { firstName: string; lastName: string; email: string }; organizations: Array<{ id: string; name: string }> }>('/auth/me'),
  dashboard: () => apiFetch<{ kpis: Record<string, number>; topCustomers: Array<{ name: string; revenue: number; margin: number }> }>('/reports/dashboard'),
  customers: {
    list: (search?: string) =>
      apiFetch<Array<{ id: string; name: string; email?: string; phone?: string }>>(
        `/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`,
      ),
    get: (id: string) => apiFetch(`/customers/${id}`),
    create: (data: Record<string, string>) =>
      apiFetch<{ id: string }>('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, string>) =>
      apiFetch(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  orders: {
    list: (status?: string) =>
      apiFetch<Array<{ id: string; reference: string; title: string; status: string; customer: { name: string } }>>(
        `/orders${status ? `?status=${status}` : ''}`,
      ),
    get: (id: string) => apiFetch(`/orders/${id}`),
    create: (data: Record<string, unknown>) =>
      apiFetch<{ id: string }>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiFetch(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  production: {
    list: (orderId?: string) =>
      apiFetch(`/production${orderId ? `?orderId=${orderId}` : ''}`),
    create: (data: Record<string, unknown>) =>
      apiFetch('/production', { method: 'POST', body: JSON.stringify(data) }),
  },
  reports: {
    margins: () => apiFetch('/reports/margins'),
  },
};
