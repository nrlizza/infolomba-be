import * as model from './lokasi.model.js';

export async function getAllProvinsi() {
    const result = await model.getAllProvinsi();
    return result;
}

export async function getAllKabupatenByIdProvinsi(id_provinsi) {
    const idProvinsi = Number(id_provinsi);
    const result = await model.getAllKabupatenByIdProvinsi(idProvinsi);
    return result;
}