import { createContext } from "react";
import { useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {

const [user, setUser] = useState(null);
const [isReady, setIsReady] = useState(false);
const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('usuario');
      const t = localStorage.getItem('token');
      if (u) setUser(JSON.parse(u));
      if (t) setToken(t);
      
    } catch {}
      setIsReady(true);
  }, [])
  

return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, isReady }}>
        {children}
    </AuthContext.Provider>
)
};