import express from 'express';
import * as controller from './lomba.controller.js';
import { upload } from '../../middleware/upload.middleware.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/add-new',
  authenticate,
  authorize({ roles: ['ADMIN', 'PANITIA'] }), 
  upload([
    { name: 'image', maxCount: 1 }
  ]),
  controller.insertLomba
);

router.get(
  '/all',
  controller.getAllLomba
);

router.get(
  '/',
  controller.getLombaById
);

router.get(
  '/user',
  authenticate,
  controller.getLombaByIdUser
);

router.put(
  '/update/:id_lomba',
  authenticate,
  authorize({ roles: ['ADMIN', 'PANITIA'] }), 
  upload([
    { name: 'image', maxCount: 1 }
  ]),
  controller.updateLomba
);

router.delete(
  '/delete/:id_lomba',
  authenticate,
  authorize({ roles: ['ADMIN', 'PANITIA'] }), 
  controller.deleteLomba
);

export default router;
