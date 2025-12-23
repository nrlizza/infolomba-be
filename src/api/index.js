import express from 'express';
import authRoutes from './auth/auth.routes.js';
import lombaRoutes from './lomba/lomba.routes.js';
import kategoriRoutes from './master-kategori/kategori.routes.js';
import pendidikanRoutes from './master-pendidikan/pendidikan.routes.js';
import lokasiRoutes from './master-lokasi/lokasi.routes.js';
import jenisRoutes from './master-jenis/jenis.routes.js';
import pembayaranRoutes from './status-pembayaran/pembayaran.routes.js';
import riwayatRoutes from './riwayat-lomba/riwayat.routes.js';
import paymentRoutes from './payment/payment.routes.js';

const router = express.Router();

// router.use(middleware.authenticate);
router.use('/auth', authRoutes);
router.use('/lomba', lombaRoutes);
router.use('/kategori', kategoriRoutes);
router.use('/pendidikan', pendidikanRoutes);
router.use('/lokasi', lokasiRoutes);
router.use('/jenis', jenisRoutes);
router.use('/pembayaran', pembayaranRoutes);
router.use('/riwayat-lomba', riwayatRoutes);  
router.use('/payment', paymentRoutes);

export default router;
