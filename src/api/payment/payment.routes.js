// src/routes/payment.routes.js
import express from "express";
import { createPayment, paymentNotification, getLombaByIdAndUser } from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticate, createPayment);
router.post("/notification", paymentNotification);
router.get("/history", authenticate, getLombaByIdAndUser);


export default router;
