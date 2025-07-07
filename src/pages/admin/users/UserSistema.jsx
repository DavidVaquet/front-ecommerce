"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  TabsHeader,
  Tab,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Progress,
} from "@material-tailwind/react"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Users,
  Star,
  Globe,
  Store,
  Mail,
  Phone,
  MoreVertical,
  Download,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Activity,
} from "lucide-react"

// Datos de ejemplo de usuarios
const USUARIOS = [
  {
    id: 1,
    nombre: "Juan Pérez",
    apellido: "García",
    email: "juan.perez@email.com",
    telefono: "+52 123 456 7890",
    fechaRegistro: "2024-01-10",
    ultimaActividad: "2024-01-15T14:30:00",
    origen: "ecommerce", // ecommerce o manual
    estado: "activo", // activo, inactivo, suspendido
    tipoCliente: "vip",
    totalCompras: 15,
    montoTotal: 2450.75,
    direccion: "Av. Principal 123, Ciudad de México",
    fechaNacimiento: "1985-03-15",
    avatar: "https://v0.dev/placeholder.svg?height=200&width=200",
    notas: "Cliente frecuente, prefiere productos premium",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "López",
    email: "maria.lopez@email.com",
    telefono: "+52 987 654 3210",
    fechaRegistro: "2024-01-12",
    ultimaActividad: "2024-01-14T10:15:00",
    origen: "manual",
    estado: "activo",
    tipoCliente: "regular",
    totalCompras: 3,
    montoTotal: 450.25,
    direccion: "Calle Secundaria 456, Guadalajara",
    fechaNacimiento: "1990-07-22",
    avatar: "https://v0.dev/placeholder.svg?height=200&width=200",
    notas: "Agregada manualmente en tienda física",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos.rodriguez@email.com",
    telefono: "+52 555 123 4567",
    fechaRegistro: "2024-01-08",
    ultimaActividad: "2024-01-13T16:45:00",
    origen: "ecommerce",
    estado: "inactivo",
    tipoCliente: "mayorista",
    totalCompras: 8,
    montoTotal: 1850.5,
    direccion: "Boulevard Norte 789, Monterrey",
    fechaNacimiento: "1978-11-30",
    avatar: "https://v0.dev/placeholder.svg?height=200&width=200",
    notas: "Cliente mayorista con descuentos especiales",
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "Fernández",
    email: "ana.fernandez@email.com",
    telefono: "+52 444 987 6543",
    fechaRegistro: "2024-01-14",
    ultimaActividad: "2024-01-15T09:20:00",
    origen: "ecommerce",
    estado: "activo",
    tipoCliente: "regular",
    totalCompras: 1,
    montoTotal: 125.99,
    direccion: "Colonia Centro 321, Puebla",
    fechaNacimiento: "1995-05-18",
    avatar: "https://v0.dev/placeholder.svg?height=200&width=200",
    notas: "Cliente nuevo, primera compra reciente",
  },
  {
    id: 5,
    nombre: "Luis",
    apellido: "Martínez",
    email: "luis.martinez@email.com",
    telefono: "+52 333 456 7890",
    fechaRegistro: "2024-01-05",
    ultimaActividad: "2024-01-12T12:00:00",
    origen: "manual",
    estado: "suspendido",
    tipoCliente: "regular",
    totalCompras: 0,
    montoTotal: 0,
    direccion: "Zona Industrial 654, Tijuana",
    fechaNacimiento: "1982-09-10",
    avatar: "https://v0.dev/placeholder.svg?height=200&width=200",
    notas: "Cuenta suspendida por problemas de pago",
  },
]

export const UserSistema = () => {
  const [activeTab, setActiveTab] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("")

  // Estadísticas
  const totalUsuarios = USUARIOS.length
  const usuariosEcommerce = USUARIOS.filter((u) => u.origen === "ecommerce").length
  const usuariosManuales = USUARIOS.filter((u) => u.origen === "manual").length
  const usuariosActivos = USUARIOS.filter((u) => u.estado === "activo").length
  const usuariosVip = USUARIOS.filter((u) => u.tipoCliente === "vip").length

  const totalGastado = USUARIOS.reduce((sum, usuario) => sum + usuario.montoTotal, 0)
  const promedioGasto = totalGastado / totalUsuarios

  const getChipColor = (estado) => {
    switch (estado) {
      case "activo":
        return "green"
      case "inactivo":
        return "amber"
      case "suspendido":
        return "red"
      default:
        return "blue-gray"
    }
  }

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "vip":
        return <Crown className="h-4 w-4" />
      case "mayorista":
        return <Users className="h-4 w-4" />
      default:
        return <UserCheck className="h-4 w-4" />
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES")
  }

  const formatearFechaHora = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const usuariosFiltrados = USUARIOS.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.telefono.includes(busqueda)

    const coincideEstado = !filtroEstado || usuario.estado === filtroEstado
    const coincideTipo = !filtroTipo || usuario.tipoCliente === filtroTipo

    if (activeTab === "todos") return coincideBusqueda && coincideEstado && coincideTipo
    return coincideBusqueda && coincideEstado && coincideTipo && usuario.origen === activeTab
  })

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuarios del Sistema</h1>
            <p className="text-gray-600 mt-1">
              Gestiona todos los usuarios registrados tanto del e-commerce como agregados manualmente.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
              <Download className="h-5 w-5" />
              Exportar Lista
            </Button>
            <Button
              variant="filled"
              color="deep-orange"
              className="flex items-center gap-2 normal-case shadow-md"
              size="lg"
            >
              <UserPlus className="h-5 w-5" />
              Nuevo Usuario
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
                  Total Usuarios
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {totalUsuarios}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray">
                  Online: {usuariosEcommerce} | Manual: {usuariosManuales}
                </Typography>
              </div>
              <Progress value={(usuariosEcommerce / totalUsuarios) * 100} color="blue" />
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Usuarios Activos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {usuariosActivos}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="green" className="font-medium">
                {((usuariosActivos / totalUsuarios) * 100).toFixed(1)}% del total
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Usuarios VIP
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {usuariosVip}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <Typography variant="small" color="yellow" className="font-medium">
                Clientes premium
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Gasto Promedio
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${promedioGasto.toFixed(2)}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <Shield className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="deep-orange" className="font-medium">
                Por usuario registrado
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8 shadow-sm border border-gray-200">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                label="Buscar usuarios"
                icon={<Search className="h-5 w-5" />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div>
              <Select label="Estado" value={filtroEstado} onChange={(value) => setFiltroEstado(value)}>
                <Option value="">Todos los estados</Option>
                <Option value="activo">Activo</Option>
                <Option value="inactivo">Inactivo</Option>
                <Option value="suspendido">Suspendido</Option>
              </Select>
            </div>
            <div>
              <Select label="Tipo de Cliente" value={filtroTipo} onChange={(value) => setFiltroTipo(value)}>
                <Option value="">Todos los tipos</Option>
                <Option value="regular">Regular</Option>
                <Option value="vip">VIP</Option>
                <Option value="mayorista">Mayorista</Option>
              </Select>
            </div>
            <div>
              <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case w-full">
                <Filter className="h-4 w-4" />
                Filtros Avanzados
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs y Lista de Usuarios */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader className="p-2">
            <Tab value="todos" className="text-sm font-medium">
              Todos ({totalUsuarios})
            </Tab>
            <Tab value="ecommerce" className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              E-commerce ({usuariosEcommerce})
            </Tab>
            <Tab value="manual" className="text-sm font-medium flex items-center gap-2">
              <Store className="h-4 w-4" />
              Manual ({usuariosManuales})
            </Tab>
          </TabsHeader>

          <div className="p-6">
            {usuariosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-gray-300 mb-4" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron usuarios
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta ajustar los filtros de búsqueda.
                </Typography>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Usuario
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Contacto
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Origen
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Estado
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Compras
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Última Actividad
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Acciones
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={usuario.avatar}
                              alt={`${usuario.nombre} ${usuario.apellido}`}
                              size="md"
                              className="border border-gray-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                  {usuario.nombre} {usuario.apellido}
                                </Typography>
                                {usuario.tipoCliente === "vip" && <Crown className="h-4 w-4 text-yellow-500" />}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Chip
                                  value={usuario.tipoCliente}
                                  color={usuario.tipoCliente === "vip" ? "yellow" : "blue"}
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full capitalize"
                                  icon={getTipoIcon(usuario.tipoCliente)}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-500" />
                              <Typography variant="small" color="blue-gray">
                                {usuario.email}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <Typography variant="small" color="gray">
                                {usuario.telefono}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Chip
                            value={usuario.origen === "ecommerce" ? "E-commerce" : "Manual"}
                            color={usuario.origen === "ecommerce" ? "purple" : "deep-orange"}
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                            icon={
                              usuario.origen === "ecommerce" ? (
                                <Globe className="h-3 w-3" />
                              ) : (
                                <Store className="h-3 w-3" />
                              )
                            }
                          />
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Chip
                            value={usuario.estado}
                            color={getChipColor(usuario.estado)}
                            size="sm"
                            variant="ghost"
                            className="rounded-full capitalize"
                          />
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="space-y-1">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {usuario.totalCompras} compras
                            </Typography>
                            <Typography variant="small" color="gray">
                              ${usuario.montoTotal.toFixed(2)}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="space-y-1">
                            <Typography variant="small" color="blue-gray">
                              {formatearFechaHora(usuario.ultimaActividad)}
                            </Typography>
                            <Typography variant="small" color="gray">
                              Registro: {formatearFecha(usuario.fechaRegistro)}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex gap-2">
                            <IconButton variant="text" color="blue" size="sm">
                              <Eye className="h-4 w-4" />
                            </IconButton>
                            <IconButton variant="text" color="blue-gray" size="sm">
                              <Edit className="h-4 w-4" />
                            </IconButton>
                            <Menu>
                              <MenuHandler>
                                <IconButton variant="text" color="blue-gray" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList>
                                <MenuItem className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Enviar email
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2">
                                  <UserX className="h-4 w-4" />
                                  Suspender cuenta
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2 text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                  Eliminar usuario
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
