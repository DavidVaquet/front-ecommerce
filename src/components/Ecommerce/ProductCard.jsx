import React from 'react'
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@material-tailwind/react';

export const ProductCard = ({ producto }) => {

const destacadoEdge = (destacado) => {
  if (destacado === 1) {
    return <Star className='text-white fill-white h-[12px]' />
  } else return;
}

  return (
    <div className="w-[276px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-out">
      <div className="relative w-full h-[276px] overflow-hidden bg-gray-100">
        <img
          src="/imagenes/prueba.webp"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          alt="Producto"
        />
        <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center justify-center shadow-md hover:bg-black transition-colors">
          {destacadoEdge(1)}
        </div>
      </div>

      <div className="flex flex-col p-4 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-center text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
            Macbook Pro AIR M4 - 256GB - BLACK
          </h2>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-bold text-center text-azul">$1.129.284</span>
          </div>
          <p className="text-xs text-center text-gray-600">
            <span className="font-semibold text-gray-800">6 </span>
            cuotas sin interés de
            <span className="font-semibold text-gray-800"> $59.835,17</span>
          </p>
        </div>

        <div className="grid grid-cols-2 mb-1 gap-2 pt-2">
          <Button
          color='black'
          className='flex items-center justify-center gap-2 px-4 py-2  text-white text-xs font-semibold rounded-full hover:bg-gray-900 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md'>

            <ShoppingCart className="h-4 w-4 text-white fill-white" />
            <span>COMPRAR</span>
          </Button>
          <Button
          variant='outlined'
          className='flex items-center justify-center gap-2 px-4 py-2  text-gray-900 text-xs font-semibold rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-200'>
            <Eye className="h-4 w-4" />
            <span>VER</span>

          </Button>
  
        </div>
      </div>
    </div>
  )
}