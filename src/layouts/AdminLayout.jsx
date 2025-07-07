import React from 'react'
import {Outlet} from 'react-router-dom';
import { Sidebar } from '../components/SideBar';
import { Header } from '../components/Header';
import { Toaster } from 'react-hot-toast';

export const AdminLayout = () => {
  return (
    <div className='flex min-h-screen'>

        <Toaster position='top-center' toastOptions={{duration: 3000}}/>
        {/* SideBar */}
        <Sidebar />
        {/* Contenido principal */}
        <main className='flex-1 flex flex-col dark:bg-gray-900 text-white'>
        {/* Header */}
        <Header/>
        {/* Contenido Dinamico */}
        <div className='flex-1 bg-bclaro w-full overflow-y-auto '>
            <Outlet/>
        </div>
        </main>
    </div>
  )
}

export default AdminLayout;