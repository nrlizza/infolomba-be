import * as service from "./chat.service.js";
import { handleResult } from "../../utils/handleResponse.js";

export async function getChatHistory(req, res, next) {
  try {
    const user_id_1 = req.user?.id_user || req.user?.id;
    const { user_id_2 } = req.params;
    
    if (!user_id_1 || !user_id_2) {
      return res.status(400).json({ success: false, message: "user_id_2 required" });
    }

    const result = await service.getChatHistory(user_id_1, user_id_2);
    handleResult(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getChatContacts(req, res, next) {
  try {
    const admin_id = req.user?.id_user || req.user?.id;
    const result = await service.getChatContacts(admin_id);
    handleResult(res, result);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const sender_id = req.user?.id_user || req.user?.id;
    const { receiver_id, message } = req.body;
    
    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({ success: false, message: "receiver_id and message required" });
    }

    const result = await service.sendMessage(sender_id, receiver_id, message);
    handleResult(res, result);
  } catch (err) {
    next(err);
  }
}
