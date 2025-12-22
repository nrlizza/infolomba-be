import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function getAllProvinsi() {
  const sql = `
    SELECT * FROM master_provinsi
  `;

  const result = await db.query(sql);

  return formatResult(result, "getAll");
};

export async function getAllKabupatenByIdProvinsi(id_provinsi) {
  const sql = `
    SELECT * FROM master_kabupaten
    WHERE id_provinsi = $1
  `;

  const result = await db.query(sql, [id_provinsi]);

  return formatResult(result, "getAll");
};