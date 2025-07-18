import { addProduct } from "../services/productServices";
import { addStockServices } from "../services/stockServices";

export const addProductController = async ({ nombre, descripcion, precio, imagen_url, subcategoria_id, marca, estado, visible, imagenUrls, cantidad, toast, resetFields }) => {
  
  try {
    const { newProduct } = await addProduct({
      nombre,
      descripcion,
      precio,
      imagen_url,
      subcategoria_id,
      marca,
      estado,
      visible,
      imagenUrls
    });

    const { producto } = newProduct;
      await addStockServices({
      product_id: producto.id,
      cantidad: parseInt(cantidad, 10)
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
