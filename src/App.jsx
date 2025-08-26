import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import PublicarProductos from './pages/admin/productos/PublicarProducto';
import PerfilUsuario from './pages/admin/perfil/PerfilUsuario';
import ConfiguracionesDashboard from './pages/admin/configuraciones/ConfiguracionesDashboard';
import MovimientosStock from './pages/admin/stock/MovimientosStock';
import RegistrarMovimientoStock from './pages/admin/stock/RegistrarMovimientoStock';

function App() {
  

  return (
    
    

    <BrowserRouter>
    <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    <Routes>

      {/* Rutas publicas */}
      <Route path='/login' element={<Login/>}/>
      {/* Ecommerce */}
      <Route path='/' element={<TiendaLayout/>}>

      </Route>

      {/* Rutas privadas */}
      <Route path="/admin" element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="productos" element={<Productos />} />
          <Route path="productos/nuevo" element={<SubirProducto />} />
          <Route path="productos/publicar" element={<PublicarProductos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/registrar-cliente" element={<AltaCliente />} />
          <Route path="ventas/registrar-venta" element={<RegistrarVenta />} />
          <Route path="ventas/historial-ventas" element={<HistorialVentas />} />
          <Route path="stock/movimientos-stock" element={<MovimientosStock />} />
          <Route path="stock/registrar-movimiento-stock" element={<RegistrarMovimientoStock />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="perfil" element={<PerfilUsuario />} />
          <Route path="settings" element={<ConfiguracionesDashboard />} />

        </Route>
      </Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
