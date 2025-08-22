const API_URL = `${import.meta.env.VITE_API_URL}/impresora`;

export const fetchTSPL = async (id, copies = 1) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Se necesita el token');
      
        const res = await fetch(`${API_URL}/imprimir-etiqueta/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ copies }),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Error al generar TSPL');
        return payload.tspl;  
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error');
    }
};