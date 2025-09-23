import { apiFetch, auth } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/reportes`;


export const crearReporte = async ({ type, format, date_to, date_from, email_to, filters = {} }) => {

    try {
        const res = await apiFetch(`${API_URL}/create-report`, {
            method: 'POST',
            body: JSON.stringify({type, format, date_to, date_from, email_to, filters})
        });

        return res;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al generar el reporte.');
    }
};
export const obtenerReportes = async () => {

    try {
        const res = await apiFetch(`${API_URL}/get-reports`);

        return res;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al traer los reporte.');
    }
};

export const descargarReportes = async (id) => {

    try {
        const token = auth.getToken();
        const res = await fetch(`${API_URL}/download-report/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: '*/*'
            }
        
        });

        if (res.status === 401 || res.status === 403) {
        auth.logout();               
        return;                      
    }

        if (!res.ok) {
        // Manejo de otros errores (404, 500, etc.)
        const ct = res.headers.get('content-type') || '';
        let msg = `HTTP ${res.status}`;
        try {
        msg = ct.includes('application/json')
            ? (await res.json())?.message || msg
            : (await res.text()) || msg;
        } catch {}
        throw new Error(msg);
    }

        const blob = await res.blob();
        const dispo = res.headers.get('Content-Disposition') || '';
        const m = dispo.match(/filename\*?=(?:UTF-8'')?"?([^"]+)"?/i);
        const nameSug = m ? decodeURIComponent(m[1]) : `reporte-${id}`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nameSug;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al descargar el reporte.');
    }
};