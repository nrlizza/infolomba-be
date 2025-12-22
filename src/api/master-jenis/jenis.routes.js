import express from 'express';
import * as controller from './jenis.controller.js';

const router = express.Router();

router.get(
  '/all',
  controller.getAllJenis
);

export default router;
