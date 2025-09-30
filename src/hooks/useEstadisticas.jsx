import { useQuery } from "@tanstack/react-query";
import { estadisticasServices } from "../services/estadisticasServices";
import { useMemo } from 'react';

export function useEstadisticasDashboard(
  periodoSeleccionado,
  categoriaFiltro,
  topLimit,
  topOffset,
  criticosLimit,
  criticosOffset
) {
  const filtros = useMemo(() => {
    const periodoMap = { 7: '7d', 30: '30d', 90: '90d', 365: '365d' };
    const periodo = periodoMap[periodoSeleccionado] || '30d';
    const categoryId = categoriaFiltro !== '' ? Number(categoriaFiltro) : undefined;
    return { periodo, categoryId, topLimit, topOffset, criticosLimit, criticosOffset };
  }, [periodoSeleccionado, categoriaFiltro, topLimit, topOffset, criticosLimit, criticosOffset]);

  return useQuery({
    queryKey: ['dashboard', 'estadisticas', filtros],
    queryFn: async () => {
      const payload = {
        periodo: filtros.periodo,
        ...(filtros.categoryId != null ? { categoryId: filtros.categoryId } : {}),
        ...(filtros.topLimit != null ? { topLimit: filtros.topLimit } : {}),
        ...(filtros.topOffset != null ? { topOffset: filtros.topOffset } : {}),
        ...(filtros.criticosLimit != null ? { criticosLimit: filtros.criticosLimit } : {}),
        ...(filtros.criticosOffset != null ? { criticosOffset: filtros.criticosOffset } : {}),
      };
      return estadisticasServices(payload);
    },
    select: (est) => ({
      metricas_principales: est?.metricas_principales ?? {},
      ventas_por_categoria: Array.isArray(est?.ventas_por_categoria) ? est.ventas_por_categoria : [],
      productos_top: est?.productos_top ?? { items: [], total: 0, limit: 0, offset: 0, has_more: false },
      productos_criticos: est?.productos_criticos ?? { items: [], total: 0, limit: 0, offset: 0, has_more: false },
    }),
    keepPreviousData: true,
    placeholderData: (prev) => prev,
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
  });
}