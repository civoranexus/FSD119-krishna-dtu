/**
 * Service layer
 * Contains business logic (placeholder for now)
 */

export const register = async (userData) => {
  // TODO:
  // - Validate input
  // - Hash password
  // - Store user in database

  return {
    note: 'Registration service placeholder',
    receivedData: userData
  };
};

export const login = async (credentials) => {
  // TODO:
  // - Validate credentials
  // - Compare password
  // - Generate JWT

  return {
    note: 'Login service placeholder',
    receivedData: credentials
  };
};
