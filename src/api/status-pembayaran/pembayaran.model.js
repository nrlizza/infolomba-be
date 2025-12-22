import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function getAllPembayaran() {
  const sql = `
    SELECT * FROM status_pembayaran;
  `;

  const result = await db.query(sql);

  return formatResult(result, "getAll");
};
