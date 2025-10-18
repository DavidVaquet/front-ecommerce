import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getCategoriasSubCategorias, getStatsCategorias, obtenerCategoriasEcommerce } from "../services/categorieService";
import { useMemo } from "react";

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

export const useCategoriasEcommerce = (rawOpts = {}) => {

    const opts = {
        limiteCategorias: rawOpts?.limiteCategorias ?? null,
        offset: rawOpts?.offset ?? 0,
        activo: rawOpts?.activo ?? true,
        visible: rawOpts?.visible ?? 1,
        includeCounts: rawOpts?.includeCounts ?? true,
        includeSubcats: rawOpts?.includeSubcats ?? true,
        orderBy: rawOpts?.orderBy ?? "",
        publicadoProd: rawOpts?.publicadoProd ?? 1,
        estadoProd: rawOpts?.estadoProd ?? 1
    };

    const filtros = useMemo(() => opts, [JSON.stringify(opts)]);
    console.log(filtros);
    return useQuery({
        queryKey: ['ecommerce', 'categorias', filtros],
        queryFn: () => obtenerCategoriasEcommerce(filtros),
        staleTime: 60_000,
        gcTime: 5 * 60_000
    })
};


export const useCategoriasEcommerceNavbar = () => {
    return useCategoriasEcommerce({
    limiteCategorias: 6,
    offset: 0,
    activo: true,
    visible: 1,
    includeCounts: false,
    includeSubcats: true,
    orderBy: '', 
    })
}