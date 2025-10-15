import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addSubcategoryService, deleteSubcategoryServices, updateSubcategoryServices } from "../services/subcategorieService";
import { qkCategoriasSubcategoria } from "./useCategorias";

export const useSubcategoriasMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['subcategorias'], exact: false});

    const crearSubcategoria = useMutation({
        mutationFn: (payload) => addSubcategoryService(payload),
        onSuccess: () => { 
            invalidate();
            qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria(), exact: false});
        }
    })

    const editarSubcategoria = useMutation({
            mutationFn: (payload) => updateSubcategoryServices(payload),
            onSuccess: () => {
                invalidate();
                qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria(), exact: false});
            }
        });
    
        const eliminarSubcategoria = useMutation({
            mutationFn: (payload) => deleteSubcategoryServices(payload),
            onSuccess: () => {
                invalidate();
                qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria(), exact: false});
            }
        });

    return { crearSubcategoria, eliminarSubcategoria, editarSubcategoria }
} 