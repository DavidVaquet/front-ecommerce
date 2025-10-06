// src/services/recibos.service.js
import { apiFetch } from "../helpers/auth";


const API_RECIBOS = `${import.meta.env.VITE_API_URL}/recibos`;

const openInNewTab = (url) => {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
};


export const generarReciboService = async (venta) => {
  try {
    const data = await apiFetch(`${API_RECIBOS}/generar`, {
      method: "POST",
      body: JSON.stringify(venta),
    });
    
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.message || "Error al generar recibo");
  }
};


export const verReciboInlinePorCodigo = (codigo) => {
  const url = `${API_RECIBOS}/by-codigo/${encodeURIComponent(codigo)}`;
  openInNewTab(url);
};


export const verReciboInlinePorToken = (token) => {
  const url = `${API_RECIBOS}/link?token=${encodeURIComponent(token)}`;
  openInNewTab(url);
};


export const descargarReciboAttachment = (codigo) => {
  const url = `${API_RECIBOS}/download/${encodeURIComponent(codigo)}`;
  openInNewTab(url);
};


export const enviarReciboService = async (venta) => {
  try {
    const data = await apiFetch(`${API_RECIBOS}/enviar`, {
      method: "POST",
      body: JSON.stringify(venta),
    });
    return data; 
  } catch (error) {
    console.error(error);
    throw new Error(error?.message || "Error al enviar el recibo");
  }
};


export const descargarReciboComoBlob = async (codigo) => {
  try {
    const resp = await fetch(`${API_RECIBOS}/by-codigo/${encodeURIComponent(codigo)}`, {
      method: "GET",
      // Si tu endpoint exige auth, agregá headers acá:
      // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!resp.ok) throw new Error("No se pudo obtener el PDF");
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    return { blob, url, nombre: `recibo-${codigo}.pdf` };
  } catch (e) {
    console.error(e);
    throw new Error("Error al descargar el recibo como Blob");
  }
};


export const enviarEmailServices = async({email, asunto, mensaje}) => {
  try {
    
    const data = await apiFetch(`${API_RECIBOS}/enviar-email`, {
      method: 'POST',
      body: JSON.stringify({email, asunto, mensaje})
    })
    
    return data;
    
  } catch (error) {
    console.error(error);
  }
}
