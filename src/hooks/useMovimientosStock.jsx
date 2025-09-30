import { useQuery } from "@tanstack/react-query";
import { stockMovementEstadisticasToday, stockMovements } from "../services/stockServices";

export const useMovimientoStock = (filtro) => {
    return useQuery({
        queryKey: ['movimientos', filtro],
        queryFn: () => stockMovements(filtro),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
        retry: 1,
        staleTime: 60_000,
    })
};

export const useMovimientoEstadisticas = (filtro) => {
    return useQuery({
        queryKey: ['movimientos', 'estadisticas', filtro],
        queryFn: () => stockMovementEstadisticasToday(filtro),
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
        retry: 1,
        staleTime: Infinity
    })
};

