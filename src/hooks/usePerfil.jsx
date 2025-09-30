import { useQuery } from "@tanstack/react-query";
import { getSessions, getUserInfo, recentActivity, statsUsage } from "../services/authServices";

export const usePerfilUserInfo = () => {
    return useQuery({
        queryKey: ['perfil', 'usuario'],
        queryFn: () => getUserInfo(),
        retry: 1,
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
        placeholderData: (prev) => prev
    })
};

export const usePerfilSessions = () => {
    return useQuery({
        queryKey: ['perfil', 'sessions'],
        queryFn: () => getSessions(),
        retry: 1,
        refetchOnWindowFocus: 'always',
        staleTime: Infinity,
        placeholderData: (prev) => prev
    })
};

export const usePerfilRecentActivity = (filtros) => {
        return useQuery({
        queryKey: ['perfil','activity', filtros],
        queryFn: () => recentActivity(filtros),
        staleTime: 30_000,
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
        placeholderData: (prev) => prev
        });
};


export const usePerfilStatsUsage = () => {
    return useQuery({
        queryKey: ['perfil', 'statsUsage'],
        queryFn: () => statsUsage(),
        retry: 1,
        refetchOnWindowFocus: 'always',
        refetchOnMount: 'always',
        staleTime: 60_000,
        placeholderData: (prev) => prev
    })
}
