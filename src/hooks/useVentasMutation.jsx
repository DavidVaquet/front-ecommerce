import { useQueryClient, useMutation } from "@tanstack/react-query";
import { registrarVentaService } from "../services/ventasServices";

export const useVentasMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['ventas'], exact: false });

    const crearVenta = useMutation({
        mutationFn: (payload) => registrarVentaService(payload),
        onSuccess: () => {
            invalidate();
        },
        onError: (err) => {
            console.error('crearVenta error:', err);
        }
    });

    return { crearVenta }
}