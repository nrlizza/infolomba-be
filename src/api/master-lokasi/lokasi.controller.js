import * as service from './lokasi.service.js';
import { handleResult } from '../../utils/handleResponse.js';

export async function getAllProvinsi(req, res, next) {
    try {
        const result = await service.getAllProvinsi();
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};

export async function getAllKabupatenByIdProvinsi(req, res, next) {
    try {
        const { id_provinsi } = req.query;
        const result = await service.getAllKabupatenByIdProvinsi(id_provinsi);
        handleResult(res, result);
    } catch (err) {
        next(err);
    }
};