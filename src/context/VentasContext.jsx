import { createContext, useContext, useState } from "react";

export const VentasContext = createContext();

export const VentasProvider = ({ children }) => {
    const [ventasContext, setVentasContext] = useState(0);

    return (
        <VentasContext.Provider value={{ ventasContext, setVentasContext }}>
            { children }
        </VentasContext.Provider>
    )
}

export const useVentas = () => useContext(VentasContext);