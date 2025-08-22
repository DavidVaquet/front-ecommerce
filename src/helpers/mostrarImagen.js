export const mostrarImagen = (imagen) => {
    if (!imagen) return '/public/imagenes/default-product-image.jpeg';
    const ruta = imagen.replace(/\\/g, "/");
    const imagenCompleta = `http://localhost:5002/${ruta}`;
    return imagenCompleta
}