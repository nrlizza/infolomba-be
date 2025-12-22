import express from 'express';
import * as controller from './pendidikan.controller.js';

const router = express.Router();

router.get(
  '/all',
  controller.getAllPendidikan
);

export default router;
