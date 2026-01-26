import { getToken } from './authService';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7038';

export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';

  // Om status inte Ã¤r OK, kasta fel med meddelande frÃ¥n backend om mÃ¶jligt
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      if (contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMessage =
          (errorData as any)?.detail ||
          (errorData as any)?.message ||
          JSON.stringify(errorData);
      } else {
        const errorText = await res.text();
        errorMessage = errorText || errorMessage;
      }
    } catch {
      // fallback: behÃ¥ll status som felmeddelande
    }
    throw new Error(errorMessage);
  }

  // Parsta JSON sÃ¤kert
  const text = await res.text();       // LÃ¤s som text fÃ¶rst
  console.log('API raw response for', url, ':', text);

  if (!text) {
    // Ingen respons (ex: 204 No Content)
    return null as T;
  }

  if (!contentType.includes('application/json')) {
    return text as T;
  }

  try {
    const data = JSON.parse(text);     // Parsta texten som JSON
    return data as T;
  } catch (err) {
    throw new Error('Invalid JSON returned from API');
  }
}
