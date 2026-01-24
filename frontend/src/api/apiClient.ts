import { getToken } from './authService';

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken();

 const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(options.headers as Record<string, string>),
};

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = (data as any)?.detail || (data as any)?.message || JSON.stringify(data) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
