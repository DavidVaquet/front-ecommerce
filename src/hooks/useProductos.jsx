import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProductos, fetchProductStats } from "../services/productServices";

// EXPORTAR QUERYKEY    
export const qkProductosStats = (f = {}) => ['productos', 'stats', f];
export const qkProductos = (f = {}) => ['productos', f];

export const useProductos = (filtros) => {
    return useQuery({
        queryKey: ['productos', filtros],
        queryFn: () => fetchProductos(filtros),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
        refetchOnWindowFocus: false
    })
}

export const useProductoStats = (filtros = {}, { enabled = true } = {}) => {
  return useQuery({
    queryKey: ['productos', 'stats', filtros],
    queryFn: () => fetchProductStats(filtros),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: { total: 0, activos: 0, sin_stock: 0, bajo_stock: 0 },
    onSuccess: (data) => {
      console.log('stats from server =>', data, {
        types: {
          total: typeof data?.total,
          activos: typeof data?.activos,
          sin_stock: typeof data?.sin_stock,
          bajo_stock: typeof data?.bajo_stock,
        },
      });
    },
    onError: (err) => {
      console.error('Fallo la carga de stats:', err?.message ?? err);
    },
  });
};