const API_URL = `${import.meta.env.VITE_API_URL}/ventas`;

export const registrarVentaService = async ({canal, medio_pago, total, productos, cliente_id, descuento, subtotal, impuestos}) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vuelve a iniciar sesión.');
    
        const response = await fetch(`${API_URL}/registrar-venta`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({canal, medio_pago, total, productos, cliente_id, descuento, subtotal, impuestos})
        });

        const data = await response.json();

        if (!response.ok){
            throw new Error(data.msg || 'Error al registrar la venta.');
        }

        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al registrar la venta.');
    }
};

export const obtenerVentasConDetallesService = async () => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vuelve a iniciar sesión.');
    
        const response = await fetch(`${API_URL}/obtener-ventas-completo`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`} 
        })

        const data = await response.json();

        if (!response.ok){
            throw new Error(data.msg || 'Error al obtener las ventas.');
        }

        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las ventas.');
    }
};