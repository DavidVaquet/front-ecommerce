import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../services/categorieService";

export const qkCategorias = (f = {}) => ['categorias', f];

export const useCategorias = (filtros = {}) => {
    return useQuery({
        queryKey: ['categorias', filtros],
        queryFn: () => getAllCategories(filtros),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
};