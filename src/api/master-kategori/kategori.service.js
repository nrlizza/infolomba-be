import * as model from './kategori.model.js';

export async function getAllKategori() {
    const result = await model.getAllKategori();
    return result;
}