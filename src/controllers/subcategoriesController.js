import { addSubcategoryService, getSubcategories } from "../services/subcategorieService";


export const addSubcategoryController = async({nombre, descripcion, activo, categoria_id, toast, resetFields}) => {

try {
    const data = await addSubcategoryService({nombre, descripcion, activo, categoria_id});
    toast.success('Subcategoria creada exitosamente.');
    if (typeof resetFields === 'function') resetFields();
    return data;
} catch (error) {
    toast.error('Ocurrio un error inesperado.');
    throw new Error(error.message);
}
};

export const getSubcategoriesController = async ({toast}) => {

    try {
        const data = await getSubcategories();
        return data;
    } catch (error) {
        toast.error('Error al obtener las categorias.');
        throw new Error(error.message);
    }
};