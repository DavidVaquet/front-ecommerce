import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to='/login' replace />
  const rol = user.rol;

  if (rol === 'admin') return <Outlet />
  if (rol === 'cliente') return <Navigate to='/perfil' replace />
  
  return <Navigate to='/login' replace />
};
