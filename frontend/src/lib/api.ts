/**
 * API Configuration and Helper
 * Handles all HTTP requests to backend with automatic JWT token attachment
 */

import { TOAST_MESSAGES } from './constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Standardized API response format
 */
export interface ApiResponse<T = any> {
  data?: T;
  appointments?: T;
  users?: T;
  availability?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
  error?: string;
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

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Parse response body
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error(TOAST_MESSAGES.ERROR_AUTH);
      }

      // Extract error message from backend response
      const errorMessage = 
        data?.error || 
        data?.message || 
        (data?.details && Array.isArray(data.details) 
          ? data.details.map((d: any) => d.message).join(', ')
          : null) ||
        `HTTP ${response.status}: ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(TOAST_MESSAGES.ERROR_GENERIC);
  }
}

/**
 * Health check - test backend connectivity
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
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
