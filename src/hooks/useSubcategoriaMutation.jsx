import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addSubcategoryService } from "../services/subcategorieService";
import { qkCategoriasSubcategoria } from "./useCategorias";

export const useSubcategoriasMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['subcategorias'], exact: false});

    const crearSubcategoria = useMutation({
        mutationFn: (payload) => addSubcategoryService(payload),
        onSuccess: () => { 
            invalidate();
            qc.invalidateQueries({ queryKey: qkCategoriasSubcategoria()});
        }
    })

    return { crearSubcategoria }
} 