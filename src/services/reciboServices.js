import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/recibos`;

export const generarReciboServices = async (venta) => {

    try {

        const data = await apiFetch(`${API_URL}/generar-recibo`, {
            method: 'POST',
            body: JSON.stringify(venta)
        })

        return data.url;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al generar recibo')
    }

}

export const descargarRecibo = async (codigo) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${API_URL}/by-codigo/${codigo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo descargar el recibo");
    }

    const nombreArchivo = `recibo-${codigo}.pdf`;
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (error) {
    console.error(error.message);
    throw new Error("Error al descargar el recibo");
  }
};

export const enviarReciboServices = async (venta) => {
  try {

    const data = await apiFetch(`${API_URL}/enviar-recibo`, {
      method: 'POST',
      body: JSON.stringify(venta)
    });

    return data;

  } catch (error) {
    console.error(error);
  }
}

export const enviarEmailServices = async({email, asunto, mensaje}) => {
  try {
    
    const data = await apiFetch(`${API_URL}/enviar-email`, {
      method: 'POST',
      body: JSON.stringify({email, asunto, mensaje})
    })
    
    return data;
    
  } catch (error) {
    console.error(error);
  }
}
