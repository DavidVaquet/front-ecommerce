import { createContext } from "react";
import { useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {

const [user, setUser] = useState(() => {
  const userStorage = localStorage.getItem('usuario');
  return userStorage ? JSON.parse(userStorage) : null;
});

return (
    <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>
)
};