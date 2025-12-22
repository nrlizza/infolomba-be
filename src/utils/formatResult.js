/**
 * Standard result wrapper untuk semua tipe operasi
 * @param {object} queryResult - hasil dari pool.query
 * @param {string} type - 'get', 'getAll', 'create', 'update', 'delete'
 * @returns object compatible handleResult
 */
export function formatResult(queryResult, type = "get") {
  const { rows } = queryResult;

  switch (type) {
    case "get": // single item
      return {
        data: rows[0] || null,
      };

    case "getAll": // multiple items
      return {
        data: rows, // [] kosong → handleResult bakal 404
      };

    case "create":
      if (!rows[0]) return { created: false };
      return {
        created: true,
        data: rows[0],
      };

    case "update":
      return {
        updated: rows.length === 1,
        data: rows[0] || null, // kalau ga update → handleResult bakal 404
      };

    case "delete":
      return {
        deleted: rows.length === 1,
      };

    default:
      return { data: rows[0] || null };
  }
}
