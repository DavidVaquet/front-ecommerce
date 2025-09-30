"use client"

import { useState } from "react"
import { Card, CardBody, Typography, Input, Button, Alert } from "@material-tailwind/react"
import { Lock, Key, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff, Shield, Mail } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useNotificacion } from "../../hooks/useNotificacion"
import { forgotPassword, recoveryPassword } from "../../services/authServices"


export const RestablecerContrasena = () => {
  const { token } = useParams() 
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)

  // estados para "reset con token"
  const [nuevaContrasena, setNuevaContrasena] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // estados para "enviar email"
  const [email, setEmail] = useState("")
  const {mostrarNotificacion, componenteAlerta } = useNotificacion();

  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
  const validarContrasena = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)

  // --- Handlers ---
  const handleEnviarEmail = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      mostrarNotificacion("error", "Ingresá un email válido")
      return
    }
    setCargando(true)
    try {
      const res = await forgotPassword(email)
      mostrarNotificacion("success", res?.msg || "Si el email es válido, te enviamos un correo con instrucciones.")
    } catch(error) {
      // respuesta neutral
      mostrarNotificacion('error', error.message || 'Ocurrió un error, intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  const handleCambiarContrasena = async () => {
    if (!token) {
      mostrarNotificacion("error", "Token ausente. Solicitá un nuevo enlace desde ‘Olvidé mi contraseña’.")
      return
    }
    if (!nuevaContrasena.trim() || !confirmarContrasena.trim()) {
      mostrarNotificacion("error", "Por favor completá todos los campos")
      return
    }
    if (!validarContrasena(nuevaContrasena)) {
      mostrarNotificacion("error", "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número")
      return
    }
    if (nuevaContrasena !== confirmarContrasena) {
      mostrarNotificacion("error", "Las contraseñas no coinciden")
      return
    }

    setCargando(true)
    try {
      const res = await recoveryPassword({ token, password: nuevaContrasena })
      mostrarNotificacion("success", res?.msg || "Contraseña cambiada exitosamente")
      // opcional: redirigir al login
      setTimeout(() => navigate("/login"), 2000)
    } catch (e) {
      mostrarNotificacion("error", e.message || "Enlace inválido o expirado")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-deep-orange-50 flex items-center justify-center p-4">
      {/* Alerta flotante */}
      {componenteAlerta}

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-deep-orange-500 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            {token ? "Restablecer Contraseña" : "Recuperar Contraseña"}
          </Typography>
          <Typography color="gray" className="text-base">
            {token
              ? "Creá una nueva contraseña segura para tu cuenta"
              : "Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña"}
          </Typography>
        </div>

        <Card className="shadow-xl border border-gray-100">
          <CardBody className="p-8">
            {token ? (

              <div className="space-y-6">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Nueva Contraseña
                  </Typography>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      size="lg"
                      placeholder="Mínimo 6 caracteres"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      className="!border-gray-300 focus:!border-deep-orange-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Confirmar Contraseña
                  </Typography>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      size="lg"
                      placeholder="Repetí tu contraseña"
                      value={confirmarContrasena}
                      onChange={(e) => setConfirmarContrasena(e.target.value)}
                      className="!border-gray-300 focus:!border-deep-orange-500 pr-10"
                      onKeyDown={(e) => e.key === "Enter" && handleCambiarContrasena()}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                    Requisitos de la contraseña:
                  </Typography>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${nuevaContrasena.length >= 6 ? "bg-green-500" : "bg-gray-300"}`} />
                      Mínimo 6 caracteres
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(nuevaContrasena) ? "bg-green-500" : "bg-gray-300"}`} />
                      Al menos una mayúscula
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(nuevaContrasena) ? "bg-green-500" : "bg-gray-300"}`} />
                      Al menos una minúscula
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(nuevaContrasena) ? "bg-green-500" : "bg-gray-300"}`} />
                      Al menos un número
                    </li>
                  </ul>
                </div>

                <Button color="deep-orange" size="lg" className="w-full shadow-md" onClick={handleCambiarContrasena} disabled={cargando}>
                  {cargando ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>

                <div className="text-center">
                  <Button variant="text" color="blue-gray" className="flex items-center gap-2 mx-auto" onClick={() => navigate("/login")}>
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio de sesión
                  </Button>
                </div>
              </div>
            ) : (
              // ------- Vista sin token: enviar email -------
              <form onSubmit={handleEnviarEmail} className="space-y-6">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Email de tu cuenta
                  </Typography>
                  <Input
                    type="email"
                    size="lg"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-5 w-5" />}
                    className="!border-gray-300 focus:!border-deep-orange-500"
                    required
                  />
                  <Typography color="gray" className="text-xs mt-2">
                    Te enviaremos un enlace para restablecer tu contraseña. Si no lo recibís, revisá tu carpeta de spam.
                  </Typography>
                </div>

                <Button type="submit" color="deep-orange" size="lg" className="w-full shadow-md" disabled={cargando}>
                  {cargando ? "Enviando..." : "Enviar instrucciones"}
                </Button>

                <div className="text-center">
                  <Button variant="text" color="blue-gray" className="flex items-center gap-2 mx-auto" onClick={() => navigate("/login")}>
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio de sesión
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Typography color="gray" className="text-sm">
            ¿Necesitás ayuda?{" "}
            <a href="mailto:soporte@iclub.com" className="text-deep-orange-500 font-medium hover:underline">
              Contactá al soporte
            </a>
          </Typography>
        </div>
      </div>
    </div>
  )
}
