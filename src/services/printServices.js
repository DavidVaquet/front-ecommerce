import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/print`;
export const printEtiqueta = async({producto, ancho, alto, copias, mode}) => {
    try {
        const res = await apiFetch(`${API_URL}`, {
            method: 'POST',
            body: JSON.stringify({ producto, ancho, alto, copias, mode})
        });

        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}