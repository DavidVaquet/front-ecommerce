"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardBody,
  Typography,
  Select,
  Option,
  Chip,
  IconButton,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Alert,
  Input,
  Switch,
  Radio,
} from "@material-tailwind/react"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  Settings,
  Clock,
  Share2,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Copy,
} from "lucide-react"

// Datos de ejemplo para los reportes
const TIPOS_REPORTES = [
  {
    id: "inventario",
    nombre: "Reporte de Inventario",
    descripcion: "Estado actual del inventario con valores y cantidades",
    icono: Package,
    categoria: "Inventario",
    tiempo_estimado: "2-3 min",
    formatos: ["PDF", "Excel", "CSV"],
  },
  {
    id: "ventas",
    nombre: "Reporte de Ventas",
    descripcion: "Análisis detallado de ventas por período",
    icono: BarChart3,
    categoria: "Ventas",
    tiempo_estimado: "1-2 min",
    formatos: ["PDF", "Excel"],
  },
  {
    id: "productos_criticos",
    nombre: "Productos Críticos",
    descripcion: "Productos con bajo stock o sin movimiento",
    icono: AlertTriangle,
    categoria: "Alertas",
    tiempo_estimado: "1 min",
    formatos: ["PDF", "Excel", "CSV"],
  },
  {
    id: "rentabilidad",
    nombre: "Análisis de Rentabilidad",
    descripcion: "Rentabilidad por producto y categoría",
    icono: DollarSign,
    categoria: "Financiero",
    tiempo_estimado: "3-4 min",
    formatos: ["PDF", "Excel"],
  },
  {
    id: "rotacion",
    nombre: "Rotación de Inventario",
    descripcion: "Análisis de rotación y movimiento de productos",
    icono: TrendingUp,
    categoria: "Inventario",
    tiempo_estimado: "2-3 min",
    formatos: ["PDF", "Excel"],
  },
  {
    id: "clientes",
    nombre: "Reporte de Clientes",
    descripcion: "Análisis de comportamiento y segmentación de clientes",
    icono: Users,
    categoria: "Clientes",
    tiempo_estimado: "2 min",
    formatos: ["PDF", "Excel", "CSV"],
  },
]

const HISTORIAL_REPORTES = [
  {
    id: 1,
    nombre: "Reporte de Inventario - Diciembre 2024",
    tipo: "inventario",
    fecha_generacion: "2024-12-15 10:30",
    formato: "PDF",
    estado: "completado",
    tamaño: "2.4 MB",
    generado_por: "Admin",
  },
  {
    id: 2,
    nombre: "Ventas Mensuales - Noviembre 2024",
    tipo: "ventas",
    fecha_generacion: "2024-12-01 09:15",
    formato: "Excel",
    estado: "completado",
    tamaño: "1.8 MB",
    generado_por: "Admin",
  },
  {
    id: 3,
    nombre: "Productos Críticos - Semanal",
    tipo: "productos_criticos",
    fecha_generacion: "2024-12-14 08:00",
    formato: "PDF",
    estado: "programado",
    tamaño: "-",
    generado_por: "Sistema",
  },
  {
    id: 4,
    nombre: "Análisis de Rentabilidad Q4",
    tipo: "rentabilidad",
    fecha_generacion: "2024-12-10 14:20",
    formato: "PDF",
    estado: "error",
    tamaño: "-",
    generado_por: "Admin",
  },
]

const REPORTES_PROGRAMADOS = [
  {
    id: 1,
    nombre: "Inventario Semanal",
    tipo: "inventario",
    frecuencia: "Semanal",
    dia: "Lunes",
    hora: "08:00",
    formato: "PDF",
    activo: true,
    ultimo_envio: "2024-12-09",
  },
  {
    id: 2,
    nombre: "Ventas Mensuales",
    tipo: "ventas",
    frecuencia: "Mensual",
    dia: "1",
    hora: "09:00",
    formato: "Excel",
    activo: true,
    ultimo_envio: "2024-12-01",
  },
  {
    id: 3,
    nombre: "Productos Críticos",
    tipo: "productos_criticos",
    frecuencia: "Diario",
    dia: "Todos",
    hora: "07:30",
    formato: "PDF",
    activo: false,
    ultimo_envio: "2024-12-05",
  },
]

export const Reportes = () => {
  const [activeTab, setActiveTab] = useState("generar")
  const [reporteSeleccionado, setReporteSeleccionado] = useState("")
  const [formatoSeleccionado, setFormatoSeleccionado] = useState("PDF")
  const [periodoInicio, setPeriodoInicio] = useState("")
  const [periodoFin, setPeriodoFin] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("")
  const [generandoReporte, setGenerandoReporte] = useState(false)
  const [mostrarAlerta, setMostrarAlerta] = useState(false)
  const [mensajeAlerta, setMensajeAlerta] = useState("")
  const [tipoAlerta, setTipoAlerta] = useState("success")
  const [incluirGraficos, setIncluirGraficos] = useState(true)
  const [enviarPorEmail, setEnviarPorEmail] = useState(false)
  const [emailDestino, setEmailDestino] = useState("")
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false)

  const mostrarNotificacion = (tipo, mensaje) => {
    setTipoAlerta(tipo)
    setMensajeAlerta(mensaje)
    setMostrarAlerta(true)
    setTimeout(() => setMostrarAlerta(false), 3000)
  }

  const generarReporte = () => {
    if (!reporteSeleccionado) {
      mostrarNotificacion("error", "Por favor selecciona un tipo de reporte")
      return
    }

    setGenerandoReporte(true)
    setTimeout(() => {
      setGenerandoReporte(false)
      mostrarNotificacion("success", "Reporte generado exitosamente")
    }, 3000)
  }

  const descargarReporte = (reporte) => {
    mostrarNotificacion("success", `Descargando ${reporte.nombre}`)
  }

  const eliminarReporte = (id) => {
    mostrarNotificacion("success", "Reporte eliminado del historial")
  }

  const toggleReporteProgramado = (id) => {
    mostrarNotificacion("success", "Configuración de reporte actualizada")
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "completado":
        return "green"
      case "programado":
        return "blue"
      case "error":
        return "red"
      case "procesando":
        return "amber"
      default:
        return "blue-gray"
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "completado":
        return <CheckCircle className="h-4 w-4" />
      case "programado":
        return <Clock className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
      case "procesando":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Alerta flotante */}
      {mostrarAlerta && (
        <div className="fixed top-4 right-4 z-50">
          <Alert color={tipoAlerta === "success" ? "green" : "red"} className="shadow-lg">
            {mensajeAlerta}
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes</h1>
            <p className="text-gray-600">Genera, programa y gestiona todos tus reportes de inventario</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              color="blue-gray"
              className="flex items-center gap-2 normal-case"
              onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
            >
              <Settings className="h-4 w-4" />
              Configuración
            </Button>
            <Button
              color="blue"
              className="flex items-center gap-2 normal-case"
              onClick={() => setActiveTab("generar")}
            >
              <Plus className="h-4 w-4" />
              Nuevo Reporte
            </Button>
          </div>
        </div>
      </div>

      {/* Configuración Global */}
      {mostrarConfiguracion && (
        <Card className="mb-6 shadow-sm border-l-4 border-l-blue-500">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-5 w-5 text-blue-600" />
              <Typography variant="h6" color="blue-gray" className="font-bold">
                Configuración Global de Reportes
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Formato por Defecto
                </Typography>
                <Select value="PDF">
                  <Option value="PDF">PDF</Option>
                  <Option value="Excel">Excel</Option>
                  <Option value="CSV">CSV</Option>
                </Select>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Email para Notificaciones
                </Typography>
                <Input placeholder="admin@empresa.com" />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Retención de Reportes (días)
                </Typography>
                <Select value="30">
                  <Option value="7">7 días</Option>
                  <Option value="30">30 días</Option>
                  <Option value="90">90 días</Option>
                  <Option value="365">1 año</Option>
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tabs de Reportes */}
      <Card className="shadow-sm">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsHeader className="bg-gray-50">
            <Tab value="generar" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generar Reporte
            </Tab>
            <Tab value="historial" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Historial
            </Tab>
            <Tab value="programados" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Programados
            </Tab>
          </TabsHeader>

          <TabsBody>
            {/* Tab Generar Reporte */}
            <TabPanel value="generar" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selección de Tipo de Reporte */}
                <div className="lg:col-span-2">
                  <Typography variant="h6" color="blue-gray" className="font-bold mb-4">
                    Selecciona el Tipo de Reporte
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {TIPOS_REPORTES.map((tipo) => {
                      const IconComponent = tipo.icono
                      return (
                        <Card
                          key={tipo.id}
                          className={`shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
                            reporteSeleccionado === tipo.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => setReporteSeleccionado(tipo.id)}
                        >
                          <CardBody className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <Typography variant="h6" color="blue-gray" className="font-bold">
                                    {tipo.nombre}
                                  </Typography>
                                  <Radio
                                    name="tipo-reporte"
                                    checked={reporteSeleccionado === tipo.id}
                                    onChange={() => setReporteSeleccionado(tipo.id)}
                                  />
                                </div>
                                <Typography variant="small" color="gray" className="mb-3">
                                  {tipo.descripcion}
                                </Typography>
                                <div className="flex items-center justify-between">
                                  <Chip
                                    value={tipo.categoria}
                                    color="blue-gray"
                                    size="sm"
                                    variant="ghost"
                                    className="rounded-full"
                                  />
                                  <Typography variant="small" color="gray" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {tipo.tiempo_estimado}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Configuración del Reporte */}
                  {reporteSeleccionado && (
                    <Card className="shadow-sm">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="font-bold mb-4">
                          Configuración del Reporte
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              Período de Inicio
                            </Typography>
                            <Input
                              type="date"
                              value={periodoInicio}
                              onChange={(e) => setPeriodoInicio(e.target.value)}
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              Período de Fin
                            </Typography>
                            <Input type="date" value={periodoFin} onChange={(e) => setPeriodoFin(e.target.value)} />
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
                              Formato de Salida
                            </Typography>
                            <Select value={formatoSeleccionado} onChange={(value) => setFormatoSeleccionado(value)}>
                              {TIPOS_REPORTES.find((t) => t.id === reporteSeleccionado)?.formatos.map((formato) => (
                                <Option key={formato} value={formato}>
                                  {formato}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        {/* Opciones Adicionales */}
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                Incluir Gráficos
                              </Typography>
                              <Typography variant="small" color="gray">
                                Añadir visualizaciones al reporte
                              </Typography>
                            </div>
                            <Switch checked={incluirGraficos} onChange={(e) => setIncluirGraficos(e.target.checked)} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                Enviar por Email
                              </Typography>
                              <Typography variant="small" color="gray">
                                Enviar el reporte al completarse
                              </Typography>
                            </div>
                            <Switch checked={enviarPorEmail} onChange={(e) => setEnviarPorEmail(e.target.checked)} />
                          </div>
                          {enviarPorEmail && (
                            <div>
                              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                Email de Destino
                              </Typography>
                              <Input
                                placeholder="correo@empresa.com"
                                value={emailDestino}
                                onChange={(e) => setEmailDestino(e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>

                {/* Panel de Previsualización */}
                <div>
                  <Card className="shadow-sm sticky top-6">
                    <CardBody className="p-6">
                      <Typography variant="h6" color="blue-gray" className="font-bold mb-4">
                        Previsualización
                      </Typography>
                      {reporteSeleccionado ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                              Tipo de Reporte
                            </Typography>
                            <Typography variant="small" color="gray">
                              {TIPOS_REPORTES.find((t) => t.id === reporteSeleccionado)?.nombre}
                            </Typography>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                              Período
                            </Typography>
                            <Typography variant="small" color="gray">
                              {periodoInicio && periodoFin ? `${periodoInicio} al ${periodoFin}` : "No especificado"}
                            </Typography>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                              Formato
                            </Typography>
                            <Typography variant="small" color="gray">
                              {formatoSeleccionado}
                            </Typography>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                              Opciones
                            </Typography>
                            <div className="space-y-1">
                              <Typography variant="small" color="gray">
                                {incluirGraficos ? "✓" : "✗"} Incluir gráficos
                              </Typography>
                              <Typography variant="small" color="gray">
                                {enviarPorEmail ? "✓" : "✗"} Enviar por email
                              </Typography>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <Typography variant="small" color="gray">
                            Selecciona un tipo de reporte para ver la previsualización
                          </Typography>
                        </div>
                      )}
                      <Button
                        color="blue"
                        className="w-full mt-6 flex items-center justify-center gap-2 normal-case"
                        onClick={generarReporte}
                        disabled={!reporteSeleccionado || generandoReporte}
                      >
                        {generandoReporte ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Generar Reporte
                          </>
                        )}
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </TabPanel>

            {/* Tab Historial */}
            <TabPanel value="historial" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" color="blue-gray" className="font-bold">
                  Historial de Reportes
                </Typography>
                <div className="flex gap-3">
                  <Button variant="outlined" color="blue-gray" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outlined" color="blue-gray" size="sm" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                  </Button>
                </div>
              </div>

              <Card className="shadow-sm">
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Reporte
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Tipo
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Fecha
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Estado
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Tamaño
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Acciones
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {HISTORIAL_REPORTES.map((reporte) => (
                          <tr key={reporte.id} className="hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    {reporte.nombre}
                                  </Typography>
                                  <Typography variant="small" color="gray">
                                    Por: {reporte.generado_por}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Chip
                                value={reporte.formato}
                                color="blue-gray"
                                size="sm"
                                variant="ghost"
                                className="rounded-full"
                              />
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Typography variant="small" color="blue-gray">
                                {reporte.fecha_generacion}
                              </Typography>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Chip
                                value={reporte.estado}
                                color={getEstadoColor(reporte.estado)}
                                size="sm"
                                variant="ghost"
                                className="rounded-full capitalize"
                                icon={getEstadoIcon(reporte.estado)}
                              />
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Typography variant="small" color="blue-gray">
                                {reporte.tamaño}
                              </Typography>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex gap-2">
                                {reporte.estado === "completado" && (
                                  <>
                                    <IconButton
                                      variant="text"
                                      color="blue"
                                      size="sm"
                                      onClick={() => descargarReporte(reporte)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </IconButton>
                                    <IconButton variant="text" color="blue-gray" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </IconButton>
                                    <IconButton variant="text" color="blue-gray" size="sm">
                                      <Share2 className="h-4 w-4" />
                                    </IconButton>
                                  </>
                                )}
                                <IconButton
                                  variant="text"
                                  color="red"
                                  size="sm"
                                  onClick={() => eliminarReporte(reporte.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </IconButton>
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

            {/* Tab Programados */}
            <TabPanel value="programados" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" color="blue-gray" className="font-bold">
                  Reportes Programados
                </Typography>
                <Button color="blue" className="flex items-center gap-2 normal-case">
                  <Plus className="h-4 w-4" />
                  Nuevo Programado
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REPORTES_PROGRAMADOS.map((reporte) => (
                  <Card key={reporte.id} className="shadow-sm">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                              {reporte.nombre}
                            </Typography>
                            <Typography variant="small" color="gray">
                              {reporte.tipo}
                            </Typography>
                          </div>
                        </div>
                        <Switch
                          checked={reporte.activo}
                          onChange={() => toggleReporteProgramado(reporte.id)}
                          color="blue"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Typography variant="small" color="gray">
                            Frecuencia:
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {reporte.frecuencia}
                          </Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" color="gray">
                            Día:
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {reporte.dia}
                          </Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" color="gray">
                            Hora:
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {reporte.hora}
                          </Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" color="gray">
                            Formato:
                          </Typography>
                          <Chip
                            value={reporte.formato}
                            color="blue-gray"
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" color="gray">
                            Último envío:
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {reporte.ultimo_envio}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button variant="outlined" color="blue-gray" size="sm" className="flex-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outlined" color="blue-gray" size="sm" className="flex-1">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outlined" color="red" size="sm" className="flex-1">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
    </div>
  )
}

export default Reportes
