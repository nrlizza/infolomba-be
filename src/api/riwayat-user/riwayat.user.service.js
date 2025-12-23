// riwayat.user.service.js
import * as model from './riwayat.user.model.js';

export async function getRiwayatUser(id_user, page, limit) {
  const offset = (page - 1) * limit;

  const { data, total } = await model.getRiwayatByUser(
    id_user,
    limit,
    offset
  );
  
  const formattedData = data.map(item => ({
    id: item.id,
    nama_lomba: item.nama_lomba,
    pendidikan: item.pendidikan || 'Tidak ditentukan',
    kategori: item.kategori || 'Tidak ditentukan',
    tanggal_lomba: item.tanggal_lomba,
    status_pembayaran: item.status_pembayaran
  }));

  return {
    data: formattedData,
    pagination: {
      page,
      limit,
      totalData: total,
      totalPages: Math.ceil(total / limit),
    },
  };
}