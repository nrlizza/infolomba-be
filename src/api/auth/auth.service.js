import jwt from 'jsonwebtoken';
import * as model from './auth.model.js';

const SECRET_KEY = process.env.SECRET_KEY;

export async function loginUser(username, password, role) {
  const user = await model.loginUser(username, password, role);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const payload = {
    id: user.id_user,
    name: user.name,
    username: user.username,
    email: user.email,
    poin: user.poin,
    role: user.role,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });;
}


export function generateTokenDirect(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export async function registerUser(data) {
  const newUser = await model.createUser(data);
  return newUser;
}

export async function getUserProfile(id_user) {
  const user = await model.getUserProfile(id_user);
  
  if (!user) {
    return {
      ok: false,
      message: 'User not found',
      data: null
    };
  }

  // Remove password dari response
  const { password, ...userWithoutPassword } = user;

  return {
    ok: true,
    message: 'User profile retrieved successfully',
    data: userWithoutPassword
  };
}
