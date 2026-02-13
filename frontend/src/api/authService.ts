export interface AuthResponse {
  userId: string;
  email: string;
  displayName: string;
  token: string;
  userRole: string;
  balance: number;
  imageUrl?: string;
}

export type UserProfile = Omit<AuthResponse, "token">;

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5025";

const getErrorMessage = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const detail = typeof record.detail === "string" ? record.detail : undefined;
  const message = typeof record.message === "string" ? record.message : undefined;
  return detail || message;
};

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse(res: Response) {
  const text = await res.text();

  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = getErrorMessage(data) || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data ?? text;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return (await parseResponse(res)) as T;
}


async function putJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  return (await parseResponse(res)) as T;
}

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

/**
 * Backend endpoint: PUT /api/users/me
 * Du kan skicka ett eller flera fält samtidigt:
 * { displayName?: string, currentPassword?: string, newPassword?: string }
 */
export function apiUpdateProfile(payload: { displayName?: string }) {
  return putJson<string>(`${API_BASE}/api/users/me`, payload);
}

export function apiChangePassword(payload: { oldPassword: string; newPassword: string }) {
  return putJson<string>(`${API_BASE}/api/users/me/password`, payload);
}

export function saveToken(token: string) {
  localStorage.setItem("ft_token", token);
}

export function getToken() {
  return localStorage.getItem("ft_token") || localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("ft_token");
}



export function saveUser(user: UserProfile) {
  localStorage.setItem("ft_user", JSON.stringify(user));
}

export function getUser(): UserProfile | null {
  const raw = localStorage.getItem("ft_user");
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export function clearAuth() {
  localStorage.removeItem("ft_token");
  localStorage.removeItem("ft_user");
  localStorage.removeItem("token");
}
