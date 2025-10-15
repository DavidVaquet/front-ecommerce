import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginController } from '../../controllers/authController';
import { AuthContext } from '../../context/AuthContext';
import logoiclub from '../../assets/logoIclub.webp';
import iclubafuera from '../../assets/iclubfuera.webp'
import { useNotificacion } from '../../hooks/useNotificacion';

export const Login = () => {

  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // NOTIFICACION
  const {mostrarNotificacion, componenteAlerta} = useNotificacion();

  const handleSubmit = async (e) => {

    e.preventDefault();

    await loginController({
      email,
      password,
      mostrarNotificacion,
      setUser,
      navigate,
      setToken
    })
  }


    return (
    <div className="h-screen flex items-center justify-center w-full bg-white">
      {componenteAlerta}
      <div className="flex h-4/6 w-4/6 rounded-lg shadow-lg border-black border-2 overflow-hidden">

        {/* Panel izquierdo - imagen grande (prioridad alta) */}
          <div className="flex h-full w-2/5">
          <img
            src={iclubafuera}
            alt="Fachada iClub"
            width={1600}   // poné acá el ancho real del archivo
            height={1200}  // y acá el alto real
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover object-center rounded-l-lg"
          />
        </div>
        

        {/* Panel derecho - login */}
        <div className="flex-1 flex flex-col justify-center p-6 bg-white rounded-r-lg gap-6">

          {/* Logo arriba (prioridad baja, sin inflar el tamaño) */}
          <div className="flex justify-center items-center h-24">
            <img
              src={logoiclub}
              alt="Logo iClub"
              width={300} 
              height={200}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="h-[60px] w-auto object-contain"
            />
          </div>

          {/* Formulario */}
          <div className="flex flex-1 flex-col items-center gap-4">
            <h1 className="text-4xl text-center text-negro font-semibold ">
              Bienvenido de nuevo a iClub
            </h1>
            <p className="text-center  text-negro">
              Ingresá para acceder a tu cuenta y administrar tu tienda.
            </p>

            <form className="w-full max-w-sm mx-auto mt-1" onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2  focus:ring-black"
                  autoComplete="username"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2  focus:ring-black"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="text-white bg-negro text-base font-semibold w-full py-2 rounded-3xl "
                >
                  Iniciar sesión
                </button>
              </div>
            </form>

            <div className="flex flex-col items-center gap-4">
              <span className="text-black font-semibold hover:text-gris ">
                <Link to="/restablecer-password">¿Olvidaste tu contraseña?</Link>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
  
