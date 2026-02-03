/**
 * API Configuration and Helper
 * Handles all HTTP requests to backend with automatic JWT token attachment
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Main API request handler
 * Automatically attaches JWT token from localStorage if present
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Attach JWT token if present and auth is required
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log outgoing request
  console.log(`📤 API REQUEST: ${fetchOptions.method || 'GET'} ${url}`, {
    body: fetchOptions.body ? JSON.parse(fetchOptions.body as string) : undefined,
    hasAuth: requiresAuth && !!localStorage.getItem('token'),
  });

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Parse response body
    const data = await response.json().catch(() => null);

    // Log response
    console.log(`📥 API RESPONSE: ${response.status}`, {
      endpoint,
      data,
    });

    if (!response.ok) {
      // Extract error message from backend response
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error(`❌ API ERROR: ${endpoint}`, errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ API EXCEPTION: ${endpoint}`, error.message);
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Health check - test backend connectivity
 */
export async function healthCheck(): Promise<boolean> {
  try {
    console.log('🏥 HEALTH CHECK: Testing backend connectivity...');
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
    });
    const isHealthy = response.ok;
    console.log(`${isHealthy ? '✅' : '❌'} HEALTH CHECK: Backend is ${isHealthy ? 'online' : 'offline'}`);
    return isHealthy;
  } catch (error) {
    console.error('❌ HEALTH CHECK FAILED:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
