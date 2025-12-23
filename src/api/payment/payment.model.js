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

export const getRiwayatByOrderId = async (orderId) => {
    const sql = `
    SELECT id_user FROM riwayat_lomba
    WHERE midtrans_transaction_id = $1
  `;
    const result = await db.query(sql, [orderId]);
    return formatResult(result, "get");
};

export async function getHtmLombaById(id_lomba) {
    const sql = `
    SELECT 
      a.harga
    FROM lomba a
    WHERE a.id_lomba = $1
  `;

    const result = await db.query(sql, [id_lomba]);

    return formatResult(result, "get");
};

export async function getLombaByIdAndUser(id_lomba, id_user) {
  const sql = `
    SELECT * FROM riwayat_lomba
    WHERE id_lomba = $1 AND id_user = $2
  `
  
  const result = await db.query(sql, [id_lomba, id_user]);
  return formatResult(result, "get");
};

export async function getPoinUser(id_user) {
  const sql = `
    SELECT 
      poin
    FROM master_user
    WHERE id_user = $1
  `;

  const result = await db.query(sql, [id_user]);
  return formatResult(result, "get");
}

export async function updatePoinUser(id_user, poin) {
  const sql = `
    UPDATE master_user
    SET poin = $1
    WHERE id_user = $2
  `;

  const result = await db.query(sql, [poin, id_user]);
  return formatResult(result, "update");
}