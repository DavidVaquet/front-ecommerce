const API_BASE =
  (import.meta?.env?.VITE_API_URL) ||
  (location.hostname === 'localhost' ? 'http://localhost:5002' : 'https://api.iclubcatamarca.com');

export const mostrarImagen = (imagen) => {
  const base = API_BASE.replace(/\/+$/, '');

  if (!imagen) return `${base}/public/imagenes/default-product-image.jpeg`;

  let ruta = String(imagen).trim().replace(/\\/g, '/');

  if (/^https?:\/\//i.test(ruta)) {
    return ruta.replace(/^http:\/\//i, 'https://');
  }

  if (!ruta.startsWith('/')) ruta = `/${ruta}`;

  return `${base}${ruta}`;
};