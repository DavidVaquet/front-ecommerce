import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getCategoriasSubCategorias, getStatsCategorias } from "../services/categorieService";

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

export const useStatsCategoriaSubcategorias = () => {
    return useQuery({
        queryKey: ['categorias', 'subcategorias', 'stats'],
        queryFn: () => getStatsCategorias(),
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
        placeholderData: (prev) => prev,
        select: (raw) => {
            const r = raw ?? {};

            const categorias_activas = r?.categorias_activas ?? 0;
            const categorias_inactivas = r?.categorias_inactivas ?? 0;
            const total_categorias = r?.total_categorias ?? 0;
            const total_subcategorias = r?.total_subcategorias ?? 0;

            return { 
                categorias_activas,
                categorias_inactivas,
                total_categorias,
                total_subcategorias
            }
        
    }
    })
}