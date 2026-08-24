const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const ORG_KEY = 'opshub_org_id';
const TOKEN_KEY = 'opshub_access_token';
const REFRESH_KEY = 'opshub_refresh_token';
const TOKEN_COOKIE = 'opshub_token';

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface Organization {
  id: string;
  name: string;
  role?: string;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

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
  setCookie(TOKEN_COOKIE, data.accessToken, 60 * 60 * 24 * 7);
  if (data.organizationId) {
    localStorage.setItem(ORG_KEY, data.organizationId);
    setCookie(ORG_KEY, data.organizationId, 60 * 60 * 24 * 30);
  }
}

export function setOrganizationId(orgId: string) {
  localStorage.setItem(ORG_KEY, orgId);
  setCookie(ORG_KEY, orgId, 60 * 60 * 24 * 30);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ORG_KEY);
  clearCookie(TOKEN_COOKIE);
  clearCookie(ORG_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  setAuthSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    organizationId: getStoredOrgId() ?? undefined,
  });
  return data.accessToken;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const makeRequest = async (token: string | null) => {
    const orgId = getStoredOrgId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (orgId) headers['x-organization-id'] = orgId;
    return fetch(`${API_URL}${path}`, { ...options, headers });
  };

  let token = getStoredToken();
  let res = await makeRequest(token);

  if (res.status === 401 && token) {
    token = await refreshAccessToken();
    if (token) res = await makeRequest(token);
  }

  if (res.status === 401) {
    clearAuthSession();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: ['Request failed'] }));
    throw new Error(Array.isArray(body.message) ? body.message.join(', ') : body.message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
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
      organizations: Organization[];
    }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () =>
    apiFetch<{ user: { firstName: string; lastName: string; email: string }; organizations: Organization[] }>(
      '/auth/me',
    ),
  dashboard: () =>
    apiFetch<{ kpis: Record<string, number>; topCustomers: Array<{ name: string; revenue: number; margin: number }> }>(
      '/reports/dashboard',
    ),
  customers: {
    list: (params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }) =>
      apiFetch<PaginatedResponse<{ id: string; name: string; email?: string; phone?: string }>>(
        `/customers${buildQuery(params ?? {})}`,
      ),
    get: (id: string) => apiFetch(`/customers/${id}`),
    create: (data: Record<string, string>) =>
      apiFetch<{ id: string }>('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, string>) =>
      apiFetch(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    createContact: (customerId: string, data: Record<string, unknown>) =>
      apiFetch(`/customers/${customerId}/contacts`, { method: 'POST', body: JSON.stringify(data) }),
    deleteContact: (customerId: string, contactId: string) =>
      apiFetch(`/customers/${customerId}/contacts/${contactId}`, { method: 'DELETE' }),
  },
  orders: {
    list: (params?: { page?: number; limit?: number; search?: string; status?: string; sortBy?: string; sortOrder?: string }) =>
      apiFetch<PaginatedResponse<{ id: string; reference: string; title: string; status: string; customer: { name: string } }>>(
        `/orders${buildQuery(params ?? {})}`,
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
  inventory: {
    products: (params?: { page?: number; limit?: number; search?: string }) =>
      apiFetch<PaginatedResponse<{ id: string; name: string; sku?: string; unit: string; currentStock: number; minStock: number; unitCost: number }>>(
        `/inventory/products${buildQuery(params ?? {})}`,
      ),
    createProduct: (data: Record<string, unknown>) =>
      apiFetch('/inventory/products', { method: 'POST', body: JSON.stringify(data) }),
    movements: (params?: { page?: number; limit?: number; productId?: string }) =>
      apiFetch<PaginatedResponse<{ id: string; type: string; quantity: number; product: { name: string }; createdAt: string }>>(
        `/inventory/movements${buildQuery(params ?? {})}`,
      ),
    createMovement: (data: Record<string, unknown>) =>
      apiFetch('/inventory/movements', { method: 'POST', body: JSON.stringify(data) }),
  },
  reports: {
    margins: () => apiFetch('/reports/margins'),
  },
};
