import { useQueryClient, useMutation } from "@tanstack/react-query";
import { registrarMovStockServices } from "../services/stockServices";

export const useStockMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['movimientos'], exact: false });

    const crearMovimientoStock = useMutation({
        mutationFn: (payload) => registrarMovStockServices(payload),
        onSuccess: () => {
            invalidate()
        }
    });

    return { crearMovimientoStock }
}