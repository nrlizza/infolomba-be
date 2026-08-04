import express from "express";
import { getChatHistory, getChatContacts, sendMessage } from "./chat.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history/:user_id_2", authenticate, getChatHistory);
router.get("/contacts", authenticate, getChatContacts);
router.post("/send", authenticate, sendMessage);

export default router;
