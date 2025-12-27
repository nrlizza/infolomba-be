import * as model from './riwayat.model.js';

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

export async function getDaftarPesertaLomba(id_lomba, page, limit) {
    try {
        if (!id_lomba) {
            return {
                success: false,
                status: 400,
                message: "ID lomba diperlukan",
                data: [],
            };
        }

        const result = await model.getDaftarPesertaLomba(id_lomba);

        return {
            success: true,
            status: 200,
            message: "Daftar peserta lomba berhasil diambil",
            data: result.data,
            pagination: result.pagination
        };
    } catch (error) {
        console.error("❌ Error get daftar peserta lomba:", error);
        throw error;
    }
}