const API_URL = `${import.meta.env.VITE_API_URL}/recibos`;

export const generarReciboServices = async (venta) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Debes iniciar sesión nuevamente para obtener un token.');

        const response = await fetch(`${API_URL}/generar-recibo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify(venta)
        })

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Error en generar recibo Services')
        };

        return data.url;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al generar recibo')
    }

}

export const descargarRecibo = async (nombreArchivo) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${API_URL}/descargar-recibo/${nombreArchivo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo descargar el recibo");
    }

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
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Se necesita el token.');

    const response = await fetch(`${API_URL}/enviar-recibo`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify(venta)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Error al enviar el recibo');
    };

    return data;
  } catch (error) {
    console.error(error);
  }
}

export const enviarEmailServices = async({email, asunto, mensaje}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Se necesita el token');

    const response = await fetch(`${API_URL}/enviar-email`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({email, asunto, mensaje})
    })
    const data = await response.json();
    if (!response.ok){
      throw new Error(data.msg || 'Error al enviar el email services.');
    }
    return data;
    
  } catch (error) {
    console.error(error);
  }
}
