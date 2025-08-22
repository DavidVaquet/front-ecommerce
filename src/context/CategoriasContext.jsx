import { useContext, createContext, useState } from "react";

const CategoriaContext = createContext();

export const CategoriaProvider = ({ children }) => {
    const [categoriasContext, setRecargarCategoriaContext] = useState(0);
    
    return (
        <CategoriaContext.Provider value={{categoriasContext, setRecargarCategoriaContext}}>
            {children}
        </CategoriaContext.Provider>
    )
}

export const useCategorias = () => useContext(CategoriaContext);