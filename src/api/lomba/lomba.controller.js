import * as service from './lomba.service.js';
import { handleResult } from '../../utils/handleResponse.js';

export async function insertLomba(req, res, next) {
    try {
        const data = req.body;  
        const filesObj = req.files || { file: [req.file] };

        const result = await service.insertLomba(data, filesObj);   
        
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};

export async function getAllLomba(req, res, next) {
    try {
        const { 
            page = 1, 
            limit = 9,
            id_kategori,
            id_pendidikan,
            id_provinsi,
            id_jenis,
            id_status_pembayaran,
            status_lomba
        } = req.query;

        const filters = {
            id_kategori,
            id_pendidikan,
            id_provinsi,
            id_jenis,
            id_status_pembayaran
        };

        // If user is ADMIN, they can request any status or all.
        // Otherwise, force status_lomba to 'APPROVED' for public/peserta listing.
        const userRole = req.user?.role?.toUpperCase();
        if (userRole === 'ADMIN') {
            if (status_lomba) {
                filters.status_lomba = status_lomba;
            }
        } else {
            filters.status_lomba = 'APPROVED';
            filters.is_active = true; // Hanya tampilkan lomba yang belum melewati batas pendaftaran
        }

        const result = await service.getAllLomba(Number(page), Number(limit), filters);
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};

export async function getLombaById(req, res, next) {
    const { id_lomba } = req.query;
    try {
        const result = await service.getLombaById(id_lomba);
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};
    
export async function getLombaByIdUser(req, res, next) {
    const { page = 1, limit = 10, id_user } = req.query;
    try {
        const result = await service.getLombaByIdUser(Number(page), Number(limit), id_user);
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};

export async function updateLomba(req, res, next) {
    try {
        const { id_lomba } = req.params;
        const data = req.body;
        const filesObj = req.files || { file: [req.file] };
        const id_user = req.user?.id_user || req.user?.id;

        const result = await service.updateLomba(id_lomba, data, filesObj, id_user);
        handleResult(res, result);
    } catch (err) {
        console.error('✏️ UPDATE Error:', err);
        next(err);
    }
};

export async function deleteLomba(req, res, next) {
    const { id_lomba } = req.params;
    const id_user = req.user?.id_user || req.user?.id; // support both id_user and id
    const role = req.user?.role;
    try {
        const result = await service.deleteLomba(id_lomba, id_user, role);
        handleResult(res, result);
    } catch (err) {
        console.error('🗑️ DELETE Error:', err);
        next(err);
    }
};

export async function approveLomba(req, res, next) {
    try {
        const { id_lomba } = req.params;
        const { status_lomba, alasan_penolakan } = req.body;
        
        const result = await service.updateStatusLomba(id_lomba, status_lomba, alasan_penolakan);
        
        if (result.updated) {
            res.status(200).json({ success: true, message: 'Status lomba berhasil diupdate', data: result.data });
        } else {
            res.status(404).json({ success: false, message: result.message });
        }
    } catch (err) {
        next(err);
    }
};

export async function getLombaStats(req, res, next) {
    try {
        const stats = await service.getLombaStats();
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};
    