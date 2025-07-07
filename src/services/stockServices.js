const API_URL = `${import.meta.env.VITE_API_URL}/stock`;

export const addStockServices = async ({product_id, cantidad}) => {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('El token es obligatorio para añadir la cantidad de un producto.');
    }

    try {
        const response = await fetch(`${API_URL}/addStock/${product_id}`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({cantidad})
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error en la creacion del stock - Services.")
        };
        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en la creacion del stock - Services.' )
    }

}