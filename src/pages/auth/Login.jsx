"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginController } from "../../controllers/authController"
import { AuthContext } from "../../context/AuthContext"
import logoiclub from "../../assets/logoIclub.webp"
import iclubafuera from "../../assets/iclubfuera.webp"
import { useNotificacion } from "../../hooks/useNotificacion"
import { Mail, Lock, ArrowRight } from "lucide-react"

export const Login = () => {
  const { setUser, setToken } = useContext(AuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { mostrarNotificacion, componenteAlerta } = useNotificacion()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await loginController({
      email,
      password,
      mostrarNotificacion,
      setUser,
      navigate,
      setToken,
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      {componenteAlerta}

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="hidden lg:flex relative bg-gray-900 min-h-[500px] xl:min-h-[600px]">
          <img
            src={iclubafuera || "/placeholder.svg"}
            alt="Fachada iClub"
            width={1600}
            height={1200}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-transparent" />

          <div className="relative z-10 flex flex-col justify-end p-8 xl:p-12 text-white">
            <h2 className="text-3xl xl:text-4xl font-bold mb-3 xl:mb-4">Gestiona tu negocio desde cualquier lugar</h2>
            <p className="text-base xl:text-lg text-gray-200 leading-relaxed">
              Accede a tu panel de administración y controla tu inventario, ventas y clientes en tiempo real.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12 max-h-screen lg:max-h-none overflow-y-auto lg:overflow-visible">
          <div className="flex justify-center mb-6 lg:mb-8">
            <img
              src={logoiclub || "/placeholder.svg"}
              alt="Logo iClub"
              width={300}
              height={200}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="h-12 sm:h-14 lg:h-16 xl:h-20 w-auto object-contain"
            />
          </div>

          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">Bienvenido de nuevo</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Ingresa tus credenciales para acceder a tu panel de administración
            </p>
          </div>

          <form className="w-full max-w-md mx-auto space-y-4 lg:space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/restablecer-password"
                className="text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* <div className="mt-6 lg:mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link to="/registro" className="font-medium text-gray-900 hover:underline">
                Contáctanos
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  )
}