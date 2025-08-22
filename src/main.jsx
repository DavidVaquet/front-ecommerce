import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductosProvider } from "./context/ProductsContext.jsx";
import { CategoriaProvider } from "./context/CategoriasContext.jsx";
import { SubcategoriaProvider } from "./context/SubcategoriasContext.jsx";
import { VentasProvider } from "./context/VentasContext.jsx";
import { ClientesProvider } from "./context/ClientesContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ProductosProvider>
      <CategoriaProvider>
        <SubcategoriaProvider>
          <VentasProvider>
            <ClientesProvider>
                <App />
            </ClientesProvider>
          </VentasProvider>
        </SubcategoriaProvider>
      </CategoriaProvider>
    </ProductosProvider>
  </AuthProvider>
);
