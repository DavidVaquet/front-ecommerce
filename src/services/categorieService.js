import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/categories`;



export const getAllCategories = async ({ activo } = {}) => {

    try {
        const url = new URL(`${API_URL}/getCategories`);
        if (activo != null && activo != undefined) url.searchParams.set('activo', activo);
        const data = await apiFetch(`${url}`);

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las categorias.');
    }

};

export const createCategoryService = async ({nombre, descripcion, activo}) => {

    try {
        const data = await apiFetch(`${API_URL}/createCategory`, {
            method: "POST",
            body: JSON.stringify({nombre, descripcion, activo})
        });

        return data;
        
    } catch (error) {
        throw new Error(error.message || 'Fallo al crear una categoria.' );
    }
};