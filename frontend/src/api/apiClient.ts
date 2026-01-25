import { getToken } from './authService';

export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  // Om status inte är OK, kasta fel med meddelande från backend om möjligt
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = (errorData as any)?.detail || (errorData as any)?.message || JSON.stringify(errorData);
    } catch {
      // fallback: behåll status som felmeddelande
    }
    throw new Error(errorMessage);
  }

  // Parsta JSON säkert
  const text = await res.text();       // Läs som text först
  if (!text) {
    // Ingen respons (ex: 204 No Content)
    throw new Error('Empty response from API');
  }

  try {
    const data = JSON.parse(text);     // Parsta texten som JSON
    return data as T;
  } catch (err) {
    throw new Error('Invalid JSON returned from API');
  }
}
