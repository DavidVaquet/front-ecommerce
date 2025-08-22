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
} from "@material-tailwind/react"
import {
  Search,
  Filter,
  Eye,
  Package,
  CreditCard,
  XCircle,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Download,
  Truck,
} from "lucide-react"

// Datos de ejemplo de órdenes
const ORDENES = [
  {
    id: "ORD-2024-001",
    fecha: "2024-01-15",
    cliente: {
      nombre: "Juan Pérez",
      email: "juan@email.com",
      telefono: "+52 123 456 7890",
      direccion: "Av. Principal 123, Ciudad de México",
    },
    productos: [
      {
        id: 1,
        nombre: "Zapatillas deportivas premium",
        precio: 89.99,
        cantidad: 2,
        imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
      },
      {
        id: 2,
        nombre: "Camiseta de algodón orgánico",
        precio: 24.99,
        cantidad: 1,
        imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
      },
    ],
    subtotal: 204.97,
    impuestos: 32.8,
    total: 237.77,
    estado: "pagada",
    metodoPago: "Tarjeta de Crédito",
    numeroSeguimiento: "TRK123456789",
  },
  {
    id: "ORD-2024-002",
    fecha: "2024-01-14",
    cliente: {
      nombre: "María García",
      email: "maria@email.com",
      telefono: "+52 987 654 3210",
      direccion: "Calle Secundaria 456, Guadalajara",
    },
    productos: [
      {
        id: 3,
        nombre: "Reloj inteligente Serie 5",
        precio: 199.99,
        cantidad: 1,
        imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
      },
    ],
    subtotal: 199.99,
    impuestos: 32.0,
    total: 231.99,
    estado: "pendiente",
    metodoPago: "Transferencia",
    numeroSeguimiento: null,
  },
  {
    id: "ORD-2024-003",
    fecha: "2024-01-13",
    cliente: {
      nombre: "Carlos López",
      email: "carlos@email.com",
      telefono: "+52 555 123 4567",
      direccion: "Boulevard Norte 789, Monterrey",
    },
    productos: [
      {
        id: 4,
        nombre: "Auriculares inalámbricos",
        precio: 129.99,
        cantidad: 1,
        imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
      },
      {
        id: 5,
        nombre: "Mochila resistente al agua",
        precio: 59.99,
        cantidad: 2,
        imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
      },
    ],
    subtotal: 249.97,
    impuestos: 40.0,
    total: 289.97,
    estado: "rechazada",
    metodoPago: "Tarjeta de Débito",
    numeroSeguimiento: null,
  },
]

export const Ordenes = () => {
  const [activeTab, setActiveTab] = useState("todas")
  const [busqueda, setBusqueda] = useState("")
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)

  // Estadísticas
  const totalOrdenes = ORDENES.length
  const ordenesPagadas = ORDENES.filter((o) => o.estado === "pagada").length
  const ordenesPendientes = ORDENES.filter((o) => o.estado === "pendiente").length
  const ordenesRechazadas = ORDENES.filter((o) => o.estado === "rechazada").length

  const totalVentas = ORDENES.filter((o) => o.estado === "pagada").reduce((sum, orden) => sum + orden.total, 0)

  const getChipColor = (estado) => {
    switch (estado) {
      case "pagada":
        return "green"
      case "pendiente":
        return "amber"
      case "rechazada":
        return "red"
      default:
        return "blue-gray"
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "pagada":
        return <CheckCircle className="h-4 w-4" />
      case "pendiente":
        return <Clock className="h-4 w-4" />
      case "rechazada":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const ordenesFiltradas = ORDENES.filter((orden) => {
    const coincideBusqueda =
      orden.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.cliente.email.toLowerCase().includes(busqueda.toLowerCase())

    if (activeTab === "todas") return coincideBusqueda
    return coincideBusqueda && orden.estado === activeTab
  })

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Órdenes del E-commerce</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y supervisa todas las órdenes de tu tienda online en tiempo real.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
              <Download className="h-5 w-5" />
              Exportar
            </Button>
            <Button
              variant="filled"
              color="deep-orange"
              className="flex items-center gap-2 normal-case shadow-md"
              size="lg"
            >
              <Package className="h-5 w-5" />
              Nueva Orden
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
                  Total Órdenes
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {totalOrdenes}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="blue" className="font-medium">
                Últimas 24h
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Órdenes Pagadas
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {ordenesPagadas}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="green" className="font-medium">
                {((ordenesPagadas / totalOrdenes) * 100).toFixed(0)}% del total
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Pendientes
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {ordenesPendientes}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="amber" className="font-medium">
                Requieren atención
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Total Ventas
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${totalVentas.toFixed(2)}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="deep-orange" className="font-medium">
                Solo órdenes pagadas
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8 shadow-sm border border-gray-200">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-72">
              <Input
                label="Buscar órdenes"
                icon={<Search className="h-5 w-5" />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Select label="Ordenar por" className="w-48">
                <Option>Fecha (más reciente)</Option>
                <Option>Fecha (más antigua)</Option>
                <Option>Total (mayor a menor)</Option>
                <Option>Total (menor a mayor)</Option>
                <Option>Cliente (A-Z)</Option>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs y Lista de Órdenes */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader className="p-2">
            <Tab value="todas" className="text-sm font-medium">
              Todas ({totalOrdenes})
            </Tab>
            <Tab value="pagada" className="text-sm font-medium">
              Pagadas ({ordenesPagadas})
            </Tab>
            <Tab value="pendiente" className="text-sm font-medium">
              Pendientes ({ordenesPendientes})
            </Tab>
            <Tab value="rechazada" className="text-sm font-medium">
              Rechazadas ({ordenesRechazadas})
            </Tab>
          </TabsHeader>

          <div className="p-6">
            {ordenesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron órdenes
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta con otros filtros o términos de búsqueda.
                </Typography>
              </div>
            ) : (
              <div className="space-y-4">
                {ordenesFiltradas.map((orden) => (
                  <Card key={orden.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardBody className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Información principal de la orden */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                  {orden.id}
                                </Typography>
                                <Chip
                                  value={orden.estado}
                                  color={getChipColor(orden.estado)}
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full capitalize"
                                  icon={getEstadoIcon(orden.estado)}
                                />
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(orden.fecha).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-4 w-4" />
                                  <span>{orden.metodoPago}</span>
                                </div>
                                {orden.numeroSeguimiento && (
                                  <div className="flex items-center gap-1">
                                    <Truck className="h-4 w-4" />
                                    <span>{orden.numeroSeguimiento}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Menu>
                              <MenuHandler>
                                <IconButton variant="text" color="blue-gray">
                                  <MoreVertical className="h-4 w-4" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList>
                                <MenuItem className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Ver detalles
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2">
                                  <Download className="h-4 w-4" />
                                  Descargar factura
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Enviar email
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>

                          {/* Información del cliente */}
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium mb-2 flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              Información del Cliente
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-gray-500" />
                                <span>{orden.cliente.nombre}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <span>{orden.cliente.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span>{orden.cliente.telefono}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="truncate">{orden.cliente.direccion}</span>
                              </div>
                            </div>
                          </div>

                          {/* Productos */}
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium mb-3 flex items-center gap-2"
                            >
                              <Package className="h-4 w-4" />
                              Productos ({orden.productos.length})
                            </Typography>
                            <div className="space-y-3">
                              {orden.productos.map((producto) => (
                                <div
                                  key={producto.id}
                                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                                >
                                  <Avatar
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    size="md"
                                    variant="rounded"
                                    className="border border-gray-200"
                                  />
                                  <div className="flex-1">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {producto.nombre}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                      Cantidad: {producto.cantidad} | Precio: ${producto.precio.toFixed(2)}
                                    </Typography>
                                  </div>
                                  <Typography variant="small" color="blue-gray" className="font-bold">
                                    ${(producto.precio * producto.cantidad).toFixed(2)}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Resumen financiero */}
                        <div className="lg:w-80">
                          <Card className="bg-gray-50 border border-gray-200">
                            <CardBody className="p-4">
                              <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Resumen Financiero
                              </Typography>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <Typography variant="small" color="blue-gray">
                                    Subtotal:
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    ${orden.subtotal.toFixed(2)}
                                  </Typography>
                                </div>
                                <div className="flex justify-between">
                                  <Typography variant="small" color="blue-gray">
                                    Impuestos:
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    ${orden.impuestos.toFixed(2)}
                                  </Typography>
                                </div>
                                <hr className="border-gray-300" />
                                <div className="flex justify-between">
                                  <Typography variant="h6" color="blue-gray">
                                    Total:
                                  </Typography>
                                  <Typography variant="h6" color="deep-orange" className="font-bold">
                                    ${orden.total.toFixed(2)}
                                  </Typography>
                                </div>
                              </div>
                              <div className="mt-4 space-y-2">
                                <Button color="deep-orange" className="w-full" size="sm">
                                  Ver Detalles
                                </Button>
                                {orden.estado === "pendiente" && (
                                  <Button variant="outlined" color="green" className="w-full" size="sm">
                                    Marcar como Pagada
                                  </Button>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
