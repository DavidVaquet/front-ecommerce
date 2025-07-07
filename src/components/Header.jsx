import React from 'react'

export const Header = () => {
  return (
    <div className='flex w-full h-[80px] bg-white items-center justify-between p-8'>
        <div>
            <h1 className='text-negro font-worksans uppercase font-semibold'>Productos</h1>
        </div>
        <div className="flex items-center gap-4">
            <img src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar"
            className="inline-block relative object-cover object-center !rounded-full w-12 h-12" />
            <div>
            <h6 className="text-negro font-worksans font-normal">Administrador</h6>
            </div>
            </div>
        </div>
  )
}
