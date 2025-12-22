import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function insertLomba(data) {
  const sql = `
    INSERT INTO lomba (
      id_kategori,
      id_pendidikan,
      id_jenis,
      id_provinsi,
      id_kabupaten,
      nama_lomba,
      tanggal_lomba,
      deskripsi,
      image,
      harga,
      id_user,
      tanggal_batas_pendaftaran
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11, $12)
    RETURNING id_lomba;
  `;

  const values = [
    data.id_kategori,
    data.id_pendidikan,
    data.id_jenis,
    data.id_provinsi,
    data.id_kabupaten,
    data.nama_lomba,
    data.tanggal_lomba,
    data.deskripsi,
    data.image,
    data.harga,
    data.id_user,
    data.tanggal_batas_pendaftaran
  ];

  const result = await db.query(sql, values);

  return formatResult(result, "create");
};

export async function getAllLomba(page = 1, limit = 9, filters = {}) {
  const offset = (page - 1) * limit

  // Build WHERE clause dynamically
  const whereClauses = []
  const queryParams = []
  let paramIndex = 1

  // Helper function to check if value is valid (not empty, null, or undefined)
  const isValidFilter = (value) => value !== null && value !== undefined && value !== '';

  if (isValidFilter(filters.id_kategori)) {
    whereClauses.push(`a.id_kategori = $${paramIndex++}`)
    queryParams.push(filters.id_kategori)
  }

  if (isValidFilter(filters.id_pendidikan)) {
    whereClauses.push(`a.id_pendidikan = $${paramIndex++}`)
    queryParams.push(filters.id_pendidikan)
  }

  if (isValidFilter(filters.id_provinsi)) {
    whereClauses.push(`a.id_provinsi = $${paramIndex++}`)
    queryParams.push(filters.id_provinsi)
  }

  if (isValidFilter(filters.id_jenis)) {
    whereClauses.push(`a.id_jenis = $${paramIndex++}`)
    queryParams.push(filters.id_jenis)
  }

  if (isValidFilter(filters.id_status_pembayaran)) {
    const statusPembayaran = Number(filters.id_status_pembayaran);
    if (statusPembayaran === 1) {
      // Gratis: harga = 0 atau NULL
      whereClauses.push(`(a.harga = 0 OR a.harga IS NULL)`)
    } else if (statusPembayaran === 2) {
      // Berbayar: harga > 0
      whereClauses.push(`a.harga > 0`)
    }
  }

  const whereClause = whereClauses.length > 0 
    ? `WHERE ${whereClauses.join(' AND ')}` 
    : ''

  // Query data dengan LIMIT & OFFSET
  const dataSql = `
    SELECT 
      a.id_lomba,
      b.kategori_lomba, 
      c.tingkat_pendidikan, 
      a.nama_lomba, 
      a.tanggal_lomba,
      a.tanggal_batas_pendaftaran,
      a.deskripsi, 
      a.image,
      a.harga
    FROM lomba a
    LEFT JOIN master_kategori b ON a.id_kategori = b.id_kategori
    LEFT JOIN master_pendidikan c ON a.id_pendidikan = c.id_pendidikan
    ${whereClause}
    ORDER BY a.id_lomba DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `

  // Query total untuk pagination meta
  const countSql = `
    SELECT COUNT(*) AS total 
    FROM lomba a
    ${whereClause}
  `

  const [dataResult, countResult] = await Promise.all([
    db.query(dataSql, [...queryParams, limit, offset]),
    db.query(countSql, queryParams)
  ])

  const totalData = Number(countResult.rows[0].total)
  const totalPages = Math.ceil(totalData / limit)

  // Bungkus pakai formatResult tapi meta di luar
  return {
    ...formatResult(dataResult, "getAll"),
    pagination: {
      totalData,
      totalPages,
      page,
      limit
    }
  }
}

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
};

export async function getLombaByIdUser(page = 1, limit = 10, id_user) {
  const offset = (page - 1) * limit

  const dataSql = `
    SELECT 
      a.id_lomba,
      b.kategori_lomba, 
      c.tingkat_pendidikan, 
      a.nama_lomba, 
      TO_CHAR(a.tanggal_lomba, 'YYYY-MM-DD') AS tanggal_lomba, 
      a.deskripsi, 
      a.image,
      a.harga,
      a.tanggal_batas_pendaftaran
    FROM lomba a
    LEFT JOIN master_kategori b ON a.id_kategori = b.id_kategori
    LEFT JOIN master_pendidikan c ON a.id_pendidikan = c.id_pendidikan
    WHERE a.id_user = $1
    ORDER BY a.id_lomba DESC
    LIMIT $2 OFFSET $3
  `

  const countSql = `
    SELECT COUNT(*) AS total
    FROM lomba
    WHERE id_user = $1
  `

  const [dataResult, countResult] = await Promise.all([
    db.query(dataSql, [id_user, limit, offset]),
    db.query(countSql, [id_user])
  ])

  const totalData = Number(countResult.rows[0].total)
  const totalPages = Math.ceil(totalData / limit)

  return {
    data: dataResult.rows,
    pagination: {
      totalData,
      totalPages,
      page,
      limit
    }
  }
}

export async function updateLomba(id_lomba, data) {
  const sql = `
    UPDATE lomba
    SET
      id_kategori = $1,
      id_pendidikan = $2,
      id_jenis = $3,
      id_provinsi = $4,
      id_kabupaten = $5,
      nama_lomba = $6,
      tanggal_lomba = $7,
      deskripsi = $8,
      image = $9,
      harga = $10,
      tanggal_batas_pendaftaran = $11
    WHERE id_lomba = $12
    RETURNING id_lomba;
  `;

  const values = [
    data.id_kategori,
    data.id_pendidikan,
    data.id_jenis,
    data.id_provinsi,
    data.id_kabupaten,
    data.nama_lomba,
    data.tanggal_lomba,
    data.deskripsi,
    data.image,
    data.harga,
    data.tanggal_batas_pendaftaran,
    id_lomba
  ];

  try {
    const result = await db.query(sql, values);
    
    if (result.rowCount === 0) {
      return {
        updated: false,
        message: 'Lomba tidak ditemukan atau gagal diupdate'
      };
    }

    return formatResult(result, "update");
  } catch (error) {
    console.error('❌ Model Error updateLomba:', error);
    return {
      updated: false,
      message: 'Gagal mengupdate lomba di database'
    };
  }
}

export async function checkLombaOwnership(id_lomba, id_user) {
  const sql = `
    SELECT id_lomba, id_user
    FROM lomba
    WHERE id_lomba = $1
  `;

  try {
    const result = await db.query(sql, [id_lomba]);

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Lomba tidak ditemukan'
      };
    }

    const lomba = result.rows[0];
    // Convert both to string untuk comparison yang aman
    const isOwner = String(lomba.id_user) === String(id_user);

    return {
      success: true,
      isOwner,
      data: lomba
    };
  } catch (error) {
    console.error('❌ Model Error checkLombaOwnership:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mengecek data lomba'
    };
  }
}

export async function deleteLomba(id_lomba) {
  const sql = `
    DELETE FROM lomba
    WHERE id_lomba = $1
    RETURNING id_lomba;
  `;

  try {
    const result = await db.query(sql, [id_lomba]);
    
    if (result.rowCount === 0) {
      return {
        deleted: false,
        message: 'Lomba tidak ditemukan atau sudah dihapus'
      };
    }
    
    return formatResult(result, "delete");
  } catch (error) {
    console.error('❌ Model Error deleteLomba:', error);
    return {
      deleted: false,
      message: 'Gagal menghapus lomba dari database'
    };
  }
}

