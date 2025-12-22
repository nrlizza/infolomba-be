import * as service from "./payment.service.js";
import { handleResult } from "../../utils/handleResponse.js";

export const createPayment = async (req, res) => {
  try {
    const { id_user, id_lomba, name, email } = req.body;

    if (!id_user || !id_lomba) {
      return res.status(400).json({ message: "id_user & id_lomba wajib" });
    }

    const data = await service.createPaymentService({
      id_user,
      id_lomba,
      name,
      email,
    });

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const paymentNotification = async (req, res) => {
  try {
    await service.handleMidtransNotification(req.body);
    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Webhook error" });
  }
};

export async function getLombaByIdAndUser(req, res) {
  try {
    const { id_lomba, id_user } = req.query;
    const result = await service.getLombaByIdAndUser(id_lomba, id_user);
    handleResult(res, result);
  } catch (err) {
    console.error("❌ Error get lomba by id and user:", err);
    next(err);
  }
}
