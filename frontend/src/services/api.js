const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const getAuthToken = () => localStorage.getItem('orbita_token');
export const setAuthToken = (token) => localStorage.setItem('orbita_token', token);
export const removeAuthToken = () => localStorage.removeItem('orbita_token');

export async function fetchApi(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
      }
      throw new Error(data.error || `HTTP Error ${response.status}: Perintah gagal diproses`);
    }

    return data;
  } catch (error) {
    console.warn(`[API Network Note] ${endpoint}:`, error.message);
    throw error;
  }
}

// Auth API
export const loginApi = (email, password) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const registerApi = (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
export const getMeApi = () => fetchApi('/auth/me');

// Profile, Rapor, Achievements, & Assessment API
export const getProfileApi = () => fetchApi('/profile');
export const updateProfileApi = (data) => fetchApi('/profile', { method: 'PUT', body: JSON.stringify(data) });
export const getRaporApi = () => fetchApi('/rapor');
export const saveRaporApi = (records) => fetchApi('/rapor', { method: 'POST', body: JSON.stringify({ records }) });
export const importExcelRaporApi = (schoolData) => fetchApi('/rapor/import-excel', { method: 'POST', body: JSON.stringify({ schoolData }) });
export const uploadPdfRaporApi = (pdfBase64, semester) => fetchApi('/rapor/upload-pdf', { method: 'POST', body: JSON.stringify({ pdfBase64, semester }) });

export const saveAchievementApi = (achievement) => fetchApi('/achievements', { method: 'POST', body: JSON.stringify(achievement) });
export const deleteAchievementApi = (id) => fetchApi(`/achievements/${id}`, { method: 'DELETE' });
export const saveAssessmentApi = (assessment) => fetchApi('/assessment', { method: 'POST', body: JSON.stringify(assessment) });

// Compass AI API
export const triggerCompassAnalyzeApi = () => fetchApi('/compass/analyze', { method: 'POST' });
export const getCompassResultApi = () => fetchApi('/compass/result');

// PTN & Practice API with Lazy Load / Pagination Support
export const getUniversitiesApi = (city, type, page = 1, limit = 30) => 
  fetchApi(`/ptn/universities?city=${city || ''}&type=${type || ''}&page=${page}&limit=${limit}`);

export const getMajorsApi = (category, search, page = 1, limit = 25) => 
  fetchApi(`/ptn/majors?category=${category || ''}&search=${search || ''}&page=${page}&limit=${limit}`);

export const getRationalizationApi = () => fetchApi('/ptn/rationalization');
export const getPracticeQuestionsApi = (category = 'utbk') => fetchApi(`/ptn/practice/questions?category=${category}`);
export const submitPracticeApi = (type, userAnswers) => fetchApi('/ptn/practice/submit', { method: 'POST', body: JSON.stringify({ type, userAnswers }) });

// Action Plan Calendar API
export const getActionPlansApi = () => fetchApi('/action-plans');
export const createActionPlanApi = (item) => fetchApi('/action-plans', { method: 'POST', body: JSON.stringify(item) });
export const toggleActionPlanApi = (id, completed) => fetchApi(`/action-plans/${id}/complete`, { method: 'PATCH', body: JSON.stringify({ completed }) });
export const deleteActionPlanApi = (id) => fetchApi(`/action-plans/${id}`, { method: 'DELETE' });

// BK Counseling API
export const getTeachersApi = () => fetchApi('/bk/teachers');
export const createBookingApi = (booking) => fetchApi('/bk/bookings', { method: 'POST', body: JSON.stringify(booking) });
export const getBookingsApi = () => fetchApi('/bk/bookings');
export const updateBookingStatusApi = (id, status) => fetchApi(`/bk/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteBookingApi = (id) => fetchApi(`/bk/bookings/${id}`, { method: 'DELETE' });
