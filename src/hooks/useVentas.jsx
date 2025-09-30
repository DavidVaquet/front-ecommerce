import { useQuery } from "@tanstack/react-query";
import { obtenerVentasConDetallesService, obtenerVentasTotales } from "../services/ventasServices";
import { estadisticasVentasServices } from "../services/estadisticasServices";

export const useVentas = (filtros) => {
    return useQuery({
        queryKey: ['ventas', filtros],
        queryFn: () => obtenerVentasConDetallesService(filtros),
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 2,
        placeholderData: (prev) => prev
    })
};

export const useVentasEstadisticas = () => {
    return useQuery({
        queryKey: ['ventas', 'estadisticas'],
        queryFn: () => estadisticasVentasServices(),
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
        retry: 1,
        placeholderData: (prev) => prev
    })
};

export const useVentasTotales = () => {
    return useQuery({
        queryKey: ['ventas', 'totales'],
        queryFn: () => obtenerVentasTotales(),
        staleTime: 60_000,
        refetchOnWindowFocus: 'always',
        retry: 1,
        placeholderData: (prev) => prev
    })
};