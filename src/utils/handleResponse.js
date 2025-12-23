import { response } from "./response.js";

/**
 * Ultra-generic result handler
 * Service conventions:
 * { ok, data, created, updated, deleted, message, pagination/meta }
 *
 * Response final:
 * {
 *   success: true/false,
 *   message: string,
 *   data: [...]/object,
 *   pagination: {...} // optional
 * }
 */
export function handleResult(res, result) {
  if (!result || typeof result !== "object") {
    return response.serverError(res, "Invalid service result");
  }

  // CREATE
  if (result.created !== undefined) {
    return result.created
      ? response.created(res, result.data || null, result.message || "Data created")
      : response.badRequest(res, result.message || "Failed to create data");
  }

  // UPDATE
  if (result.updated !== undefined) {
    return result.updated
      ? response.success(res, result.data || null, result.message || "Data updated")
      : response.notFound(res, result.message || "Data not found / no change");
  }

  // DELETE
  if (result.deleted !== undefined) {
    return result.deleted
      ? response.success(res, null, result.message || "Data berhasil dihapus")
      : response.notFound(res, result.message || "Data not found");
  }

  // GET / FETCH
  if (result.data !== undefined) {
    const isArray = Array.isArray(result.data);
    const empty = isArray ? result.data.length === 0 : result.data === null;

    if (empty) return response.success(res, result.message || []);

    // Payload clean: data di root, pagination/meta di root juga
    const data = result.data;
    const pagination = result.pagination || result.meta || null;

    return response.success(res, data, result.message || "Success", pagination);
  }

  // OK fallback
  if (result.ok !== undefined) {
    return result.ok
      ? response.success(res, result.data || null, result.message || "Success")
      : response.notFound(res, result.message || "Data not found");
  }

  // fallback generic success
  return response.success(res, result.data || null, result.message || "Success");
}
