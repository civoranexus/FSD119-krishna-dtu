import { register, login } from './auth.service.js';
import { generateToken } from '../../utils/jwt.js';

/**
 * Controller layer
 * Handles HTTP request/response only
 */

export const registerUser = async (req, res) => {
  try {
    const result = await register(req.body);

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    console.error('REGISTER CONTROLLER ERROR:', error.message);

    res.status(400).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await login(req.body);

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    res.status(200).json({
      message: 'User login successful',
      token,
      user,
    });
  } catch (error) {
    console.error('LOGIN CONTROLLER ERROR:', error.message);

    res.status(401).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};
