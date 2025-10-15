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

export const getSubcategories = async ({ activo } = {}) => {
    

    try {
        const url = new URL(`${API_URL}/getSubcategories`);
        if (activo != null) url.searchParams.set('activo', activo);
        const data = await apiFetch(`${url}`);

        return data;

    } catch (error) {
        throw new Error(error.message || 'Error al obtener todas las categorias.');
        
    }
};


export const deleteSubcategoryServices = async (id) => {
    try {
        const res = await apiFetch(`${API_URL}/delete-subcategory/${id}`, {
            method: 'DELETE'
        });

        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}


export const updateSubcategoryServices = async ({ id, nombre, descripcion, visible, activo }) => {
    try {
        const res = await apiFetch(`${API_URL}/editSubcategory/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ nombre, descripcion, visible, activo })
        });

        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}