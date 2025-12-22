import * as service from './riwayat.service.js';
import { handleResult } from '../../utils/handleResponse.js';

// Controller untuk daftar lomba
export async function daftarLomba(req, res, next) {
  try {
    const data = req.body;
    
    // Ambil id_user dari token jika ada (authenticated user)
    if (req.user) {
      data.id_user = req.user.id_user || req.user.id;
    }

    // Validasi input
    if (!data.id_lomba) {
      return res.status(400).json({
        status: 400,
        message: 'id_lomba is required',
        data: null
      });
    }

    const result = await service.daftarLomba(data);
    handleResult(res, result);
  } catch (err) {
    console.error('❌ Error daftar lomba:', err);
    next(err);
  }
}

// Controller untuk get all riwayat lomba
export async function getAllRiwayatLomba(req, res, next) {
  try {
    const { 
      page = 1, 
      limit = 10,
      id_user,
      id_lomba,
      id_pembayaran
    } = req.query;

    const filters = {
      id_user,
      id_lomba,
      id_pembayaran
    };

    const result = await service.getAllRiwayatLomba(Number(page), Number(limit), filters);
    handleResult(res, result);
  } catch (err) {
    console.error('❌ Error get all riwayat lomba:', err);
    next(err);
  }
}

// Controller BARU: Get peserta berdasarkan lomba
export async function getPesertaByLomba(req, res, next) {
  try {
    const { id_lomba } = req.params;
    const { page = 1, limit = 100 } = req.query;

    const result = await service.getPesertaByLomba(
      id_lomba,
      Number(page),
      Number(limit)
    );

    handleResult(res, result);
  } catch (err) {
    next(err);
  }
}

// Controller untuk get riwayat lomba by ID
export async function getRiwayatLombaById(req , res, next) {
  try {
    const { id_riwayat } = req.params;
    
    if (!id_riwayat) {
      return res.status(400).json({
        status: 400,
        message: 'ID riwayat diperlukan',
        data: null
      });
    }

    const result = await service.getRiwayatLombaById(id_riwayat);
    handleResult(res, result);
  } catch (err) {
    console.error('❌ Error get riwayat lomba by id:', err);
    next(err);
  }
}

// Controller untuk get riwayat lomba by user
export async function getRiwayatLombaByUser(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Ambil id_user dari token (authenticated user)
    const id_user = req.user?.id_user || req.user?.id;

    if (!id_user) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized - User ID not found',
        data: null
      });
    }

    const result = await service.getRiwayatLombaByUser(id_user, Number(page), Number(limit));
    handleResult(res, result);
  } catch (err) {
    console.error('❌ Error get riwayat lomba by user:', err);
    next(err);
  }
}

// Controller untuk update status pembayaran
export async function updateStatusPembayaran(req, res, next) {
  try {
    const { id_riwayat } = req.params;
    const { id_pembayaran } = req.body;

    if (!id_riwayat || !id_pembayaran) {
      return res.status(400).json({
        status: 400,
        message: 'id_riwayat dan id_pembayaran diperlukan',
        data: null
      });
    }

    const result = await service.updateStatusPembayaran(id_riwayat, id_pembayaran);
    handleResult(res, result);
  } catch (err) {
    console.error('❌ Error update status pembayaran:', err);
    next(err);
  }
}

// Controller untuk delete riwayat lomba
export async function deleteRiwayatLomba(req, res, next) {
  try {
    const { id_riwayat } = req.params;

    if (!id_riwayat) {
      return res.status(400).json({
        status: 400,
        message: 'ID riwayat diperlukan',
        data: null
      });
    }

    const result = await service.deleteRiwayatLomba(id_riwayat);
    handleResult(res, result);
  } catch (err) {
    console.error('❌ Error delete riwayat lomba:', err);
    next(err);
  }
}