import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createCategoryService } from "../services/categorieService";
import { qkCategoriasSubcategoria } from "./useCategorias";

export const useCategoriasMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['categorias'], exact: false });

    const crearCategoria = useMutation({
        mutationFn: (payload) => createCategoryService(payload),
        onSuccess: async () => {
            invalidate();
            qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria()});
        }
    });

    
    return { crearCategoria }
};