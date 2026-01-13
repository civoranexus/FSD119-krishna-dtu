import {
  register,
  login
} from './auth.service.js';

/**
 * Controller layer
 * Handles HTTP request/response only
 */

export const registerUser = async (req, res) => {
  try {
    // Placeholder: extract request data
    const userData = req.body;

    const result = await register(userData);

    res.status(201).json({
      message: 'User registration endpoint (placeholder)',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Placeholder: extract credentials
    const credentials = req.body;

    const result = await login(credentials);

    res.status(200).json({
      message: 'User login endpoint (placeholder)',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      message: 'Login failed',
      error: error.message
    });
  }
};
