import { useContext, createContext, useState } from "react";

const ProductosContext = createContext();

export const ProductosProvider = ({ children }) => {
    const [recargarProductos, setRecargarProductos] = useState(0);

    return (
        <ProductosContext.Provider  value={{recargarProductos, setRecargarProductos}}>
            {children}
        </ProductosContext.Provider>
    )
}

export const useProductos = () => useContext(ProductosContext);