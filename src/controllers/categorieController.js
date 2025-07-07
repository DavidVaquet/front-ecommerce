import { createCategoryService } from "../services/categorieService";
import { toast } from 'react-hot-toast';

export const addCategoryController = async({nombre, descripcion, activo}) => {

try {
    const data = await createCategoryService({nombre, descripcion, activo});
    toast.success('Categoria creada exitosamente.');
    return data;
} catch (error) {
    toast.error('Ocurrio un error inesperado.');
    throw new Error(error.message);
}
};