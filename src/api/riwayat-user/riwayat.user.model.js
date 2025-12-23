import db from '../../config/db.config.js';

export async function getRiwayatByUser(id_user, limit, offset) {
  const dataQuery = `
    SELECT
      rl.id_riwayat as id,
      rl.id_user,
      l.nama_lomba,
      mp.tingkat_pendidikan as pendidikan,      -- ✅ diperbaiki
      mk.kategori_lomba as kategori,           -- ✅ diperbaiki
      l.tanggal_lomba,
      rl.status_pembayaran,
      rl.tanggal_daftar as created_at,
      l.harga,
      rl.jumlah_bayar
    FROM riwayat_lomba rl
    JOIN lomba l ON rl.id_lomba = l.id_lomba
    LEFT JOIN master_pendidikan mp ON l.id_pendidikan = mp.id_pendidikan
    LEFT JOIN master_kategori mk ON l.id_kategori = mk.id_kategori
    WHERE rl.id_user = $1
    ORDER BY rl.tanggal_daftar DESC
    LIMIT $2 OFFSET $3;
  `;

  const countQuery = `
    SELECT COUNT(*) FROM riwayat_lomba WHERE id_user = $1
  `;

  try {
    const [data, count] = await Promise.all([
      db.query(dataQuery, [id_user, limit, offset]),
      db.query(countQuery, [id_user]),
    ]);

    return {
      data: data.rows,
      total: Number(count.rows[0].count),
    };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}