import * as model from "./chat.model.js";

export async function getChatHistory(user_id_1, user_id_2) {
  return await model.getChatHistory(user_id_1, user_id_2);
}

export async function getChatContacts(admin_id) {
  // get all panitia the admin can chat with
  return await model.getAllPanitia();
}

export async function sendMessage(sender_id, receiver_id, message) {
  return await model.sendMessage(sender_id, receiver_id, message);
}
