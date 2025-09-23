import { useQuery } from "@tanstack/react-query";
import { getSubcategories } from "../services/subcategorieService";

export const useSubcategorias = (filtros) => {
    return useQuery({
        queryKey: ['subcategorias', filtros],
        queryFn: () => getSubcategories(filtros),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
};