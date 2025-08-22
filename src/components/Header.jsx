import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useProductos } from '../context/ProductsContext';
import { productosCantidadMinima } from '../services/productServices';
import { Bell, AlertTriangle } from "lucide-react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Typography
} from "@material-tailwind/react";

export const Header = () => {
  // USESTATES
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  // CONTEXT
  const { recargarProductos } = useProductos();
  // NAVIGATE
  const navigate = useNavigate();
  // OBTENER PRODUCTOS CON CANTIDAD MINIMA PARA LA NOTIFICACION
  useEffect(() => {
    const fetchProductsMin = async () => {
      try {
        const productosMinimaCantidad = await productosCantidadMinima();
        setProductosBajoStock(productosMinimaCantidad);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProductsMin();
  }, [recargarProductos])
  
  
  return (
    <div className='flex w-full h-[80px] bg-white items-center justify-between p-8'>
        <div>
            <h1 className='text-negro font-worksans uppercase font-semibold'>Productos</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
    <Menu>
  <MenuHandler>
    <IconButton variant="text" className="relative">
      <Bell className="h-5 w-5 text-orange-900" />
      {productosBajoStock.length > 0 && (
        <span className="absolute -top-2 -right-1 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
          {productosBajoStock.length}
        </span>
      )}
    </IconButton>
  </MenuHandler>

  <MenuList className="max-h-72 overflow-y-auto">
    {productosBajoStock.length === 0 ? (
      <MenuItem disabled>
        <Typography variant="small">No hay productos con bajo stock</Typography>
      </MenuItem>
    ) : (
      <>
        {productosBajoStock.map((producto) => (
          <MenuItem
  onClick={() => navigate("/admin/productos")}
  className="bg-gray-100 hover:bg-red-50 rounded-lg p-3 transition-all duration-200 cursor-pointer"
>
  <div className="flex items-start gap-3">
    <div className="mt-0 text-red-600">
      <AlertTriangle className="text-yellow-900 w-5 h-5" />
    </div>

    <div className="flex flex-col">
      <Typography variant="small" className="font-semibold text-blue-gray-900">
        El producto {producto.nombre}
      </Typography>
      <Typography variant="small" className="text-gray-700">
        tiene un stock menor a la cantidad mínima
      </Typography>
      <div className="text-sm mt-1">
        <span className="text-red-600 font-medium">Stock actual: {producto.cantidad}</span><br />
        <span className="text-red-600 font-medium">Mínimo requerido: {producto.cantidad_minima}</span>
      </div>
    </div>
  </div>
</MenuItem>
        ))}
      </>
    )}
  </MenuList>
</Menu>
</div>
              <img src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar"
              className="inline-block relative object-cover object-center !rounded-full w-8 h-8" />
              <div>
              <h6 className="text-negro font-worksans font-normal">Administrador</h6>
              </div>
            </div>
        </div>
  )
}
