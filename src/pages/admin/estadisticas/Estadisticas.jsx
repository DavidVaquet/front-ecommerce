"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardBody,
  Typography,
  Select,
  Option,
  Chip,
  Avatar,
  IconButton,
  Progress,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Alert,
} from "@material-tailwind/react"
import {
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  Star,
  AlertCircle,
  Settings,
  ShoppingCart,
} from "lucide-react"

// Datos de ejemplo para las estadísticas
const DATOS_ESTADISTICAS = {
  metricas_principales: {
    valor_total_inventario: 125450.75,
    productos_bajo_stock: 23,
    productos_sin_stock: 8,
    rotacion_promedio: 4.2,
    variacion_mensual: 12.5,
    productos_criticos: 15,
    total_productos: 1247,
    ventas_mes: 89650.3,
  },
  productos_top: [
    {
      id: 1,
      nombre: "Zapatillas deportivas premium",
      categoria: "Calzado",
      ventas_mes: 145,
      stock_actual: 25,
      valor_stock: 2247.75,
      rotacion: 5.8,
      imagen: "/placeholder.svg?height=40&width=40&text=👟",
    },
    {
      id: 2,
      nombre: "Camiseta algodón orgánico",
      categoria: "Ropa",
      ventas_mes: 89,
      stock_actual: 50,
      valor_stock: 1249.5,
      rotacion: 3.2,
      imagen: "/placeholder.svg?height=40&width=40&text=👕",
    },
    {
      id: 3,
      nombre: "Reloj inteligente Serie 5",
      categoria: "Electrónica",
      ventas_mes: 67,
      stock_actual: 15,
      valor_stock: 2999.85,
      rotacion: 4.5,
      imagen: "/placeholder.svg?height=40&width=40&text=⌚",
    },
    {
      id: 4,
      nombre: "Mochila resistente",
      categoria: "Accesorios",
      ventas_mes: 45,
      stock_actual: 30,
      valor_stock: 899.7,
      rotacion: 2.8,
      imagen: "/placeholder.svg?height=40&width=40&text=🎒",
    },
  ],
  productos_criticos: [
    {
      id: 4,
      nombre: "Auriculares inalámbricos",
      categoria: "Electrónica",
      stock_actual: 2,
      stock_minimo: 10,
      dias_sin_venta: 15,
      estado: "bajo_stock",
    },
    {
      id: 5,
      nombre: "Mochila resistente",
      categoria: "Accesorios",
      stock_actual: 0,
      stock_minimo: 5,
      dias_sin_venta: 8,
      estado: "sin_stock",
    },
    {
      id: 6,
      nombre: "Botella térmica",
      categoria: "Hogar",
      stock_actual: 1,
      stock_minimo: 8,
      dias_sin_venta: 22,
      estado: "critico",
    },
  ],
  ventas_por_categoria: [
    { categoria: "Calzado", ventas: 45230, porcentaje: 35, productos: 156 },
    { categoria: "Ropa", ventas: 32150, porcentaje: 25, productos: 234 },
    { categoria: "Electrónica", ventas: 28900, porcentaje: 22, productos: 89 },
    { categoria: "Accesorios", ventas: 15420, porcentaje: 12, productos: 178 },
    { categoria: "Hogar", ventas: 7800, porcentaje: 6, productos: 67 },
  ],
}

export const Estadisticas = () => {
  const [activeTab, setActiveTab] = useState("resumen")
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("30")
  const [categoriaFiltro, setCategoriaFiltro] = useState("")
  const [cargando, setCargando] = useState(false)
  const [mostrarAlerta, setMostrarAlerta] = useState(false)
  const [mensajeAlerta, setMensajeAlerta] = useState("")

  const { metricas_principales, productos_top, productos_criticos, ventas_por_categoria } = DATOS_ESTADISTICAS

  // Simular carga de datos
  useEffect(() => {
    setCargando(true)
    const timer = setTimeout(() => setCargando(false), 1000)
    return () => clearTimeout(timer)
  }, [periodoSeleccionado, categoriaFiltro])

  const mostrarNotificacion = (mensaje) => {
    setMensajeAlerta(mensaje)
    setMostrarAlerta(true)
    setTimeout(() => setMostrarAlerta(false), 3000)
  }

  const exportarReporte = (tipo) => {
    setCargando(true)
    setTimeout(() => {
      setCargando(false)
      mostrarNotificacion(`Reporte ${tipo} exportado exitosamente`)
    }, 2000)
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "bajo_stock":
        return "amber"
      case "sin_stock":
        return "red"
      case "critico":
        return "red"
      default:
        return "blue-gray"
    }
  }

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Alerta flotante */}
      {mostrarAlerta && (
        <div className="fixed top-4 right-4 z-50">
          <Alert color="green" className="shadow-lg">
            {mensajeAlerta}
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadísticas y Reportes</h1>
            <p className="text-gray-600">Análisis completo de tu inventario y rendimiento de ventas</p>
          </div>
          <div className="flex gap-3">
            <Menu>
              <MenuHandler>
                <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => exportarReporte("PDF")} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Exportar PDF
                </MenuItem>
                <MenuItem onClick={() => exportarReporte("Excel")} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              color="blue"
              className="flex items-center gap-2 normal-case"
              onClick={() => mostrarNotificacion("Datos actualizados")}
              disabled={cargando}
            >
              {cargando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 shadow-sm">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Período de Análisis
              </Typography>
              <Select value={periodoSeleccionado} onChange={(value) => setPeriodoSeleccionado(value)}>
                <Option value="7">Últimos 7 días</Option>
                <Option value="30">Últimos 30 días</Option>
                <Option value="90">Últimos 3 meses</Option>
                <Option value="365">Último año</Option>
              </Select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Categoría
              </Typography>
              <Select value={categoriaFiltro} onChange={(value) => setCategoriaFiltro(value)}>
                <Option value="">Todas las categorías</Option>
                <Option value="calzado">Calzado</Option>
                <Option value="ropa">Ropa</Option>
                <Option value="electronica">Electrónica</Option>
                <Option value="accesorios">Accesorios</Option>
              </Select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Tipo de Reporte
              </Typography>
              <Select>
                <Option value="inventario">Inventario</Option>
                <Option value="ventas">Ventas</Option>
                <Option value="rotacion">Rotación</Option>
                <Option value="rentabilidad">Rentabilidad</Option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button color="blue-gray" className="flex items-center gap-2 normal-case w-full">
                <Filter className="h-4 w-4" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Valor Total Inventario
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  ${metricas_principales.valor_total_inventario.toLocaleString()}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <Typography variant="small" color="green" className="font-medium">
                    +{metricas_principales.variacion_mensual}%
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Productos Bajo Stock
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {metricas_principales.productos_bajo_stock}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <Typography variant="small" color="amber" className="font-medium">
                    Requiere atención
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Ventas del Mes
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  ${metricas_principales.ventas_mes.toLocaleString()}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <Typography variant="small" color="blue" className="font-medium">
                    Tendencia positiva
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Rotación Promedio
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {metricas_principales.rotacion_promedio}x
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <Typography variant="small" color="purple" className="font-medium">
                    Por mes
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs de Análisis */}
      <Card className="shadow-sm">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsHeader className="bg-gray-50">
            <Tab value="resumen" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </Tab>
            <Tab value="productos" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos Top
            </Tab>
            <Tab value="categorias" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Categorías
            </Tab>
            <Tab value="alertas" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas
            </Tab>
          </TabsHeader>

          <TabsBody>
            {/* Tab Resumen */}
            <TabPanel value="resumen" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Ventas por Categoría */}
                <Card className="shadow-sm">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Ventas por Categoría
                      </Typography>
                      <IconButton variant="text" color="blue-gray">
                        <Settings className="h-4 w-4" />
                      </IconButton>
                    </div>
                    <div className="space-y-4">
                      {ventas_por_categoria.map((categoria) => (
                        <div key={categoria.categoria} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {categoria.categoria}
                            </Typography>
                            <div className="flex items-center gap-2">
                              <Typography variant="small" color="gray">
                                ${categoria.ventas.toLocaleString()}
                              </Typography>
                              <Chip value={`${categoria.porcentaje}%`} color="blue" size="sm" variant="ghost" />
                            </div>
                          </div>
                          <Progress value={categoria.porcentaje} color="blue" className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Métricas Adicionales */}
                <Card className="shadow-sm">
                  <CardBody className="p-6">
                    <Typography variant="h6" color="blue-gray" className="font-bold mb-6">
                      Métricas Adicionales
                    </Typography>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Total de Productos
                            </Typography>
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                              {metricas_principales.total_productos}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Productos Críticos
                            </Typography>
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                              {metricas_principales.productos_criticos}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Target className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Eficiencia General
                            </Typography>
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                              87%
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </TabPanel>

            {/* Tab Productos Top */}
            <TabPanel value="productos" className="p-6">
              <Card className="shadow-sm">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h6" color="blue-gray" className="font-bold flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Productos Más Vendidos
                    </Typography>
                    <Button variant="outlined" color="blue-gray" size="sm">
                      Ver Todos
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Producto
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Categoría
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Ventas/Mes
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Stock
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Valor Stock
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Rotación
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos_top.map((producto, index) => (
                          <tr key={producto.id} className="hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Typography variant="small" color="blue-gray" className="font-bold w-6 text-center">
                                    #{index + 1}
                                  </Typography>
                                  <Avatar src={producto.imagen} alt={producto.nombre} size="sm" variant="rounded" />
                                </div>
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                  {producto.nombre}
                                </Typography>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Chip
                                value={producto.categoria}
                                color="blue-gray"
                                size="sm"
                                variant="ghost"
                                className="rounded-full"
                              />
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                  {producto.ventas_mes}
                                </Typography>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Typography variant="small" color="blue-gray">
                                {producto.stock_actual}
                              </Typography>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                ${producto.valor_stock.toLocaleString()}
                              </Typography>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                  {producto.rotacion}x
                                </Typography>
                                <Chip
                                  value={producto.rotacion > 4 ? "Alta" : "Media"}
                                  color={producto.rotacion > 4 ? "green" : "amber"}
                                  size="sm"
                                  variant="ghost"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Tab Categorías */}
            <TabPanel value="categorias" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ventas_por_categoria.map((categoria) => (
                  <Card key={categoria.categoria} className="shadow-sm">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                          {categoria.categoria}
                        </Typography>
                        <Chip value={`${categoria.porcentaje}%`} color="blue" size="lg" variant="gradient" />
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Typography variant="small" color="gray">
                              Ventas Totales
                            </Typography>
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                              ${categoria.ventas.toLocaleString()}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" color="gray">
                              Productos
                            </Typography>
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                              {categoria.productos}
                            </Typography>
                          </div>
                        </div>
                        <Progress value={categoria.porcentaje} color="blue" className="h-3" />
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="gray">
                            Participación en ventas
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {categoria.porcentaje}%
                          </Typography>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </TabPanel>

            {/* Tab Alertas */}
            <TabPanel value="alertas" className="p-6">
              <Card className="shadow-sm border-l-4 border-l-red-500">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <Typography variant="h6" color="red" className="font-bold">
                        Productos que Requieren Atención
                      </Typography>
                      <Typography variant="small" color="gray">
                        {productos_criticos.length} productos necesitan reabastecimiento
                      </Typography>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {productos_criticos.map((producto) => (
                      <Card key={producto.id} className="shadow-sm border">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                  {producto.nombre}
                                </Typography>
                                <Chip
                                  value={producto.estado.replace("_", " ")}
                                  color={getEstadoColor(producto.estado)}
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full capitalize"
                                />
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <Typography variant="small" color="gray">
                                    Categoría
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    {producto.categoria}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="small" color="gray">
                                    Stock Actual
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    {producto.stock_actual}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="small" color="gray">
                                    Stock Mínimo
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    {producto.stock_minimo}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="small" color="gray">
                                    Días sin venta
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    {producto.dias_sin_venta}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <IconButton variant="outlined" color="blue" size="sm">
                                <Eye className="h-4 w-4" />
                              </IconButton>
                              <Button color="deep-orange" size="sm">
                                Reabastecer
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
    </div>
  )
}

export default Estadisticas
