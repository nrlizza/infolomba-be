import * as service from './kategori.service.js';
import { handleResult } from '../../utils/handleResponse.js';

export async function getAllKategori(req, res, next) {
    try {
        const result = await service.getAllKategori();
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};