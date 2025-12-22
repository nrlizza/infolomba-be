import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function getAllJenis() {
  const sql = `
    SELECT * FROM master_jenis;
  `;

  const result = await db.query(sql);

  return formatResult(result, "getAll");
};
