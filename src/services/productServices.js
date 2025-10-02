const API_URL = `${import.meta.env.VITE_API_URL}/products`;
import { apiFetch } from "../helpers/auth";
import { buildQueryString } from "../helpers/buildQueryString";

export const addProduct = async ({
    nombre, descripcion, precio, imagen_url, subcategoria_id, marca, estado, destacado, imagenUrls, descripcion_corta,
    cantidad, cantidad_minima, precio_costo, currency}) => {

    
    try {

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('subcategoria_id', subcategoria_id);
        formData.append('marca', marca);
        formData.append('estado', estado);
        formData.append('destacado', destacado);
        formData.append('descripcion_corta', descripcion_corta);
        formData.append('cantidad', cantidad);
        formData.append('cantidad_minima', cantidad_minima);
        formData.append('precio_costo', precio_costo);
        formData.append('currency', currency);

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

export const fetchProductos = async ({
  limit, 
  offset, 
  publicado, 
  estado, 
  stockBajo, 
  categoria_id, 
  subcategoria_id,
  search,
  include,
  orderBy,
  orderDir,
  stockCantidadMin
} = {}) => {

    try {
        const url = new URL(`${API_URL}/get-products-completes`);
        if (limit > 0) url.searchParams.set('limit', limit);
        if (offset != null) url.searchParams.set('offset', offset);
        if (publicado != null) url.searchParams.set('publicado', publicado);
        if (estado != null) url.searchParams.set('estado', estado);
        if (stockBajo != null) url.searchParams.set('stockBajo', stockBajo);
        if (categoria_id != null) url.searchParams.set('categoria_id', categoria_id);
        if (subcategoria_id != null) url.searchParams.set('subcategoria_id', subcategoria_id);
        if (search != null) url.searchParams.set('search', search);
        if (include != null) url.searchParams.set('include', include);
        if (orderBy != null) url.searchParams.set('orderBy', orderBy);
        if (orderDir != null) url.searchParams.set('orderDir', orderDir);
        if (stockCantidadMin != null) url.searchParams.set('stockCantidadMin', stockCantidadMin);

         const data = await apiFetch(`${url}`);

         return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const fetchProductStats = async ({ lowStockMin } = {}) => {
    try {
        const url = new URL(`${API_URL}/get-stats-products`);
        if (lowStockMin != null) url.searchParams.set('lowStockMin', lowStockMin);

        const res = await apiFetch(`${url}`);
        return res;
    } catch (error) {
        console.error(error);
        throw error;
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

export const getProductoPorId = async (id) => {
    try {
        const res = await apiFetch(`${API_URL}/get-product/${id}`);

        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
