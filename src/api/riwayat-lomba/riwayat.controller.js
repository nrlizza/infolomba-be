import * as service from "./riwayat.service.js";
import { handleResult } from "../../utils/handleResponse.js";

export async function getRiwayatLombaByUser(req, res, next) {
    try {
        const { id_user, page = 1, limit = 10 } = req.query;
      console.log("id_user:", id_user);
        if (!id_user) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized - User ID not found",
                data: null,
            });
        }

        const result = await service.getRiwayatLombaByUser(id_user, Number(page), Number(limit));
        handleResult(res, result);
    } catch (err) {
        console.error("❌ Error get riwayat lomba by user:", err);
        next(err);
    }
}
