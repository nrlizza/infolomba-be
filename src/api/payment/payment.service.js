import * as model from "./payment.model.js";
import crypto from "crypto";
import { snap } from "../../config/midtrans.js";

export const createPaymentService = async ({ id_user, id_lomba, name, email }) => {
    try {
        // 1️⃣ ambil data lomba dan cek pendaftaran sebelumnya
        const [lomba, userPoin, existingRiwayat] = await Promise.all([
            model.getHtmLombaById(id_lomba), 
            model.getPoinUser(id_user),
            model.getLombaByIdAndUser(id_lomba, id_user)
        ]);

        if (!lomba?.data) throw new Error("Lomba tidak ditemukan");
        
        const isRegistered = existingRiwayat?.data && 
                            (Array.isArray(existingRiwayat.data) ? existingRiwayat.data.length > 0 : true);

        if (isRegistered) {
            throw new Error("Anda sudah mendaftarkan diri di lomba ini!");
        }

        const amount = lomba.data.harga ?? 0;

        // 2️⃣ orderId unik
        const orderId = `LOMBA-${id_lomba}-${id_user}-${Date.now()}`;

        /**
         * =============================
         * 🔥 CASE LOMBA GRATIS
         * =============================
         */
        if (amount === 0) {
            const riwayat = await model.insertRiwayatLomba({
                id_user,
                id_lomba,
                orderId,
                amount,
                status: "PAID", // langsung PAID
            });

            await model.updatePoinUser(id_user, userPoin?.data?.poin + 20);

            return {
                free: true,
                message: "Pendaftaran lomba gratis berhasil",
                id_riwayat: riwayat.id_riwayat,
            };
        }

        /**
         * =============================
         * 💰 CASE LOMBA BERBAYAR
         * =============================
         */

        // 3️⃣ simpan riwayat (PENDING)
        const riwayat = await model.insertRiwayatLomba({
            id_user,
            id_lomba,
            orderId,
            amount,
            status: "PENDING",
        });

        // 4️⃣ create transaksi midtrans
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: {
                first_name: name,
                email,
            },
        };

        const transaction = await snap.createTransaction(parameter);

        return {
            free: false,
            snapToken: transaction.token,
            id_riwayat: riwayat.id_riwayat,
            orderId,
        };
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
};

export const handleMidtransNotification = async (notification) => {
    const { order_id, transaction_status, fraud_status, signature_key, gross_amount, status_code } = notification;

    // 1️⃣ validasi signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const payload = order_id + status_code + gross_amount + serverKey;

    const expectedSignature = crypto.createHash("sha512").update(payload).digest("hex");

    if (signature_key !== expectedSignature) {
        throw new Error("Invalid signature");
    }

    // 2️⃣ mapping status midtrans → internal
    let statusPembayaran = "PENDING";

    if (transaction_status === "capture" && fraud_status === "accept") {
        statusPembayaran = "PAID";
    } else if (transaction_status === "settlement") {
        statusPembayaran = "PAID";
    } else if (["deny", "expire", "cancel"].includes(transaction_status)) {
        statusPembayaran = "FAILED";
    }

    // 3️⃣ update DB (via model)
    await model.updateStatusByOrderId({
        orderId: order_id,
        status: statusPembayaran,
    });

    const result = await model.getRiwayatByOrderId(order_id);
    const idUser = result?.data?.id_user ? result?.data?.id_user : 2;
    
    const poin = await model.getPoinUser(result?.data?.id_user);
    const userPoin = poin?.data?.poin ? poin?.data?.poin : 0;
    
    if (statusPembayaran === "PAID" && userPoin < 100) {
        // Beri poin jika pembayaran berhasil
        await model.updatePoinUser(idUser, userPoin + 20);
    }
};

export async function getLombaByIdAndUser(id_lomba, id_user) {
    const result = await model.getLombaByIdAndUser(id_lomba, id_user);
    return result;
}

export const reedemPoin = async ({ id_user, id_lomba }) => {
    try {

        // 1️⃣ ambil data lomba dan cek pendaftaran sebelumnya
        const [lomba, userPoin, existingRiwayat] = await Promise.all([
            model.getHtmLombaById(id_lomba), 
            model.getPoinUser(id_user),
            model.getLombaByIdAndUser(id_lomba, id_user)
        ]);

        if (!lomba?.data) throw new Error("Lomba tidak ditemukan");

        const isRegistered = existingRiwayat?.data && 
                            (Array.isArray(existingRiwayat.data) ? existingRiwayat.data.length > 0 : true);

        if (isRegistered) {
            throw new Error("Anda sudah mendaftarkan diri di lomba ini!");
        }

        const amount = lomba.data.harga ?? 0;

        const orderId = `LOMBA-${id_lomba}-${id_user}-${Date.now()}`;

        const riwayat = await model.insertRiwayatLomba({
            id_user,
            id_lomba,
            orderId,
            amount,
            status: "PAID", // langsung PAID
        });

        await model.updatePoinUser(id_user, userPoin?.data?.poin - 100);

        return {
            free: true,
            message: "Pendaftaran lomba gratis berhasil",
            id_riwayat: riwayat.id_riwayat,
        };
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
};
