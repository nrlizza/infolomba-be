import express from 'express';
import * as controller from './kategori.controller.js';

const router = express.Router();

router.get(
  '/all',
  controller.getAllKategori
);

export default router;
