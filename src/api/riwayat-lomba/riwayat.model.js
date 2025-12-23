import db from "../../config/db.config.js";

export async function getRiwayatLombaByUser(id_user, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // PERBAIKAN QUERY: Tambahkan status_pembayaran dan jumlah_pembayaran
    const sql = `
      SELECT 
        a.id_lomba,
        b.nama_lomba,
        c.kategori_lomba,
        d.tingkat_pendidikan,
        TO_CHAR(a.tanggal_daftar, 'YYYY-MM-DD') as tanggal_daftar,
        a.status_pembayaran
      FROM riwayat_lomba a
      LEFT JOIN lomba b ON a.id_lomba = b.id_lomba
      LEFT JOIN master_kategori c ON b.id_kategori = c.id_kategori
      LEFT JOIN master_pendidikan d ON b.id_pendidikan = d.id_pendidikan
      WHERE a.id_user = $1
      ORDER BY a.tanggal_daftar DESC
      LIMIT $2 OFFSET $3
    `;


    const countSql = `
      SELECT COUNT(*) AS total
      FROM riwayat_lomba
      WHERE id_user = $1
    `;

    const [result, countResult] = await Promise.all([db.query(sql, [id_user, limit, offset]), db.query(countSql, [id_user])]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
        data: result.rows,
        message: "Data berhasil diambil",
        pagination: {
            currentPage: page,
            totalPages,
            totalData: total,
            limit,
        },
    };
}
