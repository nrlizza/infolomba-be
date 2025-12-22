import * as model from './pendidikan.model.js';

export async function getAllPendidikan() {
    const result = await model.getAllPendidikan();
    return result;
}