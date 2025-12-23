// src/routes/payment.routes.js
import express from "express";
import { createPayment, reedemPoin, paymentNotification, getLombaByIdAndUser } from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticate, createPayment);
router.post("/redeem", authenticate, reedemPoin);
router.post("/notification", paymentNotification);
router.get("/history", authenticate, getLombaByIdAndUser);


export default router;
