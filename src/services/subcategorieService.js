import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/subcategories`;

export const addSubcategoryService = async ({nombre, descripcion, activo, categoria_id}) => {


    try {
        const data = await apiFetch(`${API_URL}/newSubcategory`, {
            method: 'POST',
            body: JSON.stringify({nombre, descripcion, activo, categoria_id})
        });
    
        return data;
        
    } catch (error) {
        throw new Error(error.message || 'Error al crear una subcategoria.')
    }

};

export const getSubcategories = async () => {
    

    try {
        const data = await apiFetch(`${API_URL}/getSubcategories`);

        return data;

    } catch (error) {
        throw new Error(error.message || 'Error al obtener todas las categorias.');
        
    }
};


