import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export const insertRiwayatLomba = async ({ id_user, id_lomba, orderId, amount, status = "PENDING" }) => {
    const sql = `
      INSERT INTO riwayat_lomba
        (
          id_user, 
          id_lomba, 
          tanggal_daftar, 
          midtrans_transaction_id, 
          status_pembayaran, 
          jumlah_bayar
        )
      VALUES ($1, $2, NOW(), $3, $4, $5)
      RETURNING id_riwayat
    `;

    const result = await db.query(sql, [id_user, id_lomba, orderId, status, amount]);

    return { id_riwayat: result.rows[0].id_riwayat };
};

export const updateStatusByOrderId = async ({ orderId, status }) => {
    const sql = `
    UPDATE riwayat_lomba
    SET status_pembayaran = $1
    WHERE midtrans_transaction_id = $2
  `;
    await db.query(sql, [status, orderId]);
};

export async function getLombaById(id_lomba) {
    const sql = `
    SELECT 
      a.id_lomba,
      a.id_kategori,
      a.id_pendidikan,
      a.id_jenis,
      a.id_provinsi,
      a.id_kabupaten,
      b.kategori_lomba, 
      c.tingkat_pendidikan,
      d.jenis_lomba,
      e.nama_provinsi,
      f.nama_kabupaten,
      a.nama_lomba, 
      TO_CHAR(a.tanggal_lomba, 'YYYY-MM-DD') as tanggal_lomba,
      TO_CHAR(a.tanggal_batas_pendaftaran, 'YYYY-MM-DD') as tanggal_batas_pendaftaran,
      a.deskripsi, 
      a.image,
      a.harga,
      CASE 
        WHEN a.harga > 0 THEN 2
        ELSE 1
      END as id_status_pembayaran
    FROM lomba a
    LEFT JOIN master_kategori b ON a.id_kategori = b.id_kategori
    LEFT JOIN master_pendidikan c ON a.id_pendidikan = c.id_pendidikan
    LEFT JOIN master_jenis d ON a.id_jenis = d.id_jenis
    LEFT JOIN master_provinsi e ON a.id_provinsi = e.id_provinsi
    LEFT JOIN master_kabupaten f ON a.id_kabupaten = f.id_kabupaten
    WHERE a.id_lomba = $1
  `;

    const result = await db.query(sql, [id_lomba]);

    return formatResult(result, "get");
}

export async function getLombaByIdAndUser(id_lomba, id_user) {
  const sql = `
    SELECT * FROM riwayat_lomba
    WHERE id_lomba = $1 AND id_user = $2
  `
  
  const result = await db.query(sql, [id_lomba, id_user]);
  return formatResult(result, "get");
}