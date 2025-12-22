import * as service from './jenis.service.js';
import { handleResult } from '../../utils/handleResponse.js';

export async function getAllJenis(req, res, next) {
    try {
        const result = await service.getAllJenis();
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};
