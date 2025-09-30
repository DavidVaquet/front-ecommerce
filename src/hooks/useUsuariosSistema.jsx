import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { obtenerUsers } from "../services/authServices";
import { useMemo } from "react";

export const useUserSystem = ({ excludeRole, limite, offset }) => {

        const filtros = useMemo(() => ({
            excludeRole,
            limite,
            offset
        }), [limite, offset, excludeRole]);

    return useQuery({
        queryKey: ['user', 'sistema', filtros],
        queryFn: () => obtenerUsers({filters: filtros}),
        staleTime: Infinity,
        placeholderData: keepPreviousData
        
    })
};