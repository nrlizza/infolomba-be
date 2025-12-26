import jwt from 'jsonwebtoken';
import * as service from './auth.service.js';
import { loginValidation } from './auth.validation.js';

const REFRESH_SECRET = process.env.REFRESH_SECRET;
const SECRET_KEY = process.env.SECRET_KEY;

export async function login(req, res, next) {
  const { username, password, role } = loginValidation.parse(req.body);
  
  try {
    const token = await service.loginUser(username, password, role);
    const decoded = jwt.decode(token);

    const refreshToken = jwt.sign(
      {
        id: decoded.id,
        name: decoded.name,
        username: decoded.username,
        email: decoded.email,
        poin: decoded.poin,
        role: decoded.role
      },
      REFRESH_SECRET,
      { expiresIn: '8h' } 
    );

    // Simpan refresh token sebagai httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.cookie('token', token, {
      httpOnly: false, 
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        name: decoded.name,
        username: decoded.username,
        email: decoded.email,
        poin: decoded.poin,
        role: decoded.role
      },
      SECRET_KEY,
      { expiresIn: '1h' } // atau sesuaikan
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Refresh token tidak valid atau expired' });
  }
}

export function generateTokenDirect(req, res) {
  const payload = req.body.payload || {
    name: 'Muhammad Fachrur Riza',
    username: 'rizaganteng',
    role: 'bd',
  };

  const token = service.generateTokenDirect(payload);
  res.json({ token });
}

export function logout(req, res) {
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'Logout successful' });
}

export async function registerUser(req, res, next) {
  try {
    const payload = req.validated;
    const result = await service.registerUser(payload);
    res.status(201).json({ message: 'User registered successfully', userId: result.id });
  } catch (err) {
    next(err);
  }
}

export async function getUserProfile(req, res, next) {
  try {
    const id_user = req.user?.id_user || req.user?.id;

    if (!id_user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID not found',
        data: null
      });
    }

    const result = await service.getUserProfile(id_user);
    
    if (!result.ok) {
      return res.status(404).json({
        success: false,
        message: result.message,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (err) {
    next(err);
  }
}