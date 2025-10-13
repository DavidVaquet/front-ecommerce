import { createContext } from "react";
import { useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {

const [user, setUser] = useState(() => {

  try {
    const raw = localStorage.getItem('usuario');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed ?? parsed?.user ?? null;
  } catch {
    return null;
  }
});

const [token, setToken] = useState(() => {
  const t = localStorage.getItem('token');
  return t && t !== 'null' && t !== 'undefined' ? t : null;
})

  

return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
        {children}
    </AuthContext.Provider>
)
};