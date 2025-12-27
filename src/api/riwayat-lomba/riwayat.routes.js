import express from 'express';
import * as controller from './riwayat.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, controller.getRiwayatLombaByUser);
router.get('/daftar-peserta', authenticate, controller.getDaftarPesertaLomba);

export default router;
