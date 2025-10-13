import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getCategoriasSubCategorias } from "../services/categorieService";

export const qkCategorias = (f = {}) => ['categorias', f];
export const qkCategoriasSubcategoria = (f = {}) => ['categorias', 'subcategorias', f];

export const useCategorias = (filtros = {}) => {
    return useQuery({
        queryKey: ['categorias', filtros],
        queryFn: () => getAllCategories(filtros),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
};

export const useCategoriaSubcategoria = (filtros = {}) => {
    return useQuery({
        queryKey: ['categorias', 'subcategorias', filtros],
        queryFn: () => getCategoriasSubCategorias(filtros),
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
        placeholderData: (prev) => prev
    })
};