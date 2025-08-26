import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/stock`;

export const registrarMovStockServices = async ({
            product_id,
            movement_type,
            cantidad,
            motivo,
            document,
            costo_unitario,
            stock_objetivo,
            precio_venta,
            cliente
}) => {

    

    try {
        const data = await apiFetch(`${API_URL}/registrar-movimiento-stock`, {
            method: "POST",
            body: JSON.stringify({cantidad, product_id, movement_type, motivo, document, costo_unitario, stock_objetivo, precio_venta, cliente})
        });
        
        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en la creacion del registro movimiento stock' )
    }

}
export const MovementsTypeServices = async () => {


    try {
        const data = await apiFetch(`${API_URL}/tipos-de-movimiento`);

        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en obtener los tiempos de movimiento' )
    }

}
export const stockMovements = async ( {limite, fechaDesde, fechaHasta} = {} ) => {

    
    try {
        
        const url = new URL(`${API_URL}/todos-movimientos`);
        if (limite !== undefined) url.searchParams.set('limite', limite);
        if (fechaDesde !== undefined) url.searchParams.set('fechaDesde', fechaDesde);
        if (fechaHasta !== undefined) url.searchParams.set('fechaHasta', fechaHasta);
        // console.log('[FE url]', url.toString());

        const data = await apiFetch(`${ url }`);
        
        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en obtener los movimientos de stock' )
    }

}
export const stockMovementEstadisticasToday = async ( {hoy} = {} ) => {

    
    try {
        
        const url = new URL(`${API_URL}/estadisticas-movimientos-hoy`);
        if (hoy !== null) url.searchParams.set('hoy', hoy);
        // console.log('[FE url]', url.toString());
        const data = await apiFetch(`${ url }`);

        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en obtener las estadisticas seccion mov stocks' )
    }

}