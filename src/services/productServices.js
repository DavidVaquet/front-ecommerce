const API_URL = `${import.meta.env.VITE_API_URL}/products`;

export const addProduct = async ({nombre, descripcion, precio, imagen_url, subcategoria_id, marca, estado, visible, imagenUrls}) => {

    
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
        formData.append('visible', parseInt(visible));

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