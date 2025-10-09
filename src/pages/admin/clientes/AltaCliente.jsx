"use client"

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  Input,
  Select,
  Option,
  Textarea,
  Switch,
  Chip,
  Alert,
} from "@material-tailwind/react"
import {
  UserPlus,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  User,
  Building,
} from "lucide-react"
import { useClienteMutation } from "../../../hooks/useClientesMutation";
import { useClienteEstadisticas } from "../../../hooks/useClientes";

export const AltaCliente = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    tipo_cliente: "regular",
    es_vip: false,
    direccion: "",
    ciudad: "",
    codigo_postal: "",
    pais: "Argentina",
    notas: "",
  })

  // NOTIFICACIONES
  const [mostrarAlerta, setMostrarAlerta] = useState(false)
  const [tipoAlerta, setTipoAlerta] = useState("success")
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  // USECLIENTES MUTATION
  const { crearCliente } = useClienteMutation();

  // TRAER ESTADISTICAS DESDE REACT QUERY
  const filtroCategoria = useMemo(() => ({
    scope: 'alta'
  }), [])
  const { data } = useClienteEstadisticas(filtroCategoria);
  // Estadísticas
  const clientes_hoy = data?.nuevos_hoy ?? 0;
  const clientes_hoy_tienda = data?.nuevos_hoy_tienda ?? 0;
  const clientes_hoy_online = data?.altas_hoy_online ?? 0;
  const clientes_incompletos = data?.incompletos ?? 0;
  const porcNuevosHoy = data?.nuevos_hoy_tienda ?? 0;
  const porClientesIncompletos = data?.clientes_incompletos ?? 0;


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const mostrarNotificacion = (tipo, mensaje) => {
    setTipoAlerta(tipo)
    setMensajeAlerta(mensaje)
    setMostrarAlerta(true)
    setTimeout(() => setMostrarAlerta(false), 3000)
  }

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      mostrarNotificacion("error", "El nombre es obligatorio")
      return false
    }
    if (!formData.apellido.trim()) {
      mostrarNotificacion("error", "El apellido es obligatorio")
      return false
    }
    if (!formData.email.trim()) {
      mostrarNotificacion("error", "El email es obligatorio")
      return false
    }
    if (!formData.telefono.trim()) {
      mostrarNotificacion("error", "El teléfono es obligatorio")
      return false
    }
    return true
  }

  const resetFormulario = () => {
    setTimeout(() => {
      setFormData({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          fechaNacimiento: "",
          tipoCliente: "regular",
          esVip: false,
          direccion: "",
          ciudad: "",
          codigoPostal: "",
          pais: "Argentina",
          notas: "",
        })
    }, 500);
  }

  const handleCreateClient = async (e) => {
    try {
      e.preventDefault();
      if (!validarFormulario()) return
      await crearCliente.mutateAsync(formData);
      mostrarNotificacion("success", "Cliente registrado exitosamente");
      resetFormulario();
    } catch (error) {
      console.error(error);
      mostrarNotificacion(error.message || 'Error al crear el cliente');
    }
  }

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Alerta flotante */}
      {mostrarAlerta && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Alert
            color={tipoAlerta === "success" ? "green" : "red"}
            icon={tipoAlerta === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            className="shadow-lg"
          >
            {mensajeAlerta}
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Registrar Nuevo Cliente</h1>
            <p className="text-gray-600 mt-1">
              Agrega la información completa del cliente para mejorar la experiencia de compra.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outlined" size="md" color="blue-gray" className="flex items-center gap-2 uppercase">
              <Users className="h-5 w-5" />
              Ver Clientes
            </Button>
            <Button
              variant="filled"
              color="deep-orange"
              className="flex items-center gap-2 uppercase shadow-md"
              size="md"
            >
              <UserPlus className="h-5 w-5" />
              Reporte de clientes
            </Button>
          </div>
        </div>
      </div>

      {/* Cards informativas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Total Clientes Hoy
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {clientes_hoy}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="green" className="font-medium">
                +5.2% este mes
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Nuevos Hoy - Tienda
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {clientes_hoy_tienda}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="blue" className="font-medium">
                {porcNuevosHoy}% del total
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Nuevos Hoy - Online
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {clientes_hoy_online}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-green-500" />
              <Typography variant="small" color="green" className="font-medium">
                Hoy
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Clientes Incompletos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {clientes_incompletos}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="deep-orange" className="font-medium">
                {porClientesIncompletos}% activos
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Formulario Principal */}
      <Card className="w-full shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleCreateClient}>
        <CardHeader color="white" floated={false} shadow={false} className="m-0 p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-deep-orange-50">
              <User className="h-6 w-6 text-deep-orange-500" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" className="uppercase">
                Información del Cliente
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm">
                Completa todos los campos para crear el perfil del cliente.
              </Typography>
            </div>
          </div>
        </CardHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda - Información Personal */}
            <div className="space-y-6">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </Typography>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Nombre*
                      </Typography>
                      <Input
                        size="lg"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        className="!border-gray-300 focus:!border-deep-orange-500"
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Apellido*
                      </Typography>
                      <Input
                        size="lg"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange("apellido", e.target.value)}
                        className="!border-gray-300 focus:!border-deep-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      Email*
                    </Typography>
                    <Input
                      type="email"
                      size="lg"
                      placeholder="cliente@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="!border-gray-300 focus:!border-deep-orange-500"
                      icon={<Mail className="h-5 w-5" />}
                    />
                  </div>

                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      Teléfono*
                    </Typography>
                    <Input
                      type="tel"
                      size="lg"
                      placeholder="+52 123 456 7890"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                      className="!border-gray-300 focus:!border-deep-orange-500"
                      icon={<Phone className="h-5 w-5" />}
                    />
                  </div>

                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      Fecha de Nacimiento
                    </Typography>
                    <Input
                      type="date"
                      size="lg"
                      value={formData.fecha_nacimiento}
                      onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)}
                      className="!border-gray-300 focus:!border-deep-orange-500"
                      icon={<Calendar className="h-5 w-5" />}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Tipo de Cliente
                </Typography>
                <div className="space-y-4">
                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      Categoría
                    </Typography>
                    <Select
                      label="Seleccionar tipo"
                      value={formData.tipo_cliente}
                      onChange={(value) => handleInputChange("tipo_cliente", value)}
                    >
                      <Option value="regular">Cliente Regular</Option>
                      <Option value="mayorista">Cliente Mayorista</Option>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Cliente VIP
                        </Typography>
                        <Typography variant="small" color="gray">
                          Acceso a descuentos especiales y beneficios exclusivos
                        </Typography>
                      </div>
                    </div>
                    <Switch
                      checked={formData.es_vip}
                      onChange={(e) => handleInputChange("es_vip", e.target.checked)}
                      color="deep-orange"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Dirección y Notas */}
            <div className="space-y-6">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección
                </Typography>
                <div className="space-y-4">
                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      Dirección Completa
                    </Typography>
                    <Input
                      label="Calle, número, departamento..."
                      value={formData.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                      className="!border-gray-300"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Ciudad
                      </Typography>
                      <Input
                        size="lg"
                        placeholder="Ciudad"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange("ciudad", e.target.value)}
                        className="!border-gray-300 focus:!border-deep-orange-500"
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Código Postal
                      </Typography>
                      <Input
                        size="lg"
                        placeholder="12345"
                        value={formData.codigo_postal}
                        onChange={(e) => handleInputChange("codigo_postal", e.target.value)}
                        className="!border-gray-300 focus:!border-deep-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      País
                    </Typography>
                    <Select
                      label="Seleccionar país"
                      value={formData.pais}
                      onChange={(value) => handleInputChange("pais", value)}
                    >
                      <Option value="Argentina">Argentina</Option>
                      <Option value="México">México</Option>
                      <Option value="Estados Unidos">Estados Unidos</Option>
                      <Option value="Canadá">Canadá</Option>
                      <Option value="España">España</Option>
                      <Option value="Colombia">Colombia</Option>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información Adicional
                </Typography>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Notas del Cliente
                  </Typography>
                  <Textarea
                    label="Preferencias, observaciones especiales..."
                    value={formData.notas}
                    onChange={(e) => handleInputChange("notas", e.target.value)}
                    className="!border-gray-300"
                    rows={4}
                  />
                </div>
              </div>

              {/* Preview del cliente */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                  Vista previa del cliente:
                </Typography>
                <div className="space-y-1">
                  <Typography variant="small" color="blue-gray">
                    <strong>Nombre:</strong> {formData.nombre} {formData.apellido}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    <strong>Email:</strong> {formData.email}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    <strong>Teléfono:</strong> {formData.telefono}
                  </Typography>
                  <div className="flex items-center gap-2 mt-2">
                    <Chip size="sm" value={formData.tipoCliente} color="blue" className="capitalize" />
                    {formData.esVip && (
                      <Chip size="sm" value="VIP" color="yellow" icon={<Star className="h-3 w-3" />} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardFooter className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button variant="text" color="blue-gray" onClick={resetFormulario}>
            Cancelar
          </Button>
          <div className="flex gap-3">
            <Button color="deep-orange" className="shadow-md" type="submit" disabled={crearCliente.isPending}>
              Guardar Cliente
            </Button>
          </div>
        </CardFooter>
        </form>
      </Card>
    </div>
  )
}
