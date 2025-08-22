import { useContext, createContext, useState } from "react";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
    const [stock, setRecargarStock] = useState(0);

    return (
        <StockContext.Provider value={{stock, setRecargarStock}}>
            {children}
            </StockContext.Provider>
    )
};

export const useStock = () => useContext(StockContext);