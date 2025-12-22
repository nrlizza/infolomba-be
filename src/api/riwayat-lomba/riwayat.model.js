import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

// Insert riwayat pendaftaran lomba (daftar lomba)
export async function insertRiwayatLomba(data) {
  const sql = `
    INSERT INTO riwayat_lomba (
      id_user,
      id_lomba,
      id_pembayaran,
      tanggal_daftar
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id_riwayat;
  `;

  const values = [
    data.id_user,
    data.id_lomba,
    data.id_pembayaran,
    data.tanggal_daftar || new Date()
  ];

  const result = await db.query(sql, values);
  return formatResult(result, "create");
}

// Get all riwayat lomba dengan informasi lengkap (JOIN)
export async function getAllRiwayatLomba(page = 1, limit = 100, filters = {}) {
  const offset = (page - 1) * limit;

  let whereClause = [];
  let values = [];
  let idx = 1;

  if (filters.id_lomba) {
    whereClause.push(`rl.id_lomba = $${idx++}`);
    values.push(filters.id_lomba);
  }

  const whereSQL = whereClause.length
    ? `WHERE ${whereClause.join(' AND ')}`
    : '';

  const sql = `
    SELECT
      rl.id_riwayat,
      mu.name AS nama_lengkap,
      mu.nomor_telephone AS nomor_telepon,
      l.nama_lomba,
      rl.tanggal_daftar,
      rl.status_pembayaran,
      rl.jumlah_bayar
    FROM riwayat_lomba rl
    JOIN master_user mu ON rl.id_user = mu.id_user
    JOIN lomba l ON rl.id_lomba = l.id_lomba
    ${whereSQL}
    ORDER BY rl.tanggal_daftar DESC
    LIMIT $${idx++} OFFSET $${idx}
  `;

  values.push(limit, offset);

  const countSql = `
    SELECT COUNT(*) AS total
    FROM riwayat_lomba rl
    ${whereSQL}
  `;

  const [dataResult, countResult] = await Promise.all([
    db.query(sql, values),
    db.query(countSql, values.slice(0, values.length - 2))
  ]);

  return {
    data: dataResult.rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(countResult.rows[0].total / limit),
      totalData: parseInt(countResult.rows[0].total),
      limit
    }
  };
}


// Get riwayat lomba by ID riwayat
export async function getRiwayatLombaById(id_riwayat) {
  // PERBAIKAN QUERY: Tambahkan status_pembayaran dan jumlah_pembayaran
  const sql = `
    SELECT 
      rl.id_riwayat,
      rl.id_user,
      rl.id_lomba,
      rl.id_pembayaran,
      rl.tanggal_daftar,
      mu.name AS nama_lengkap,
      mu.nomor_telephone AS no_telp,
      l.nama_lomba,
      mp.jenis_pembayaran AS metode_pembayaran,
      COALESCE(mp.status, 'BELUM_BAYAR') AS status_pembayaran,  -- PERBAIKAN: Tambahkan status
      COALESCE(mp.jumlah, 0) AS jumlah_pembayaran              -- PERBAIKAN: Tambahkan jumlah
    FROM riwayat_lomba rl
    LEFT JOIN master_user mu ON rl.id_user = mu.id_user
    LEFT JOIN lomba l ON rl.id_lomba = l.id_lomba
    LEFT JOIN master_pembayaran mp ON rl.id_pembayaran = mp.id_pembayaran
    WHERE rl.id_riwayat = $1
  `;

  const result = await db.query(sql, [id_riwayat]);
  return formatResult(result, "read");
}

// Get riwayat lomba by user ID
export async function getRiwayatLombaByUser(id_user, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  // PERBAIKAN QUERY: Tambahkan status_pembayaran dan jumlah_pembayaran
  const sql = `
    SELECT 
      rl.id_riwayat,
      rl.id_user,
      rl.id_lomba,
      rl.id_pembayaran,
      rl.tanggal_daftar,
      l.nama_lomba,
      mp.jenis_pembayaran AS metode_pembayaran,
      COALESCE(mp.status, 'BELUM_BAYAR') AS status_pembayaran,  -- PERBAIKAN: Tambahkan status
      COALESCE(mp.jumlah, 0) AS jumlah_pembayaran              -- PERBAIKAN: Tambahkan jumlah
    FROM riwayat_lomba rl
    LEFT JOIN lomba l ON rl.id_lomba = l.id_lomba
    LEFT JOIN master_pembayaran mp ON rl.id_pembayaran = mp.id_pembayaran
    WHERE rl.id_user = $1
    ORDER BY rl.tanggal_daftar DESC
    LIMIT $2 OFFSET $3
  `;

  const countSql = `
    SELECT COUNT(*) as total
    FROM riwayat_lomba
    WHERE id_user = $1
  `;

  const [result, countResult] = await Promise.all([
    db.query(sql, [id_user, limit, offset]),
    db.query(countSql, [id_user])
  ]);

  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / limit);

  return {
    data: result.rows,
    message: 'Data berhasil diambil',
    pagination: {
      currentPage: page,
      totalPages,
      totalData: total,
      limit
    }
  };
}

// Fungsi khusus untuk mendapatkan peserta berdasarkan lomba
export async function getPesertaByLomba(id_lomba, page = 1, limit = 100) {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT 
      rl.id_riwayat,
      mu.name AS nama_lengkap,
      mu.nomor_telephone AS nomor_telepon,
      l.nama_lomba,
      rl.tanggal_daftar,
      rl.status_pembayaran,
      rl.jumlah_bayar
    FROM riwayat_lomba rl
    JOIN master_user mu ON rl.id_user = mu.id_user
    JOIN lomba l ON rl.id_lomba = l.id_lomba
    WHERE rl.id_lomba = $1
    ORDER BY rl.tanggal_daftar DESC
    LIMIT $2 OFFSET $3
  `;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM riwayat_lomba
    WHERE id_lomba = $1
  `;

  const [data, count] = await Promise.all([
    db.query(sql, [id_lomba, limit, offset]),
    db.query(countSql, [id_lomba])
  ]);

  return {
    data: data.rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count.rows[0].total / limit),
      totalData: parseInt(count.rows[0].total),
      limit
    }
  };
}

// Update status pembayaran
export async function updateStatusPembayaran(id_riwayat, id_pembayaran) {
  const sql = `
    UPDATE riwayat_lomba
    SET id_pembayaran = $1
    WHERE id_riwayat = $2
    RETURNING *;
  `;

  const result = await db.query(sql, [id_pembayaran, id_riwayat]);
  return formatResult(result, "update");
}

// Delete riwayat lomba
export async function deleteRiwayatLomba(id_riwayat) {
  const sql = `
    DELETE FROM riwayat_lomba
    WHERE id_riwayat = $1
    RETURNING *;
  `;

  const result = await db.query(sql, [id_riwayat]);
  return formatResult(result, "delete");
}