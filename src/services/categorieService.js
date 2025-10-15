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

export const getCategoriasSubCategorias = async ({ limit, offset, search, visible, estado, visibleSub, estadoSub } = {}) => {

    try {
        const url = new URL(`${API_URL}/get-categories-subcategories`);
        if (limit > 0) url.searchParams.set('limit', limit);
        if (offset != null) url.searchParams.set('offset', offset);
        if (search != null) url.searchParams.set('search', search);
        if (visible != null) url.searchParams.set('visible', visible);
        if (visibleSub != null) url.searchParams.set('visibleSub', visibleSub);
        if (estado != null) url.searchParams.set('estado', estado);
        if (estadoSub != null) url.searchParams.set('estadoSub', estadoSub);

        const res = await apiFetch(`${url}`);

        return res;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}


export const getStatsCategorias = async () => {
    try {
        const res = await apiFetch(`${API_URL}/get-stats-categories-subcategories`);
        return res;
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteCategoryServices = async (id) => {
    try {
        const res = await apiFetch(`${API_URL}/delete-category/${id}`, {
            method: 'DELETE'
        });

        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}


export const updateCategoryServices = async ({ id, nombre, descripcion, visible, activo }) => {
    try {
        const res = await apiFetch(`${API_URL}/editCategory/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ nombre, descripcion, visible, activo })
        });

        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const toggleCategoryState = async ({ id, activo }) => {
    try {
        const res = await apiFetch(`${API_URL}/toggleCategoryState/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ activo })
        });

        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}