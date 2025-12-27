import * as service from "./riwayat.service.js";
import { handleResult } from "../../utils/handleResponse.js";

export async function getRiwayatLombaByUser(req, res, next) {
    try {
        const { id_user, page = 1, limit = 10 } = req.query;
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

export async function getDaftarPesertaLomba(req, res, next) {
    try {
        const { id_lomba } = req.query;
        if (!id_lomba) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized - User ID not found",
                data: null,
            });
        }

        const result = await service.getDaftarPesertaLomba(id_lomba);
        handleResult(res, result);
    } catch (err) {
        console.error("❌ Error get daftar peserta lomba:", err);
        next(err);
    }
}