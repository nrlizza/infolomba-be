import * as model from './jenis.model.js';

export async function getAllJenis() {
    const result = await model.getAllJenis();
    return result;
}
