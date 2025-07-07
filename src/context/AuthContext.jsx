import { createContext } from "react";
import { useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {

const [user, setUser] = useState(null);

useEffect(() => {
  const userStorage = localStorage.getItem('usuario');
  if (userStorage) {
    setUser(JSON.parse(userStorage));
  }
}, [])

return (
    <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>
)
};