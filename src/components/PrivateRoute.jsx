import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ADMIN_ROLES = ['admin', 'vendedor', 'supervisor'];

export const PrivateRoute = () => {
  const { user, token } = useContext(AuthContext);

  
  if (!user || !token) return <Navigate to='/login' replace />
  
  const rol = user.rol.trim().toLowerCase();

  if (ADMIN_ROLES.includes(rol)) return <Outlet />
  if (rol === 'cliente') return <Navigate to='/' replace />
  
  return <Navigate to='/login' replace />
};
