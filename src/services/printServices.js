const API_KEY = import.meta.env.API_KEY;
const API_URL = `${import.meta.env.VITE_API_URL}/print`;
export const printEtiqueta = async({producto, ancho, alto, copias, mode}) => {
    try {
        const res = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {'x-api-key': API_KEY, 'Content-Type': 'application/json'},
            body: JSON.stringify({ producto, ancho, alto, copias, mode})
        });

        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}