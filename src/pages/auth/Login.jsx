import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginController } from "../../controllers/authController";
import { AuthContext } from "../../context/AuthContext";
import logoiclub from "../../assets/logoIclub.webp";
import iclubafuera from "../../assets/iclubfuera.webp";
import { useNotificacion } from "../../hooks/useNotificacion";

export const Login = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mostrarNotificacion, componenteAlerta } = useNotificacion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginController({
      email,
      password,
      mostrarNotificacion,
      setUser,
      navigate,
      setToken,
    });
  };

  return (
  <div className="min-h-dvh w-full bg-gray-50 flex items-center justify-center px-4 py-6 md:py-8 lg:py-0 overflow-hidden"> 
    {componenteAlerta}

    <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden lg:max-h-[90dvh]"> 
      {/* Panel izquierdo - imagen (oculto en mobile) */}
      <div className="hidden lg:block lg:h-full"> 
        <img
          src={iclubafuera}
          alt="Fachada iClub"
          width={1600}
          height={1200}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Panel derecho - login */}
      <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:h-full overflow-hidden"> 
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logoiclub}
            alt="Logo iClub"
            width={300}
            height={200}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </div>

        {/* Títulos */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-900">
          Bienvenido de nuevo a iClub
        </h1>
        <p className="mt-2 text-sm md:text-base text-center text-gray-700">
          Ingresá para acceder a tu cuenta y administrar tu tienda.
        </p>

        {/* Form */}
        <form className="mt-6 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-end">
            <Link to="/restablecer-password" className="text-sm font-medium text-gray-900 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-2.5 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 active:scale-[0.99] transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  </div>
);
};
