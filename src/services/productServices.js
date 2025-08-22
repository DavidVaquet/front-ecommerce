const API_URL = `${import.meta.env.VITE_API_URL}/products`;
import { buildQueryString } from "../helpers/buildQueryString";

export const addProduct = async ({nombre, descripcion, precio, imagen_url, subcategoria_id, marca, estado, destacado, imagenUrls, descripcion_corta, cantidad, cantidad_minima}) => {

    
    try {
        const token = localStorage.getItem('token');
    
        if (!token) {
            throw new Error('El token es obligatorio.')
        };

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

        const response = await fetch(`${API_URL}/newProduct`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        });

        const data = await response.json();
        // console.log("Respuesta completa del backend:", data);
        if (!response.ok) {
        throw new Error(data.msg || 'Error al subir un producto.'); }

        return data;

    } catch (error) {
        throw new Error(error.message || 'Error al subir un producto.')
    }
};


export const getProducts = async (filtros = {}) => {

    try {
         const token = localStorage.getItem('token');
    
         if (!token) {
            throw new Error('El token es obligatorio.')
         };

         const query = buildQueryString(filtros);
         const url = query ? `${API_URL}/getProducts?${query}` : `${API_URL}/getProducts`;

         const response = await fetch(url, {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Authorization': `Bearer ${token}`}
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.msg)
         };

         return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const obtenerProductosCompletos = async () => {

    try {
         const token = localStorage.getItem('token');
    
         if (!token) {
            throw new Error('El token es obligatorio.')
         };

         const response = await fetch(`${API_URL}/get-products-completes`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.msg)
         };

         return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const editProduct = async ({nombre, descripcion, precio, subcategoria_id, marca, id, cantidad_stock}) => {
    try {
        const token = localStorage.getItem('token');
    
         if (!token) {
            throw new Error('El token es obligatorio.')
         };

         const response = await fetch(`${API_URL}/editProduct/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify({nombre, descripcion, precio, subcategoria_id, marca, cantidad_stock})
         })

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.msg || 'Error al editar el producto.');
         }

         return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el producto.')
    }
}
export const deleteProductLogic = async (id) => {
    try {
        const token = localStorage.getItem('token');
    
         if (!token) {
            throw new Error('El token es obligatorio.')
         };

         const response = await fetch(`${API_URL}/deleteProduct/${id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.msg || 'Error al editar el producto.');
         }

         return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el producto.')
    }
}
export const activarProductLogic = async (id) => {
    try {
        const token = localStorage.getItem('token');
    
         if (!token) {
            throw new Error('El token es obligatorio.')
         };

         const response = await fetch(`${API_URL}/activarProduct/${id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.msg || 'Error al editar el producto.');
         }

         return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el producto.')
    }
}

export const productosCantidadMinima = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Se necesita el token.');

        const response = await fetch(`${API_URL}/get-products-cantidadMinima`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
        });
        
        const data = await response.json();
        if (!response.ok){
            throw new Error(data.msg || 'Error al obtener los productos');
        }
        return data;

    } catch (error) {
        console.error(error);
    }
}
export const publicarProductosServices = async (ids, publicado) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Se necesita el token.');

        const response = await fetch(`${API_URL}/publicar-productos`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify({ids, publicado})
        });
        
        const data = await response.json();
        if (!response.ok){
            throw new Error(data.msg || 'Error al publicar los productos');
        }
        return data;

    } catch (error) {
        console.error(error);
    }
}