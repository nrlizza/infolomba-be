import * as model from './riwayat.model.js';

// ================================
// DAFTAR LOMBA
// ================================
export async function daftarLomba(data) {
  try {
    // CEK DUPLIKASI (user sudah daftar lomba ini atau belum)
    const isExist = await model.checkUserAlreadyRegistered(
      data.id_user,
      data.id_lomba
    );

    if (isExist) {
      return {
        success: false,
        status: 409,
        message: 'Anda sudah terdaftar di lomba ini',
        data: null
      };
    }

    const result = await model.insertRiwayatLomba(data);

    return {
      success: true,
      status: 201,
      message: 'Berhasil mendaftar lomba',
      data: result.data
    };
  } catch (error) {
    console.error('❌ Error daftar lomba:', error);
    throw error;
  }
}

// ================================
// GET ALL RIWAYAT (ADMIN / PANITIA)
// ================================
export async function getAllRiwayatLomba(page, limit, filters) {
  try {
    if (page < 1 || limit < 1 || limit > 100) {
      return {
        success: false,
        status: 400,
        message: 'Parameter pagination tidak valid',
        data: [],
        pagination: null
      };
    }

    const result = await model.getAllRiwayatLomba(page, limit, filters);

    return {
      success: true,
      status: 200,
      message: 'Data riwayat lomba berhasil diambil',
      data: result.data,
      pagination: result.pagination
    };
  } catch (error) {
    console.error('❌ Error get all riwayat lomba:', error);
    throw error;
  }
}

// ================================
// GET PESERTA PER LOMBA (PANITIA)
// ================================
export async function getPesertaByLomba(id_lomba, page, limit) {
  const result = await model.getPesertaByLomba(id_lomba, page, limit);

  return {
    ok: true,
    status: 200,
    message: 'Data peserta berhasil diambil',
    data: result.data.map(item => ({
      ...item,
      status_pembayaran: item.status_pembayaran ?? 'PENDING',
      jumlah_bayar: item.jumlah_bayar ?? 0
    })),
    pagination: result.pagination
  };
}


// ================================
// GET RIWAYAT BY ID
// ================================
export async function getRiwayatLombaById(id_riwayat) {
  try {
    if (!id_riwayat) {
      return {
        success: false,
        status: 400,
        message: 'ID riwayat diperlukan',
        data: null
      };
    }

    const result = await model.getRiwayatLombaById(id_riwayat);

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Riwayat lomba tidak ditemukan',
        data: null
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Data riwayat lomba berhasil diambil',
      data: result.data[0]
    };
  } catch (error) {
    console.error('❌ Error get riwayat lomba by id:', error);
    throw error;
  }
}

// ================================
// GET RIWAYAT BY USER (USER LOGIN)
// ================================
export async function getRiwayatLombaByUser(id_user, page, limit) {
  try {
    if (!id_user) {
      return {
        success: false,
        status: 400,
        message: 'ID user diperlukan',
        data: [],
        pagination: null
      };
    }

    if (page < 1 || limit < 1 || limit > 50) {
      return {
        success: false,
        status: 400,
        message: 'Parameter pagination tidak valid',
        data: [],
        pagination: null
      };
    }

    const result = await model.getRiwayatLombaByUser(id_user, page, limit);

    return {
      success: true,
      status: 200,
      message: 'Data riwayat user berhasil diambil',
      data: result.data,
      pagination: result.pagination
    };
  } catch (error) {
    console.error('❌ Error get riwayat lomba by user:', error);
    throw error;
  }
}

// ================================
// UPDATE STATUS PEMBAYARAN
// ================================
export async function updateStatusPembayaran(
  id_riwayat,
  status_pembayaran,
  jumlah_bayar,
  midtrans_order_id
) {
  try {
    if (!id_riwayat || !status_pembayaran) {
      return {
        success: false,
        status: 400,
        message: 'Data pembayaran tidak lengkap',
        data: null
      };
    }

    const result = await model.updatePembayaran(
      id_riwayat,
      status_pembayaran,
      jumlah_bayar,
      midtrans_order_id
    );

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Riwayat lomba tidak ditemukan',
        data: null
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Status pembayaran berhasil diperbarui',
      data: result.data[0]
    };
  } catch (error) {
    console.error('❌ Error update pembayaran:', error);
    throw error;
  }
}

// ================================
// DELETE RIWAYAT LOMBA
// ================================
export async function deleteRiwayatLomba(id_riwayat) {
  try {
    if (!id_riwayat) {
      return {
        success: false,
        status: 400,
        message: 'ID riwayat diperlukan',
        data: null
      };
    }

    const result = await model.deleteRiwayatLomba(id_riwayat);

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Riwayat lomba tidak ditemukan',
        data: null
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Riwayat lomba berhasil dihapus',
      data: result.data[0]
    };
  } catch (error) {
    console.error('❌ Error delete riwayat lomba:', error);
    throw error;
  }
}
