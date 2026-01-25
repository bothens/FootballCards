export interface AuthResponse {
  userId: string;
  email: string;
  displayName: string;
  token: string;
}

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:7038";


async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (data as any)?.detail ||
      (data as any)?.message ||
      JSON.stringify(data) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

// Backend kräver wrappern: { request: { ... } }
export function apiLogin(email: string, password: string) {
  return postJson<AuthResponse>(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });
}

export function apiRegister(email: string, password: string, displayName: string) {
  return postJson<AuthResponse>(`${API_BASE}/api/auth/register`, {
    email,
    password,
    displayName,
  });
}

export function saveToken(token: string) {
  localStorage.setItem("ft_token", token);
}

export function getToken() {
  return localStorage.getItem("ft_token");
}

export function clearToken() {
  localStorage.removeItem("ft_token");
}
