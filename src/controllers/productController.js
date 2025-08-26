import { addProduct } from "../services/productServices";

export const addProductController = async ({ nombre, cantidad_minima, cantidad, descripcion_corta, descripcion, precio, imagen_url, subcategoria_id, marca, estado, destacado, imagenUrls, toast, resetFields, precio_costo }) => {
  
  try {
    const { newProduct } = await addProduct({
      nombre,
      descripcion,
      precio,
      imagen_url,
      subcategoria_id,
      marca,
      estado,
      destacado,
      imagenUrls,
      descripcion_corta,
      cantidad_minima,
      cantidad,
      precio_costo
    });

    toast.success('Producto cargado correctamente.');
    if (typeof resetFields === 'function') resetFields();
    return { success: true };

  } catch (error) {
    console.error("Error en addProductController:", error);
    toast.error(error.message || 'Ocurrió un error inesperado.');
    throw new Error(error.message);
  }
};
