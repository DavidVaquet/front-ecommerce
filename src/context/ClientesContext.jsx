import { createContext, useState, useContext } from "react";

const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
    const [clientesContext, setClientesContext] = useState(0);

    return (
        <ClientesContext.Provider value={{clientesContext, setClientesContext}}>
            { children }
        </ClientesContext.Provider>
    )
}

export const useClientes = () => useContext(ClientesContext);