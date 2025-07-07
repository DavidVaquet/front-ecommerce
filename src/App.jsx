import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { SubirProducto } from './pages/admin/productos/SubirProducto';
import { Productos } from './pages/admin/productos/Productos';
import AdminLayout from './layouts/AdminLayout';
import { Toaster } from 'react-hot-toast';
import { RegistrarVenta } from './pages/admin/ventas/RegistrarVenta';
import { AltaCliente } from './pages/admin/users/AltaCliente';
import { Ordenes } from './pages/admin/Ordenes';
import { UserSistema } from './pages/admin/users/UserSistema';
import { HistorialVentas } from './pages/admin/ventas/HistorialVentas';

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

      {/* Rutas privadas */}
      <Route path='/admin' element={<AdminLayout/>}>
      <Route path='/admin/productos/nuevo' element={<SubirProducto/>}/>
      <Route path='/admin/productos' element={<Productos/>}/>
      <Route path='/admin/registrar-venta' element={<RegistrarVenta/>}/>
      <Route path='/admin/registrar-cliente' element={<AltaCliente/>}/>
      <Route path='/admin/ordenes' element={<Ordenes/>}/>
      <Route path='/admin/usuarios' element={<UserSistema/>}/>
      <Route path='/admin/historial-ventas' element={<HistorialVentas/>}/>
      
      
      
      
      
      
      </Route>


    </Routes>
    </BrowserRouter>
  )
}

export default App
