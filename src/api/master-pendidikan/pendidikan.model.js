import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function getAllPendidikan() {
  const sql = `
    SELECT * FROM master_pendidikan;
  `;

  const result = await db.query(sql);

  return formatResult(result, "getAll");
};