import express from 'express';
import * as controller from './lokasi.controller.js';

const router = express.Router();

router.get(
  '/provinsi',
  controller.getAllProvinsi
);

router.get(
  '/kabupaten',
  controller.getAllKabupatenByIdProvinsi
);

export default router;
