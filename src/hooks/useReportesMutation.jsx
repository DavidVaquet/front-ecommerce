import { useQueryClient, useMutation } from "@tanstack/react-query";
import { crearReporte, descargarReportes, eliminarReporte } from "../services/reportesServices";

export const useReportesMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['reportes']});

    const nuevoReporte = useMutation({
        mutationFn: (payload) => crearReporte(payload),
        onSuccess: () => {
            invalidate();
        }
    });

    const bajarReporte = useMutation({
        mutationFn: (payload) => descargarReportes(payload)
    });

    const borrarReporte = useMutation({
        mutationFn: (id) => eliminarReporte(id),
        onSuccess: () => {
            invalidate();
        }
    })

    return { nuevoReporte, bajarReporte, borrarReporte };
}