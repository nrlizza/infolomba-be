import * as model from './pembayaran.model.js';

export async function getAllPembayaran() {
    const result = await model.getAllPembayaran();
    return result;
}
