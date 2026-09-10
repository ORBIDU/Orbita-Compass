const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const getAuthToken = (): string | null => localStorage.getItem("orbita_token");
export const setAuthToken = (token: string): void => localStorage.setItem("orbita_token", token);
export const removeAuthToken = (): void => localStorage.removeItem("orbita_token");

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) removeAuthToken();
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    return data as T;
  } catch (error: any) {
    console.warn(`[API] ${endpoint}:`, error.message);
    throw error;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────
export const loginApi = (email: string, password: string) =>
  fetchApi<{ token: string; user: any }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const getMeApi = () => fetchApi<{ user: any }>("/auth/me");

// ── Profile ──────────────────────────────────────────────────────────
export const getProfileApi = () => fetchApi<any>("/profile");
export const updateProfileApi = (data: any) =>
  fetchApi("/profile", { method: "PUT", body: JSON.stringify(data) });
export const getRaporApi = () => fetchApi<any>("/rapor");
export const saveRaporApi = (records: any[]) =>
  fetchApi("/rapor", { method: "POST", body: JSON.stringify({ records }) });
export const saveAchievementApi = (achievement: any) =>
  fetchApi("/achievements", { method: "POST", body: JSON.stringify(achievement) });
export const deleteAchievementApi = (id: string) =>
  fetchApi(`/achievements/${id}`, { method: "DELETE" });
export const saveAssessmentApi = (assessment: any) =>
  fetchApi("/assessment", { method: "POST", body: JSON.stringify(assessment) });

// ── Compass AI ──────────────────────────────────────────────────────
export const triggerCompassAnalyzeApi = () =>
  fetchApi("/compass/analyze", { method: "POST" });
export const getCompassResultApi = () => fetchApi<any>("/compass/result");

// ── PTN & Jurusan ──────────────────────────────────────────────────
export const getUniversitiesApi = (city?: string, type?: string, page = 1, limit = 30) =>
  fetchApi<any>(`/ptn/universities?city=${city || ""}&type=${type || ""}&page=${page}&limit=${limit}`);
export const getMajorsApi = (category?: string, search?: string, page = 1, limit = 25) =>
  fetchApi<any>(`/ptn/majors?category=${category || ""}&search=${search || ""}&page=${page}&limit=${limit}`);
export const getRationalizationApi = () => fetchApi<any>("/ptn/rationalization");
export const getPracticeQuestionsApi = (category = "utbk") =>
  fetchApi<any>(`/ptn/practice/questions?category=${category}`);
export const submitPracticeApi = (type: string, userAnswers: any) =>
  fetchApi("/ptn/practice/submit", { method: "POST", body: JSON.stringify({ type, userAnswers }) });

// ── Action Plan ────────────────────────────────────────────────────
export const getActionPlansApi = () => fetchApi<any>("/action-plans");
export const createActionPlanApi = (item: any) =>
  fetchApi("/action-plans", { method: "POST", body: JSON.stringify(item) });
export const toggleActionPlanApi = (id: string, completed: boolean) =>
  fetchApi(`/action-plans/${id}/complete`, { method: "PATCH", body: JSON.stringify({ completed }) });
export const deleteActionPlanApi = (id: string) =>
  fetchApi(`/action-plans/${id}`, { method: "DELETE" });

// ── BK Konsultasi ──────────────────────────────────────────────────
export const getTeachersApi = () => fetchApi<any>("/bk/teachers");
export const createBookingApi = (booking: any) =>
  fetchApi("/bk/bookings", { method: "POST", body: JSON.stringify(booking) });
export const getBookingsApi = () => fetchApi<any>("/bk/bookings");
export const updateBookingStatusApi = (id: string, status: string) =>
  fetchApi(`/bk/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const deleteBookingApi = (id: string) =>
  fetchApi(`/bk/bookings/${id}`, { method: "DELETE" });

