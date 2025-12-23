import express from 'express';
import { getRiwayatUser } from './riwayat.user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Sementara nonaktifkan auth untuk testing
// router.get('/user', authenticate, getRiwayatUser);
router.get('/user', getRiwayatUser); // 🔥 TEST TANPA AUTH

export default router;