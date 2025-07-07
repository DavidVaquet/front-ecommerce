"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
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
  Package,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  Store,
  Globe,
  TrendingUp,
  BarChart3,
  Download,
  Receipt,
  MoreVertical,
  Clock,
  MapPin,
  Smartphone,
} from "lucide-react"

// Datos de ejemplo de ventas
const VENTAS = [
  {
    id: "VTA-2024-001",
    fecha: "2024-01-15T14:30:00",
    tipo: "local", // local o ecommerce
    cliente: {
      nombre: "Juan Pérez",
      email: "juan@email.com",
      telefono: "+52 123 456 7890",
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
    descuento: 10.25,
    impuestos: 31.15,
    total: 225.87,
    metodoPago: "Efectivo",
    vendedor: "Ana García",
    sucursal: "Sucursal Centro",
  },
  {
    id: "ECM-2024-002",
    fecha: "2024-01-15T10:15:00",
    tipo: "ecommerce",
    cliente: {
      nombre: "María López",
      email: "maria@email.com",
      telefono: "+52 987 654 3210",
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
    descuento: 0,
    impuestos: 32.0,
    total: 231.99,
    metodoPago: "Tarjeta de Crédito",
    plataforma: "Tienda Online",
    numeroOrden: "ORD-2024-002",
  },
  {
    id: "VTA-2024-003",
    fecha: "2024-01-14T16:45:00",
    tipo: "local",
    cliente: {
      nombre: "Carlos Rodríguez",
      email: "carlos@email.com",
      telefono: "+52 555 123 4567",
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
    descuento: 25.0,
    impuestos: 36.0,
    total: 260.97,
    metodoPago: "Tarjeta de Débito",
    vendedor: "Luis Martín",
    sucursal: "Sucursal Norte",
  },
  {
    id: "ECM-2024-004",
    fecha: "2024-01-14T09:20:00",
    tipo: "ecommerce",
    cliente: {
      nombre: "Ana Fernández",
      email: "ana@email.com",
      telefono: "+52 444 987 6543",
    },
    productos: [
      {
        id: 6,
        nombre: "Botella térmica 500ml",
        precio: 19.99,
        cantidad: 3,
        imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
      },
    ],
    subtotal: 59.97,
    descuento: 5.99,
    impuestos: 8.64,
    total: 62.62,
    metodoPago: "PayPal",
    plataforma: "Marketplace",
    numeroOrden: "MKT-2024-004",
  },
]

export const HistorialVentas = () => {
  const [activeTab, setActiveTab] = useState("todas")
  const [busqueda, setBusqueda] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  // Estadísticas
  const totalVentas = VENTAS.length
  const ventasLocal = VENTAS.filter((v) => v.tipo === "local").length
  const ventasEcommerce = VENTAS.filter((v) => v.tipo === "ecommerce").length

  const totalIngresos = VENTAS.reduce((sum, venta) => sum + venta.total, 0)
  const ingresosLocal = VENTAS.filter((v) => v.tipo === "local").reduce((sum, venta) => sum + venta.total, 0)
  const ingresosEcommerce = VENTAS.filter((v) => v.tipo === "ecommerce").reduce((sum, venta) => sum + venta.total, 0)

  const promedioVenta = totalIngresos / totalVentas

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const ventasFiltradas = VENTAS.filter((venta) => {
    const coincideBusqueda =
      venta.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.cliente.email.toLowerCase().includes(busqueda.toLowerCase())

    const coincideFecha =
      (!fechaInicio || new Date(venta.fecha) >= new Date(fechaInicio)) &&
      (!fechaFin || new Date(venta.fecha) <= new Date(fechaFin))

    if (activeTab === "todas") return coincideBusqueda && coincideFecha
    return coincideBusqueda && coincideFecha && venta.tipo === activeTab
  })

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Historial de Ventas</h1>
            <p className="text-gray-600 mt-1">
              Visualiza y analiza todas las ventas realizadas tanto en local como en e-commerce.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
              <Download className="h-5 w-5" />
              Exportar Reporte
            </Button>
            <Button
              variant="filled"
              color="deep-orange"
              className="flex items-center gap-2 normal-case shadow-md"
              size="lg"
            >
              <BarChart3 className="h-5 w-5" />
              Ver Analytics
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
                  Total Ventas
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {totalVentas}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray">
                  Local: {ventasLocal} | Online: {ventasEcommerce}
                </Typography>
              </div>
              <Progress value={(ventasLocal / totalVentas) * 100} color="blue" />
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Ingresos Totales
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${totalIngresos.toFixed(2)}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Typography variant="small" color="green" className="font-medium">
                +12.5% vs mes anterior
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Ventas Local
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${ingresosLocal.toFixed(2)}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <Store className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="deep-orange" className="font-medium">
                {((ingresosLocal / totalIngresos) * 100).toFixed(1)}% del total
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Ventas E-commerce
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${ingresosEcommerce.toFixed(2)}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Globe className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="purple" className="font-medium">
                {((ingresosEcommerce / totalIngresos) * 100).toFixed(1)}% del total
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
                label="Buscar ventas"
                icon={<Search className="h-5 w-5" />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                label="Fecha inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                icon={<Calendar className="h-5 w-5" />}
              />
            </div>
            <div>
              <Input
                type="date"
                label="Fecha fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                icon={<Calendar className="h-5 w-5" />}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case flex-1">
                <Filter className="h-4 w-4" />
                Más Filtros
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs y Lista de Ventas */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader className="p-2">
            <Tab value="todas" className="text-sm font-medium">
              Todas ({totalVentas})
            </Tab>
            <Tab value="local" className="text-sm font-medium flex items-center gap-2">
              <Store className="h-4 w-4" />
              Local ({ventasLocal})
            </Tab>
            <Tab value="ecommerce" className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              E-commerce ({ventasEcommerce})
            </Tab>
          </TabsHeader>

          <div className="p-6">
            {ventasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Receipt className="h-16 w-16 text-gray-300 mb-4" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron ventas
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta ajustar los filtros o el rango de fechas.
                </Typography>
              </div>
            ) : (
              <div className="space-y-4">
                {ventasFiltradas.map((venta) => (
                  <Card key={venta.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardBody className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Información principal */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                  {venta.id}
                                </Typography>
                                <Chip
                                  value={venta.tipo === "local" ? "Local" : "E-commerce"}
                                  color={venta.tipo === "local" ? "deep-orange" : "purple"}
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full"
                                  icon={
                                    venta.tipo === "local" ? (
                                      <Store className="h-3 w-3" />
                                    ) : (
                                      <Globe className="h-3 w-3" />
                                    )
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatearFecha(venta.fecha)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-4 w-4" />
                                  <span>{venta.metodoPago}</span>
                                </div>
                              </div>
                              {venta.tipo === "local" ? (
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>Vendedor: {venta.vendedor}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{venta.sucursal}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Smartphone className="h-4 w-4" />
                                    <span>Plataforma: {venta.plataforma}</span>
                                  </div>
                                  {venta.numeroOrden && (
                                    <div className="flex items-center gap-1">
                                      <Package className="h-4 w-4" />
                                      <span>Orden: {venta.numeroOrden}</span>
                                    </div>
                                  )}
                                </div>
                              )}
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
                                  <Receipt className="h-4 w-4" />
                                  Imprimir recibo
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2">
                                  <Download className="h-4 w-4" />
                                  Descargar PDF
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
                              Cliente
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <span>
                                <strong>Nombre:</strong> {venta.cliente.nombre}
                              </span>
                              <span>
                                <strong>Email:</strong> {venta.cliente.email}
                              </span>
                              <span>
                                <strong>Teléfono:</strong> {venta.cliente.telefono}
                              </span>
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
                              Productos ({venta.productos.length})
                            </Typography>
                            <div className="space-y-2">
                              {venta.productos.map((producto) => (
                                <div
                                  key={producto.id}
                                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                                >
                                  <Avatar
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    size="sm"
                                    variant="rounded"
                                    className="border border-gray-200"
                                  />
                                  <div className="flex-1">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {producto.nombre}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                      ${producto.precio.toFixed(2)} × {producto.cantidad}
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
                                Resumen de Venta
                              </Typography>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <Typography variant="small" color="blue-gray">
                                    Subtotal:
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    ${venta.subtotal.toFixed(2)}
                                  </Typography>
                                </div>
                                {venta.descuento > 0 && (
                                  <div className="flex justify-between">
                                    <Typography variant="small" color="blue-gray">
                                      Descuento:
                                    </Typography>
                                    <Typography variant="small" color="red" className="font-medium">
                                      -${venta.descuento.toFixed(2)}
                                    </Typography>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <Typography variant="small" color="blue-gray">
                                    Impuestos:
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    ${venta.impuestos.toFixed(2)}
                                  </Typography>
                                </div>
                                <hr className="border-gray-300" />
                                <div className="flex justify-between">
                                  <Typography variant="h6" color="blue-gray">
                                    Total:
                                  </Typography>
                                  <Typography variant="h6" color="deep-orange" className="font-bold">
                                    ${venta.total.toFixed(2)}
                                  </Typography>
                                </div>
                              </div>
                              <div className="mt-4">
                                <Button color="deep-orange" className="w-full" size="sm">
                                  Ver Detalles Completos
                                </Button>
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
