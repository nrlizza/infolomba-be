import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function getAllKategori() {
  const sql = `
    SELECT * FROM master_kategori;
  `;

  try {
    const result = await db.query(sql);
    return formatResult(result, "getAll");
  } catch (error) {
    console.error('❌ Error getAllKategori:', error.message);
    throw error;
  }
};