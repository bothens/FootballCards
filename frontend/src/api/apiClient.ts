import { getToken } from './authService';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5025';

type ErrorPayload = {
  detail?: string;
  message?: string;
};

const getErrorMessage = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const detail = typeof record.detail === 'string' ? record.detail : undefined;
  const message = typeof record.message === 'string' ? record.message : undefined;
  return detail || message;
};

export async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';

  // If status is not OK, throw with backend message when possible
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      if (contentType.includes('application/json')) {
        const errorData = (await res.json()) as ErrorPayload;
        errorMessage = getErrorMessage(errorData) || JSON.stringify(errorData);
      } else {
        const errorText = await res.text();
        errorMessage = errorText || errorMessage;
      }
    } catch {
      // fallback: keep status as error message
    }
    throw new Error(errorMessage);
  }

  // Parse JSON safely
  const text = await res.text();       // Read as text first

  if (!text) {
    // No response (e.g. 204 No Content)
    return null as T;
  }

  if (!contentType.includes('application/json')) {
    return text as T;
  }

  try {
    const data = JSON.parse(text);     // Parse text as JSON
    return data as T;
  } catch {
    throw new Error('Invalid JSON returned from API');
  }
}

