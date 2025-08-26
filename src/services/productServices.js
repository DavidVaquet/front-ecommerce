const API_URL = `${import.meta.env.VITE_API_URL}/products`;
import { apiFetch } from "../helpers/auth";
import { buildQueryString } from "../helpers/buildQueryString";

export const addProduct = async ({
    nombre, descripcion, precio, imagen_url, subcategoria_id, marca, estado, destacado, imagenUrls, descripcion_corta,
    cantidad, cantidad_minima, precio_costo}) => {

    
    try {

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', parseFloat(precio));
        formData.append('subcategoria_id', parseInt(subcategoria_id));
        formData.append('marca', marca);
        formData.append('estado', parseInt(estado));
        formData.append('destacado', parseInt(destacado));
        formData.append('descripcion_corta', descripcion_corta);
        formData.append('cantidad', cantidad);
        formData.append('cantidad_minima', cantidad_minima);
        formData.append('precio_costo', parseFloat(precio_costo));

        if (imagen_url){
            formData.append('image', imagen_url.file);
        }

        if (imagenUrls && Array.isArray(imagenUrls)) {
            imagenUrls.forEach((img) => {
                if (img.file) {
                    formData.append('images', img.file);
                }
            })
        }

        const data = await apiFetch(`${API_URL}/newProduct`, {
            method: 'POST',
            body: formData
        });

        return data;

    } catch (error) {
        throw new Error(error.message || 'Error al subir un producto.')
    }
};


export const getProducts = async (filtros = {}) => {

    try {
         const query = buildQueryString(filtros);
         const url = query ? `${API_URL}/getProducts?${query}` : `${API_URL}/getProducts`;

         const data = await apiFetch(url);

         return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const obtenerProductosCompletos = async () => {

    try {

         const data = await apiFetch(`${API_URL}/get-products-completes`);

         return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const editProduct = async ({nombre, descripcion, precio, subcategoria_id, marca, precio_costo, descripcion_corta, id}) => {
    try {

         const data = await apiFetch(`${API_URL}/editProduct/${id}`, {
            method: 'PUT',
            body: JSON.stringify({nombre, descripcion, precio, subcategoria_id, marca, precio_costo, descripcion_corta})
         })

         return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el producto.')
    }
}
export const deleteProductLogic = async (id) => {
    try {

         const data = await apiFetch(`${API_URL}/deleteProduct/${id}`, {
                method: 'PATCH'
        });

         return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el producto.')
    }
}
export const activarProductLogic = async (id) => {
    try {
         const data = await apiFetch(`${API_URL}/activarProduct/${id}`, {
                method: 'PATCH'
        });

         return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el producto.')
    }
}

export const productosCantidadMinima = async () => {
    try {

        const data = await apiFetch(`${API_URL}/get-products-cantidadMinima`);
        
        return data;

    } catch (error) {
        console.error(error);
    }
}
export const publicarProductosServices = async (ids, publicado) => {
    try {

        const data = await apiFetch(`${API_URL}/publicar-productos`, {
            method: 'PUT',
            body: JSON.stringify({ids, publicado})
        });
        
        return data;

    } catch (error) {
        console.error(error);
    }
}

export const eliminarProductoServices = async (id) => {
    try {

        const data = await apiFetch(`${API_URL}/eliminar-producto/${id}`,{
            method: 'DELETE',
            body: JSON.stringify({id})
        });

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al eliminar el producto');
    }
} 


export async function getProductoPorBarcode(code) {
    try {

        const data = await apiFetch(`${API_URL}/get-products-barcode/${encodeURIComponent(code)}`);
        
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
