import * as service from './pendidikan.service.js';
import { handleResult } from '../../utils/handleResponse.js';

export async function getAllPendidikan(req, res, next) {
    try {
        const result = await service.getAllPendidikan();
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};