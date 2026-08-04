import db from "../../config/db.config.js";
import { formatResult } from "../../utils/formatResult.js";

export async function getChatHistory(user_id_1, user_id_2) {
  const sql = `
    SELECT * FROM chat_messages 
    WHERE (sender_id = $1 AND receiver_id = $2) 
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
  `;
  const result = await db.query(sql, [user_id_1, user_id_2]);
  return formatResult(result, "getAll");
}

export async function getChatContacts(admin_id) {
  // Returns all Panitia (role 2 or 3? Let's check roles). Actually, just users who have sent or received a message with admin_id
  const sql = `
    SELECT DISTINCT u.id_user, u.name, u.nama_instansi 
    FROM master_user u
    JOIN chat_messages m ON u.id_user = m.sender_id OR u.id_user = m.receiver_id
    WHERE (m.sender_id = $1 OR m.receiver_id = $1) AND u.id_user != $1
  `;
  const result = await db.query(sql, [admin_id]);
  return formatResult(result, "getAll");
}

export async function getAllPanitia() {
    // Alternatively, admin can start a chat with any Panitia
    const sql = `
      SELECT id_user, name, nama_instansi 
      FROM master_user 
      WHERE id_role = 2 -- Asumsi role 2 adalah PANITIA
    `;
    const result = await db.query(sql);
    return formatResult(result, "getAll");
}

export async function sendMessage(sender_id, receiver_id, message) {
    const sql = `
      INSERT INTO chat_messages (sender_id, receiver_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(sql, [sender_id, receiver_id, message]);
    return formatResult(result, "insert");
}
