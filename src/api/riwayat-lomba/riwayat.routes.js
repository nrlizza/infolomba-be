import express from 'express';
import * as controller from './riwayat.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * ===============================
 *  DAFTAR LOMBA
 * ===============================
 */
router.post(
  '/daftar',
  authenticate,
  controller.daftarLomba
);

/**
 * ===============================
 *  GET ALL RIWAYAT LOMBA
 *  Support:
 *  - /api/riwayat
 *  - /api/riwayat/all
 *  Query:
 *  ?page=&limit=&id_lomba=&id_user=&id_pembayaran=
 * ===============================
 */
router.get(
  '/',
  controller.getAllRiwayatLomba
);

router.get(
  '/all',
  controller.getAllRiwayatLomba
);

/**
 * ===============================
 *  GET PESERTA BERDASARKAN LOMBA
 *  /api/riwayat/lomba/:id_lomba/peserta
 * ===============================
 */
router.get(
  '/lomba/:id_lomba/peserta',
  controller.getPesertaByLomba
);

/**
 * ===============================
 *  GET RIWAYAT LOMBA BY USER (LOGIN)
 * ===============================
 */
router.get(
  '/user/me',
  authenticate,
  controller.getRiwayatLombaByUser
);

/**
 * ===============================
 *  GET RIWAYAT LOMBA BY ID
 * ===============================
 */
router.get(
  '/:id_riwayat',
  controller.getRiwayatLombaById
);

/**
 * ===============================
 *  UPDATE STATUS PEMBAYARAN
 * ===============================
 */
router.put(
  '/:id_riwayat/pembayaran',
  authenticate,
  controller.updateStatusPembayaran
);

/**
 * ===============================
 *  DELETE RIWAYAT LOMBA
 * ===============================
 */
router.delete(
  '/:id_riwayat',
  authenticate,
  controller.deleteRiwayatLomba
);

export default router;
