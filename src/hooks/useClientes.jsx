import { useQuery } from "@tanstack/react-query";
import { clientesConCompras, clientesEstadisticas, clientesEstado } from "../services/clienteServices";

export const useClientes = (filtros = {}) => {
    return useQuery({
        queryKey: ['clientes', filtros],
        queryFn: () => clientesEstado(filtros),
        retry: 1,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
}

export const useClientesCompras = (filtros) => {
    return useQuery({
        queryKey: ['clientes', 'compras', filtros],
        queryFn: () => clientesConCompras(filtros),
        retry: 1,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
}

export const useClienteEstadisticas = (filtros) => {
  return useQuery({
    queryKey: ['clientes', 'estadisticas', filtros],   
    queryFn: () => clientesEstadisticas(filtros),  
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
    placeholderData: (prev) => prev,
    enabled: !!filtros,                             
  });
};