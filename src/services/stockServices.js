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

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('El token es obligatorio para añadir la cantidad de un producto.');
    }

    try {
        const response = await fetch(`${API_URL}/registrar-movimiento-stock`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({cantidad, product_id, movement_type, motivo, document, costo_unitario, stock_objetivo, precio_venta, cliente})
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error en la creacion del registro movimiento stock")
        };
        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en la creacion del registro movimiento stock' )
    }

}
export const MovementsTypeServices = async () => {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('El token es obligatorio para añadir la cantidad de un producto.');
    }

    try {
        const response = await fetch(`${API_URL}/tipos-de-movimiento`, {
            method: "GET",
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error en obtener los tipos de movimiento")
        };
        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en obtener los tiempos de movimiento' )
    }

}
export const stockMovements = async ( {limite, fechaDesde, fechaHasta} = {} ) => {

    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Falta el token');
        }
        
        const url = new URL(`${API_URL}/todos-movimientos`);
        if (limite !== undefined) url.searchParams.set('limite', limite);
        if (fechaDesde !== undefined) url.searchParams.set('fechaDesde', fechaDesde);
        if (fechaHasta !== undefined) url.searchParams.set('fechaHasta', fechaHasta);
        console.log('[FE url]', url.toString());
        const response = await fetch(`${ url }`, {
            method: "GET",
            headers: {'Accept': 'application/json', 'Authorization': `Bearer ${token}`}
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error en obtener los movimientos de stock")
        };
        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en obtener los movimientos de stock' )
    }

}
export const stockMovementEstadisticasToday = async ( {hoy} = {} ) => {

    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Falta el token');
        }
        
        const url = new URL(`${API_URL}/estadisticas-movimientos-hoy`);
        if (hoy !== undefined) url.searchParams.set('hoy', hoy);
        // console.log('[FE url]', url.toString());
        const response = await fetch(`${ url }`, {
            method: "GET",
            headers: {'Accept': 'application/json', 'Authorization': `Bearer ${token}`}
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error en obtener las estadisticas seccion mov stocks")
        };
        return data;
        
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error en obtener las estadisticas seccion mov stocks' )
    }

}