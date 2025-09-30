import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/ventas`;

export const registrarVentaService = async ({canal, medio_pago, productos, cliente_id, descuento, impuestos, currency}) => {

    try {
    
        const data = await apiFetch(`${API_URL}/registrar-venta`, {
            method: 'POST',
            body: JSON.stringify({canal, medio_pago, productos, cliente_id, descuento, impuestos, currency})
        });


        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al registrar la venta.');
    }
};

export const obtenerVentasConDetallesService = async ({ search, fecha_desde, fecha_fin, limit, offset, origen } = {}) => {

    try {
    
        const url = new URL(`${API_URL}/obtener-ventas-completo`);
        if (limit > 0) url.searchParams.set('limit', limit);
        if (offset != null) url.searchParams.set('offset', offset);
        if (search != null) url.searchParams.set('search', search);
        if (fecha_desde != null) url.searchParams.set('fecha_desde', fecha_desde);
        if (fecha_fin != null) url.searchParams.set('fecha_fin', fecha_fin);
        if (origen != null) url.searchParams.set('origen', origen);

        const res = await apiFetch(`${url}`);

        return res;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las ventas.');
    }
};
export const obtenerVentasTotales = async () => {

    try {
    
        const data = await apiFetch(`${API_URL}/obtener-totales-ventas`);

        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las ventas.');
    }
};