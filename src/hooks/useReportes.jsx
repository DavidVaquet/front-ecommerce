import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { obtenerReportes } from "../services/reportesServices";
import { useMemo } from "react";

export const UseReportes = (limite, offset) => {

    const filtros = useMemo(() => ({
        limite,
        offset
    }), [limite, offset]);
    return useQuery({
        queryKey: ['reportes', filtros],
        queryFn: () => obtenerReportes(filtros),
        retry: 1,
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
        placeholderData: keepPreviousData
    })
};

