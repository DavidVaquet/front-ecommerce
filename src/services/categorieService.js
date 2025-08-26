import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/categories`;



export const getAllCategories = async () => {

    try {
        const data = await apiFetch(`${API_URL}/getCategories`);

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las categorias.');
    }

};

export const createCategoryService = async ({nombre, descripcion, activo}) => {

    try {
        const data = await fetch(`${API_URL}/createCategory`, {
            method: "POST",
            body: JSON.stringify({nombre, descripcion, activo})
        });

        return data;
        
    } catch (error) {
        throw new Error(error.message || 'Fallo al crear una categoria.' );
    }
};