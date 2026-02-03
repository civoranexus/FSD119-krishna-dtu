/**
 * Authentication Utilities
 * Manages JWT tokens and user data in localStorage
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'patient' | 'doctor' | 'admin';
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Get user object from localStorage
 */
export function getUser(): User | null {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Save authentication data (token + user) to localStorage
 */
export function setAuth(token: string, user: User): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear authentication data and logout
 */
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Get user's role
 */
export function getUserRole(): string | null {
  const user = getUser();
  return user?.role || null;
}

/**
 * Check if user has specific role
 */
export function hasRole(role: 'patient' | 'doctor' | 'admin'): boolean {
  return getUserRole() === role;
}
