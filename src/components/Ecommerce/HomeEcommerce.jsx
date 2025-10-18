import React from 'react'
import { CarouselTransition } from './Carrousel'
import { Marque } from './MarqueeSlider'


export const HomeEcommerce = () => {



  return (
        <div className='w-full min-h-dvh h-full'>
                <div className='w-full relative'>
                    <CarouselTransition />
                </div>
                <Marque />
                <div className='flex flex-col items-center justify-center'>
                    <div className='mt-10'>
                      <h1 className='text-[35px] font-semibold'>
                        Destacados
                      </h1>
                    </div>
                </div>
        </div>


  )
}
