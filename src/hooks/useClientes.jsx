import { useQuery } from "@tanstack/react-query";
import { clientesConCompras, clientesEstadisticas, clientesEstado } from "../services/clienteServices";

export const useClientes = (filtros = {}) => {
    return useQuery({
        queryKey: ['clientes', filtros],
        queryFn: () => clientesEstado(filtros),
        retry: 1,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        
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
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    enabled: !!filtros,
    select: (raw) => {
      const r = raw ?? {};
      // ESTADISTICAS
      const nuevos_hoy = Number(r.nuevos_hoy);
      const altas_hoy_manual = Number(r.altas_hoy_manual);
      const altas_hoy_online = Number(r.altas_hoy_online);
      const incompletos = Number(r.incompletos);
      const nuevos_hoy_tienda = ((altas_hoy_manual / altas_hoy_online ) * 100) || 0;
      const clientes_incompletos = ((incompletos / (altas_hoy_manual + altas_hoy_online)) * 100) || 0;

      // ESTADISTICAS FILTRO SCOPE
      const gasto_promedio = r.promedio_gasto ?? 0;
      const total_gastado =  r.total_gastado ?? 0;
      const total_usuarios = r.total_usuarios ?? 0;
      const usuarios_ecommerce = r.usuarios_ecommerce ?? 0;
      const usuarios_manuales = r.usuarios_manuales ?? 0;
      const usuarios_activos= r.usuarios_activos ?? 0;
      const usuarios_vip = r.usuarios_vip ?? 0;

      const porcentaje_ecommerce = total_usuarios ? (usuarios_ecommerce / total_usuarios) * 100 : 0;
      const porcentaje_user_activos = total_usuarios ? (usuarios_activos / total_usuarios) * 100 : 0;
      return { 
        nuevos_hoy,
        altas_hoy_manual,
        altas_hoy_online,
        incompletos,
        nuevos_hoy_tienda,
        clientes_incompletos,
        // RESULTS FILTROS SCOPE
        total_gastado,
        gasto_promedio,
        total_usuarios,
        usuarios_ecommerce,
        usuarios_manuales,
        usuarios_activos,
        usuarios_vip,
        porcentaje_ecommerce,
        porcentaje_user_activos

      };

    }

  });
};