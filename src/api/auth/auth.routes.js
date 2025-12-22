import express from 'express';
import * as controller from './auth.controller.js';
import {validate} from '../../middleware/validate.middleware.js';
import * as zod from './auth.validation.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', controller.login);
router.post('/refresh', controller.refreshToken);
router.post('/logout', controller.logout);
router.post('/generate-token', controller.generateTokenDirect);
router.post('/register', validate(zod.masterUserCreateSchema, 'body'), controller.registerUser);
router.get('/profile', authenticate, controller.getUserProfile);

export default router;
