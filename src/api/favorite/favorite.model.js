import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function toggleFavorite(id_user, id_lomba) {
  // Check if exists
  const checkSql = "SELECT * FROM favorite_lomba WHERE id_user = $1 AND id_lomba = $2";
  const checkResult = await db.query(checkSql, [id_user, id_lomba]);

  if (checkResult.rows.length > 0) {
    // Exists, remove it
    const deleteSql = "DELETE FROM favorite_lomba WHERE id_user = $1 AND id_lomba = $2";
    await db.query(deleteSql, [id_user, id_lomba]);
    return { is_favorited: false };
  } else {
    // Does not exist, add it
    const insertSql = "INSERT INTO favorite_lomba (id_user, id_lomba) VALUES ($1, $2)";
    await db.query(insertSql, [id_user, id_lomba]);
    return { is_favorited: true };
  }
}

export async function getFavoriteLomba(id_user) {
  const sql = `
    SELECT 
      l.id_lomba,
      b.kategori_lomba, 
      c.tingkat_pendidikan, 
      l.nama_lomba, 
      l.tanggal_lomba,
      l.tanggal_batas_pendaftaran,
      l.deskripsi, 
      l.image,
      l.harga,
      l.status_lomba,
      l.format_lomba,
      l.link_panduan,
      u.nama_instansi AS institusi_penyelenggara,
      u.nomor_telephone AS kontak_penyelenggara,
      l.created_at
    FROM lomba l
    JOIN favorite_lomba f ON l.id_lomba = f.id_lomba
    LEFT JOIN master_user u ON l.id_user = u.id_user
    LEFT JOIN master_kategori b ON l.id_kategori = b.id_kategori
    LEFT JOIN master_pendidikan c ON l.id_pendidikan = c.id_pendidikan
    WHERE f.id_user = $1
    ORDER BY f.created_at DESC
  `;
  const result = await db.query(sql, [id_user]);
  return formatResult(result, "getAll");
}

export async function getFavoriteIds(id_user) {
  const sql = "SELECT id_lomba FROM favorite_lomba WHERE id_user = $1";
  const result = await db.query(sql, [id_user]);
  return { data: result.rows.map(row => row.id_lomba) };
}
