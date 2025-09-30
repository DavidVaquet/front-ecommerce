import { useQueryClient, useMutation } from "@tanstack/react-query";
import { crearClienteServices, bajaCliente, editarClienteService } from "../services/clienteServices";

export const useClienteMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({ queryKey: ['clientes'], exact: false });

    const crearCliente = useMutation({
        mutationFn: (payload) => crearClienteServices(payload),
        onSuccess: () => {
            invalidate();
        }
    })

    const suspenderCliente = useMutation({
        mutationFn: (payload) => bajaCliente(payload),
        onSuccess: () => {
            invalidate();
        }
    });

    const editarCliente = useMutation({
        mutationFn: (payload) => editarClienteService(payload),
        onSuccess: () => {
            invalidate();
        }
    })



    return { crearCliente, suspenderCliente, editarCliente };
}