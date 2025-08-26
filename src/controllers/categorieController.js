import { createCategoryService } from "../services/categorieService";
import { toast } from 'react-hot-toast';

export const addCategoryController = async({nombre, descripcion, activo, toast}) => {

try {
    const data = await createCategoryService({nombre, descripcion, activo});
    toast.success('Categoria creada exitosamente.');
    return data;
} catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
}
};