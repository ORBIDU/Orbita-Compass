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

  /** Sesi berakhir (token kedaluwarsa atau tidak valid). Lihat SESSION_EXPIRED_EVENT. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

// ─── Sesi berakhir ───────────────────────────────────────────────────────────

/**
 * Dikirim ke `window` saat request dengan token ditolak karena sesi berakhir.
 * Token sudah dihapus; AuthContext lalu logout dan menampilkan
 * SESSION_EXPIRED_MESSAGE di halaman Masuk, dan RequireAuth membawa siswa ke
 * /masuk lalu kembali ke halaman tadi setelah masuk lagi.
 */
export const SESSION_EXPIRED_EVENT = "orbita:session-expired";
export const SESSION_EXPIRED_MESSAGE = "Sesimu sudah berakhir. Silakan masuk lagi.";

// Backend mengirim 403 (bukan 401) untuk token kedaluwarsa (API_CONTRACT 2.6).
const EXPIRED_TOKEN_ERRORS = new Set(["Access token required", "Invalid or expired token"]);

// Pesan backend masih berbahasa Inggris; diterjemahkan di sini.
const MESSAGE_ID: Record<string, string> = {
  "Invalid credentials": "Email atau password salah.",
  "Email and password are required": "Email dan password wajib diisi.",
  "Profile not found": "Profil siswa belum ada.",
  "Student profile not found": "Profil siswa belum ada.",
};

function fallbackMessage(status: number): string {
  if (status === 401) return SESSION_EXPIRED_MESSAGE;
  if (status === 403) return "Kamu tidak punya akses ke bagian ini.";
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

/**
 * GET yang sama (alamat dan token sama) yang masih berjalan cukup dikirim
 * sekali; pemanggil berikutnya menunggu hasil yang sama (P1 audit). Ini bukan
 * cache: setelah selesai, request berikutnya dikirim ulang.
 */
const inFlight = new Map<string, Promise<unknown>>();

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  if (method !== "GET") return send<T>(endpoint, options);
  const key = `${getToken() ?? ""} ${endpoint}`;
  const running = inFlight.get(key);
  // Salinan untuk pemanggil kedua dst., supaya tidak saling mengubah data yang sama.
  if (running) return running.then((data) => structuredClone(data) as T);
  const promise = send<T>(endpoint, options).finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

async function send<T>(endpoint: string, { method = "GET", body }: RequestOptions): Promise<T> {
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
    // Sesi berakhir hanya kalau tadi ada token yang dikirim (login dengan
    // password salah juga 401, tetapi tanpa token).
    if (token && (response.status === 401 || EXPIRED_TOKEN_ERRORS.has(raw))) {
      clearToken();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      throw new ApiError(401, SESSION_EXPIRED_MESSAGE);
    }
    throw new ApiError(response.status, MESSAGE_ID[raw] ?? fallbackMessage(response.status));
  }

  return data as T;
}
