import { useQueryClient, useMutation } from "@tanstack/react-query";
import { editUser, eliminarUser, register } from "../services/authServices";

export const useUserSystemMutation = () => {
    const qc = useQueryClient();

    const invalidateUser = () => qc.invalidateQueries({ queryKey: ['user'], exact: false});

    const registerUsuario = useMutation({
        mutationFn: (payload) => register(payload),
        onSuccess: () => {
            invalidateUser();
        }
    });

    const editarUsuario = useMutation({
        mutationFn: (payload) => editUser(payload), 
        onSuccess: () => {
            invalidateUser();
        }
    });

    const eliminarUsuario = useMutation({
        mutationFn: (payload) => eliminarUser(payload),
        onSuccess: () => {
            invalidateUser();
        }
    });

    return { registerUsuario, editarUsuario, eliminarUsuario };
}