const API_URL = `${import.meta.env.VITE_API_URL}/categories`;


export const getAllCategories = async () => {

    // const token = localStorage.getItem('token');

    // if (!token) {
    //     throw new Error('El token es obligatorio.');
    // }

    try {
        const response = await fetch(`${API_URL}/getCategories`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || 'Error al obtener las categorias.');
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las categorias.');
    }

};

export const createCategoryService = async ({nombre, descripcion, activo}) => {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('El token es necesario para crear una categoria.');
    };

    try {
        const response = await fetch(`${API_URL}/createCategory`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`,},
            body: JSON.stringify({nombre, descripcion, activo})
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || 'Error al crear una categoria.');
        };

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Fallo al crear una categoria.' );
    }
};