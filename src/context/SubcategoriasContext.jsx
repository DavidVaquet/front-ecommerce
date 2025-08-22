import { useContext, createContext, useState } from "react";

export const SubcategoriasContext = createContext();

export const SubcategoriaProvider = ({ children }) => {
    const [subcategoriasContext, setRecargarSubcategoriasContext] = useState(0);

    return (
        <SubcategoriasContext.Provider value={{subcategoriasContext, setRecargarSubcategoriasContext}}>
            {children}
        </SubcategoriasContext.Provider>
    )
}

export const useSubcategorias = () => useContext(SubcategoriasContext);