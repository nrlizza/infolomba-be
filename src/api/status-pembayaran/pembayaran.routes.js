import express from 'express';
import * as controller from './pembayaran.controller.js';

const router = express.Router();

router.get(
  '/all',
  controller.getAllPembayaran
);

export default router;
