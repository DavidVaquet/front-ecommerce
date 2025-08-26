import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/estadisticas`;

export const estadisticasServices = async ({periodo, categoryId, topLimit, criticosLimit} = {}) => {

    try {

        const url = new URL(`${API_URL}/estadisticas-global`);
        if (periodo != null) url.searchParams.set('periodo', periodo);
        if (categoryId != null) url.searchParams.set('categoryId', categoryId);
        if (topLimit != null) url.searchParams.set('topLimit', topLimit);
        if (criticosLimit != null) url.searchParams.set('criticosLimit', criticosLimit);
        // console.log(url);
        const data = await apiFetch(`${url}`);
        
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las estadisticas.');
    }

}
export const estadisticasVentasServices = async () => {

    try {
        const url = new URL(`${API_URL}/estadisticas-ventas-hoy`);
        
        const data = await apiFetch(`${url}`);

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener las estadisticas.');
    }

}