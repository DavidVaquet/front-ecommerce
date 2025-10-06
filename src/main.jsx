import { createRoot } from "react-dom/client";
import { keepPreviousData, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 300_000,
      gcTime: 20 * 60_000,
      retry: 1,
      placeholderData: keepPreviousData,
      suspense: false,
      useErrorBoundary: false,
    },
    mutations: {
      useErrorBoundary: false,
      retry: 0
    }
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient} >
    <AuthProvider> 
    <App />        
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
