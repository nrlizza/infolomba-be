import * as service from "./favorite.service.js";
import { handleResult } from "../../utils/handleResponse.js";

export async function toggleFavorite(req, res, next) {
  try {
    const id_user = req.user?.id_user || req.user?.id;
    const { id_lomba } = req.body;

    if (!id_user || !id_lomba) {
      return res.status(400).json({ success: false, message: "id_lomba required" });
    }

    const result = await service.toggleFavorite(id_user, id_lomba);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getFavoriteLomba(req, res, next) {
  try {
    const id_user = req.user?.id_user || req.user?.id;
    const result = await service.getFavoriteLomba(id_user);
    handleResult(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getFavoriteIds(req, res, next) {
  try {
    const id_user = req.user?.id_user || req.user?.id;
    const result = await service.getFavoriteIds(id_user);
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
}
