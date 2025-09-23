import { useQueryClient, useMutation } from "@tanstack/react-query";
import { activarProductLogic, addProduct, deleteProductLogic, editProduct, eliminarProductoServices } from "../services/productServices";

export const useProductosMutation = () => {
    const qc = useQueryClient();

    const invalidate = () => qc.invalidateQueries({queryKey: ['productos'], exact: false});

    const editarProducto = useMutation({
        mutationFn: (payload) => editProduct(payload),
        onSuccess: () => {
            invalidate();
        }
    });

    const activarProducto = useMutation({
        mutationFn: (id) => activarProductLogic(id),
        onSuccess: () => {
            invalidate();
        }
    });

    const desactivarProducto = useMutation({
        mutationFn: (id) => deleteProductLogic(id),
        onSuccess: () => {
            invalidate();
        }
    });

    const eliminarProducto = useMutation({
        mutationFn: (id) => eliminarProductoServices(id),
        onSuccess: () => {
            invalidate();
        }
    });

    const crearProducto = useMutation({
        mutationFn: (payload) => addProduct(payload),
        onSuccess: () => {
            invalidate();
        }
    })

    return { editarProducto, activarProducto, desactivarProducto, eliminarProducto, crearProducto };
}