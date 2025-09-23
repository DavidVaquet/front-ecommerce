import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
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
