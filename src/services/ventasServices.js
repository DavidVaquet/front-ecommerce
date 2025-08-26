import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/ventas`;

export const registrarVentaService = async ({canal, medio_pago, total, productos, cliente_id, descuento, subtotal, impuestos}) => {

    try {
    
        const data = await apiFetch(`${API_URL}/registrar-venta`, {
            method: 'POST',
            body: JSON.stringify({canal, medio_pago, total, productos, cliente_id, descuento, subtotal, impuestos})
        });


        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al registrar la venta.');
    }
};

export const obtenerVentasConDetallesService = async () => {

    try {
    
        const data = await apiFetch(`${API_URL}/obtener-ventas-completo`);

        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las ventas.');
    }
};