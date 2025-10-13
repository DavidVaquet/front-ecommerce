import { createBrowserRouter } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { SubirProducto } from './pages/admin/productos/SubirProducto';
import { Productos } from './pages/admin/productos/Productos';
import { Toaster } from 'react-hot-toast';
import { RegistrarVenta } from './pages/admin/ventas/RegistrarVenta';
import { AltaCliente } from './pages/admin/clientes/AltaCliente';
import { Ordenes } from './pages/admin/ordenes/Ordenes';
import { Clientes } from './pages/admin/clientes/Clientes';
import { HistorialVentas } from './pages/admin/ventas/HistorialVentas';
import { PrivateRoute } from './components/PrivateRoute';
import { Estadisticas } from './pages/admin/estadisticas/Estadisticas';
import Reportes from './pages/admin/reportes/Reportes';
import AdminLayout from './layouts/AdminLayout';
import TiendaLayout from './layouts/TiendaLayout';
// import PublicarProductos from './pages/admin/productos/PublicarProducto';
import PerfilUsuario from './pages/admin/perfil/PerfilUsuario';
import ConfiguracionesDashboard from './pages/admin/configuraciones/ConfiguracionesDashboard';
import MovimientosStock from './pages/admin/stock/MovimientosStock';
import RegistrarMovimientoStock from './pages/admin/stock/RegistrarMovimientoStock';
import { RestablecerContrasena } from './pages/auth/RecoveryPassword';
import { Boxes, ShoppingCart, Users, BarChart3, FileText, Package, Settings, User as UserIcon, ClipboardList, LayoutGrid } from "lucide-react";
import { GestionCategorias } from './pages/admin/categorias/GestionCategorias';



export const router = createBrowserRouter([
  // RUTAS PUBLICAS
  { path: "/login", element: <Login /> },
  { path: "/restablecer-password/:token", element: <RestablecerContrasena /> },
  { path: "/restablecer-password", element: <RestablecerContrasena /> },

  // TIENDA PUBLICA
  { path: "/", element: <TiendaLayout /> },

  // RUTAS PRIVADAS
  { 
    path: '/admin',
    element: <PrivateRoute/>,
    children: [
      {
        element: <AdminLayout/>,
        children: [
          {
            path: "productos",
            element: <Productos/>,
            handle: { header: { title: 'Productos', icon: Package}}
          },
          {
            path: "productos/nuevo",
            element: <SubirProducto/>,
            handle: { header: { title: 'Nuevo producto', icon: Package}}
          },
          {
            path: "categorias",
            element: <GestionCategorias/>,
            handle: { header: { title: 'Categorías', icon: LayoutGrid}}
          },
          {
            path: "clientes",
            element: <Clientes/>,
            handle: { header: { title: 'Clientes', icon: Users}}
          },
          {
            path: "clientes/registrar-cliente",
            element: <AltaCliente/>,
            handle: { header: { title: 'Registrar cliente', icon: Users}}
          },
          {
            path: "ventas/registrar-venta",
            element: <RegistrarVenta/>,
            handle: { header: { title: 'Registrar venta', icon: ShoppingCart}}
          },
          {
            path: "ventas/historial-ventas",
            element: <HistorialVentas/>,
            handle: { header: { title: 'Historial de ventas', icon: ClipboardList}}
          },
          {
            path: "stock/movimientos-stock",
            element: <MovimientosStock/>,
            handle: { header: { title: 'Movimientos de stock', icon: Package}}
          },
          {
            path: "stock/registrar-movimiento-stock",
            element: <RegistrarMovimientoStock/>,
            handle: { header: { title: 'Registrar movimiento', icon: Package}}
          },
          {
            path: "ordenes",
            element: <Ordenes/>,
            handle: { header: { title: 'Órdenes', icon: FileText}}
          },
          {
            path: "estadisticas",
            element: <Estadisticas/>,
            handle: { header: { title: 'Estadísticas', icon: BarChart3}}
          },
          {
            path: "reportes",
            element: <Reportes/>,
            handle: { header: { title: 'Reportes', icon: FileText}}
          },
          {
            path: "perfil",
            element: <PerfilUsuario/>,
            handle: { header: { title: 'Perfil', icon: UserIcon}}
          },
          {
            path: "settings",
            element: <ConfiguracionesDashboard/>,
            handle: { header: { title: 'Configuraciones', icon: Settings}}
          },
        ],
      },
    ],
  },
]);

export default router;
