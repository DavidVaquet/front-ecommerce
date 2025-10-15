import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createCategoryService, updateCategoryServices, toggleCategoryState, deleteCategoryServices } from "../services/categorieService";
import { qkCategoriasSubcategoria } from "./useCategorias";

export const useCategoriasMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['categorias'], exact: false });

    const crearCategoria = useMutation({
        mutationFn: (payload) => createCategoryService(payload),
        onSuccess: () => {
            invalidate();
            qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria(), exact: false});
        }
    });

    const editarCategoria = useMutation({
        mutationFn: (payload) => updateCategoryServices(payload),
        onSuccess: () => {
            invalidate();
            qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria(), exact: false});
        }
    });

    const cambiarEstado = useMutation({
        mutationFn: (payload) => toggleCategoryState(payload),
        onSuccess: () => {
            invalidate();
            qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria(), exact: false});
        }
    });

    const eliminarCategoria = useMutation({
        mutationFn: (payload) => deleteCategoryServices(payload),
        onSuccess: () => {
            invalidate();
            qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria(), exact: false});
        }
    });

    
    return { crearCategoria, editarCategoria, cambiarEstado, eliminarCategoria }
};