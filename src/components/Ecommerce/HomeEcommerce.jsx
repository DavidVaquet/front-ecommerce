import React from 'react'
import { CarouselTransition } from './Carrousel'
import { Marque } from './MarqueeSlider'
import { ProductCard } from './ProductCard'
import { CarouselDestacados } from './CarrouselDestacados'
import { destacadosMock } from './mock'
destacadosMock


export const HomeEcommerce = () => {



  return (
        <div className='w-full min-h-dvh h-full'>
                <div className='w-full relative'>
                    <CarouselTransition />
                </div>
                <div className='mb-12'>
                <Marque />

                </div>
                
                <div className='max-w-7xl mx-auto'>
                    <div className='mb-4'>
                      <h1 className='text-[35px] text-center font-semibold'>
                        Destacados
                      </h1>
                    </div>
                    <div className='flex items-center'>
                      <CarouselDestacados
                      destacados={destacadosMock}/>
                    </div>
                </div>
        </div>


  )
}
