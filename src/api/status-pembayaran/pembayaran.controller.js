import * as service from './pembayaran.service.js';
import { handleResult } from '../../utils/handleResponse.js';

export async function getAllPembayaran(req, res, next) {
    try {
        const result = await service.getAllPembayaran();
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};
