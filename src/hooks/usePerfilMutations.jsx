import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeSession, editUserInfo, updatePasswordUser } from "../services/authServices";

export const usePerfilMutation = () => {
    const qc = useQueryClient();

    const invalidateAll = () => qc.invalidateQueries({ queryKey: ['perfil'], exact: false });

    const editUser = useMutation({
        mutationFn: (payload) => editUserInfo(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['perfil', 'usuario']})
        }
    });

    const cerrarSession = useMutation({
        mutationFn: (id) => closeSession(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['perfil', 'sessions']})
        }
    })

    return { editUser, cerrarSession}
}