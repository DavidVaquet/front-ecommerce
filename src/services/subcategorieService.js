const API_URL = `${import.meta.env.VITE_API_URL}/subcategories`;

export const addSubcategoryService = async ({nombre, descripcion, activo, categoria_id}) => {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('El token es necesario para agregar una subcategoria.')
    };

    try {
        const response = await fetch(`${API_URL}/newSubcategory`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({nombre, descripcion, activo, categoria_id})
        });
    
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || 'Error al crear una subcategoria.')
        }
    
        const data = await response.json();
        return data;
        
    } catch (error) {
        throw new Error(error.message || 'Error al crear una subcategoria.')
    }

};

export const getSubcategories = async () => {
    
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('El token es necesario para obtener las subcategorias.')
    };

    try {
        const response = await fetch(`${API_URL}/getSubcategories`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Error al obtener todas las categorias.');
    }

    const data = await response.json();
    return data;

    } catch (error) {
        throw new Error(error.message || 'Error al obtener todas las categorias.');
        
    }
};


