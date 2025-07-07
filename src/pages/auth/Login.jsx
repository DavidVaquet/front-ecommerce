import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginController } from '../../controllers/authController';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import logoiclub from '../../assets/logoiclub.png';
import iclubafuera from '../../assets/iclubfuera.jpg';

export const Login = () => {

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();

    await loginController({
      email,
      password,
      toast,
      setUser,
      navigate
    })
  }


    return (
      <div className='h-screen flex items-center justify-center w-full bg-white'>
        <div className='flex h-4/6 w-4/6  rounded-lg shadow-lg border-black border-2'>
  
          {/* Panel izquierdo - imagen */}
          <div className='flex h-full w-2/5'>
            <img src={iclubafuera} className='w-full h-full rounded-l-lg bg-center bg-cover nm' />
          </div>
  
          {/* Panel derecho - login */}
          <div className='flex-1 flex flex-col justify-center p-4 bg-white rounded-r-lg gap-6'>
  
            {/* Logo arriba */}
            <div className="flex justify-center  items-center h-36 overflow-hidden">
                <img
                src={logoiclub}
                alt="Logo iClub"
                className="h-[550px] w-auto object-contain mt-10"
                />
            </div>
  
            {/* Formulario o contenido */}
            <div className='flex flex-1 flex-col items-center gap-4'>
              <h1 className='text-4xl text-center text-negro font-bold font-worksans'>Bienvenido de nuevo a iClub</h1>
              <p className='text-center font-worksans text-negro'>Ingresá para acceder a tu cuenta y administrar tu tienda.</p>
                <form className="w-full max-w-sm mx-auto mt-1" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 font-worksans focus:ring-black"
                    />
                    </div>
                    <div className=''>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 font-worksans focus:ring-black"
                    />
                    </div>
                    <div className='flex justify-center mt-6'>
                        <button 
                        type="submit"
                        className='text-white bg-negro text-base font-semibold w-full py-2 rounded-3xl font-worksans'
                        >
                            Iniciar sesion
                        </button>
                    </div>
                    </form>
                    <div className='flex flex-col items-center gap-4'>
                    <span className='text-black font-semibold hover:text-gris font-worksans'><Link to='/recuperar-contraseña'>¿Olvidaste tu contraseña?</Link></span>
                    </div>

            </div>
  
          </div>
        </div>
      </div>
    )
  }
  
