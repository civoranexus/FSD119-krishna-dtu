import { User } from '../../models/User.js';
import bcrypt from 'bcrypt';

export const register = async ({ name, email, password, role = 'patient' }) => {
  console.log('🔵 REGISTER SERVICE: Starting registration', { name, email, role });

  // Validate inputs
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  // Check if user already exists
  console.log('🔵 REGISTER SERVICE: Checking if user exists...');
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('⚠️ REGISTER SERVICE: User already exists');
    throw new Error('User already exists');
  }

  console.log('🔵 REGISTER SERVICE: Hashing password...');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user - MongoDB will auto-generate _id
  console.log('🔵 REGISTER SERVICE: Creating user in database...');
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  console.log('✅ REGISTER SERVICE: User created successfully', { id: user._id, email: user.email });
  return { id: user._id, name: user.name, email: user.email };
};

export const login = async ({ email, password }) => {
  try {
    console.log('🔵 LOGIN SERVICE: Starting login attempt for', email);
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log('⚠️ LOGIN SERVICE: User not found');
      throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('⚠️ LOGIN SERVICE: Password mismatch');
      throw new Error('Invalid credentials');
    }

    console.log('✅ LOGIN SERVICE: Login successful for', email);
    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('❌ LOGIN SERVICE ERROR:', error.message);
    throw error;
  }
};
