import { API_BASE_URL, TOKEN_KEY } from "./config";

// ─── Token ───────────────────────────────────────────────────────────────────
// localStorage bisa gagal (mode private, penyimpanan diblokir), jadi selalu
// dibungkus try/catch. Kalau gagal, pengguna cukup login ulang.

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* abaikan */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* abaikan */
  }
}

// ─── Error ───────────────────────────────────────────────────────────────────

/**
 * Error dari lapisan data. `message` selalu berbahasa Indonesia dan aman
 * ditampilkan ke siswa. `status` 0 berarti server tidak bisa dihubungi.
 */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isUnauthorized(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

// Pesan backend masih berbahasa Inggris; diterjemahkan di sini.
const MESSAGE_ID: Record<string, string> = {
  "Invalid credentials": "Email atau password salah.",
  "Email and password are required": "Email dan password wajib diisi.",
  "Email, password, and name are required": "Nama, email, dan password wajib diisi.",
  "User with this email already exists": "Email ini sudah terdaftar. Coba masuk.",
  "Access token required": "Sesi kamu sudah berakhir. Silakan masuk lagi.",
  "Invalid or expired token": "Sesi kamu sudah berakhir. Silakan masuk lagi.",
  "Profile not found": "Profil siswa belum ada.",
  "Student profile not found": "Profil siswa belum ada.",
};

function fallbackMessage(status: number): string {
  if (status === 401 || status === 403) return "Sesi kamu sudah berakhir. Silakan masuk lagi.";
  if (status === 404) return "Data yang dicari tidak ditemukan.";
  if (status >= 500) return "Server sedang bermasalah. Coba lagi sebentar lagi.";
  return "Terjadi kesalahan. Coba lagi.";
}

// ─── Request ─────────────────────────────────────────────────────────────────

type QueryValue = string | number | undefined | null;

/** Menyusun query string dan melewati nilai kosong. */
export function toQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function request<T>(endpoint: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Tidak bisa terhubung ke server. Periksa koneksimu atau coba lagi nanti.");
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    /* respons tanpa JSON */
  }

  if (!response.ok) {
    const raw = (data as { error?: string } | null)?.error ?? "";
    throw new ApiError(response.status, MESSAGE_ID[raw] ?? fallbackMessage(response.status));
  }

  return data as T;
}
