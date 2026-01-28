/**
 * HILLIA Admin API Service
 * Quiet review interface - governance, not operations
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Store admin credentials in session
 */
export const setAdminCredentials = (username, password) => {
  sessionStorage.setItem('hillia_admin_auth', btoa(`${username}:${password}`));
};

/**
 * Get admin auth header
 */
export const getAuthHeader = () => {
  const auth = sessionStorage.getItem('hillia_admin_auth');
  if (!auth) return null;
  return `Basic ${auth}`;
};

/**
 * Clear admin session
 */
export const clearAdminSession = () => {
  sessionStorage.removeItem('hillia_admin_auth');
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = () => {
  return !!sessionStorage.getItem('hillia_admin_auth');
};

/**
 * Make authenticated admin request
 */
const adminFetch = async (endpoint, options = {}) => {
  const authHeader = getAuthHeader();
  if (!authHeader) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearAdminSession();
    throw new Error('Authentication failed');
  }

  if (response.status === 429) {
    throw new Error('Too many failed attempts. Try again later.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
};

/**
 * Verify admin credentials
 */
export const verifyAdminAuth = async (username, password) => {
  const auth = btoa(`${username}:${password}`);
  
  const response = await fetch(`${API}/admin/auth/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });

  if (response.status === 429) {
    throw new Error('Too many failed attempts. Try again later.');
  }

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  // Store credentials on successful auth
  setAdminCredentials(username, password);
  return response.json();
};

/**
 * Get admin statistics (counts + percentages)
 */
export const getAdminStats = async () => {
  return adminFetch('/admin/stats');
};

/**
 * Get questionnaire responses
 */
export const getQuestionnaireResponses = async (status = null, watched = null, limit = 50, skip = 0) => {
  let endpoint = `/admin/questionnaire?limit=${limit}&skip=${skip}`;
  if (status) {
    endpoint += `&status=${status}`;
  }
  if (watched !== null) {
    endpoint += `&watched=${watched}`;
  }
  return adminFetch(endpoint);
};

/**
 * Get single questionnaire response
 */
export const getQuestionnaireResponse = async (responseId) => {
  return adminFetch(`/admin/questionnaire/${responseId}`);
};

/**
 * Update questionnaire response (notes, status, watched)
 */
export const updateQuestionnaireResponse = async (responseId, updates) => {
  const params = new URLSearchParams();
  if (updates.status) params.append('status', updates.status);
  if (updates.internal_notes !== undefined) params.append('internal_notes', updates.internal_notes);
  if (updates.watched !== undefined) params.append('watched', updates.watched);
  
  return adminFetch(`/admin/questionnaire/${responseId}?${params}`, {
    method: 'PATCH',
  });
};

/**
 * Get contact submissions
 */
export const getContactSubmissions = async (status = null, watched = null, limit = 50, skip = 0) => {
  let endpoint = `/admin/contact?limit=${limit}&skip=${skip}`;
  if (status) {
    endpoint += `&status=${status}`;
  }
  if (watched !== null) {
    endpoint += `&watched=${watched}`;
  }
  return adminFetch(endpoint);
};

/**
 * Get single contact submission
 */
export const getContactSubmission = async (submissionId) => {
  return adminFetch(`/admin/contact/${submissionId}`);
};

/**
 * Update contact submission (notes, status, watched)
 */
export const updateContactSubmission = async (submissionId, updates) => {
  const params = new URLSearchParams();
  if (updates.status) params.append('status', updates.status);
  if (updates.internal_notes !== undefined) params.append('internal_notes', updates.internal_notes);
  if (updates.watched !== undefined) params.append('watched', updates.watched);
  
  return adminFetch(`/admin/contact/${submissionId}?${params}`, {
    method: 'PATCH',
  });
};
