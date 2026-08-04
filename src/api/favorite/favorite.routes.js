import express from "express";
import { toggleFavorite, getFavoriteLomba, getFavoriteIds } from "./favorite.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/toggle", authenticate, toggleFavorite);
router.get("/", authenticate, getFavoriteLomba);
router.get("/ids", authenticate, getFavoriteIds);

export default router;
