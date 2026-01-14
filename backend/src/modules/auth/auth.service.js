import { getDb } from '../../utils/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const register = async ({ name, email, password }) => {
  const db = getDb();

  const [existing] = await db.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await db.execute(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
    [id, name, email, hashedPassword]
  );

  return { id, name, email };
};

export const login = async ({ email, password }) => {
  const db=getDb();
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const [rows] = await db.execute(
      'SELECT id, email, password, role FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('LOGIN SERVICE ERROR:', error.message);
    throw error;
  }
};
