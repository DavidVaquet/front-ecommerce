"use client"

import { useEffect, useRef, useState } from "react";
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
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import { useNotificacion } from "../../../hooks/useNotificacion";
import { UseReportes } from "../../../hooks/useReportes";
import { useCategorias } from "../../../hooks/useCategorias";
import { useReportesMutation } from "../../../hooks/useReportesMutation";

// Datos de ejemplo para los reportes
const TIPOS_REPORTES = [
  {
    id: "inventario",
    nombre: "Reporte de Inventario",
    descripcion: "Estado actual del inventario con valores y cantidades.",
    icono: Package,
    categoria: "Inventario",
    tiempo_estimado: "2-3 min",
    formatos: ["xlsx"],
  },
  {
    id: "ventas",
    nombre: "Reporte de Ventas",
    descripcion: "Análisis detallado de ventas por período.",
    icono: BarChart3,
    categoria: "Ventas",
    tiempo_estimado: "1-2 min",
    formatos: ["xlsx"],
  },
  {
    id: "productos_criticos",
    nombre: "Productos Críticos",
    descripcion: "Productos con bajo stock o sin movimiento.",
    icono: AlertTriangle,
    categoria: "Alertas",
    tiempo_estimado: "1 min",
    formatos: ["xlsx"],
  },
  {
    id: "rentabilidad",
    nombre: "Análisis de Rentabilidad",
    descripcion: "Rentabilidad por producto y categoría.",
    icono: DollarSign,
    categoria: "Financiero",
    tiempo_estimado: "3-4 min",
    formatos: ["xlsx"],
  },
  {
    id: "clientes",
    nombre: "Reporte de Clientes",
    descripcion: "Análisis de comportamiento y segmentación de clientes.",
    icono: Users,
    categoria: "Clientes",
    tiempo_estimado: "2 min",
    formatos: ["xlsx"],
  },
  {
    id: "movimientos",
    nombre: "Movimientos del inventario",
    descripcion: "Análisis detallado de los movimientos del inventario.",
    icono: Package,
    categoria: "Stock",
    tiempo_estimado: "2 min",
    formatos: ["xlsx"],
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

const REQUIERE_FECHAS = new Set(['ventas', 'movimientos', 'rentabilidad', 'clientes']);

export const Reportes = () => {
  const [activeTab, setActiveTab] = useState("generar")
  const [reporteSeleccionado, setReporteSeleccionado] = useState("")
  const [formatoSeleccionado, setFormatoSeleccionado] = useState("")
  const [periodoInicio, setPeriodoInicio] = useState("")
  const [periodoFin, setPeriodoFin] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [generandoReporte, setGenerandoReporte] = useState(false)
  const [enviarPorEmail, setEnviarPorEmail] = useState(false)
  const [emailDestino, setEmailDestino] = useState("")
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const {componenteAlerta, mostrarNotificacion} = useNotificacion();
  const historialPerPage = 25;
  const limite = historialPerPage;
  const offset = (currentPage - 1) * limite;

  const topRef = useRef(null);

  // MUTATION REACT QUERY
  const { nuevoReporte, bajarReporte, borrarReporte } = useReportesMutation();

  // TRAER CATEGORIAS DESDE REACT QUERY
  const { data: cate } = useCategorias();
  const categoria = cate ?? [];
  // TRAER HISTORIAL DE REPORTES DESDE REACT QUERY
  const {data, refetch, isLoading } = UseReportes(limite, offset);
  const historial = data?.reportes?.items ?? [];
  // console.log(historial);

  // PAGINACION
  const total = data?.reportes?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limite));
  const start = total === 0 ? 0 : (currentPage - 1) * limite + 1;
  const end = Math.min(currentPage * limite, total);
  const showEmpty = !isLoading && total === 0; 
  function goToPage(newPage, setCurrentPage, topRef, totalPages) {
  const safePage = Math.max(1, Math.min(newPage, totalPages));
  setCurrentPage(safePage);

  requestAnimationFrame(() => {
    if (topRef?.current) {
      let parent = topRef.current.parentElement;
      while (parent) {
        const overflowY = getComputedStyle(parent).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
          parent.scrollTo({ top: 0, behavior: "smooth" });
        }
        parent = parent.parentElement;
      }
      const y = topRef.current.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  });
}

  const generarReporte = async () => {
    if (!reporteSeleccionado) {
      mostrarNotificacion("error", "Por favor selecciona un tipo de reporte")
      return
    }
    if (!formatoSeleccionado) {
      mostrarNotificacion("error", "Por favor selecciona un formato")
      return
    }

    const necesitaFechas = REQUIERE_FECHAS.has(reporteSeleccionado);
  if (necesitaFechas) {
    if (!periodoInicio || !periodoFin) {
      mostrarNotificacion("error", "Debes seleccionar un rango de fechas");
      return;
    }
  }

    if (new Date(periodoFin) < new Date(periodoInicio)) {
      mostrarNotificacion('error', 'El período final debe ser mayor al inicial');
      return;
    }
    setGenerandoReporte(true);
    try {
      const payload = {
        type: reporteSeleccionado,
        format: formatoSeleccionado,
        date_from: periodoInicio,
        date_to: periodoFin,
        filters: {
          categoria_id: categoriaFiltro === '' ? null : parseInt(categoriaFiltro)
        },
        email_to: emailDestino === '' ? null : emailDestino
      };

      const report = await nuevoReporte.mutateAsync(payload);

      if (report?.ok === false) {
        throw new Error('No se pudo generar el reporte');
      }

      
      setCategoriaFiltro("");
      setPeriodoInicio("");
      setPeriodoFin("");
      mostrarNotificacion('success', 'Reporte generado exitosamente');
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', 'Error generando el reporte');
    } finally {
      setGenerandoReporte(false);
    }

  }

  const descargarReporte = async (reporte) => {

    
    try {
      const descarga = await bajarReporte.mutateAsync(reporte.id);
      if (descarga) {
        mostrarNotificacion("success", `Descargando ${reporte.nombre}`)
        return true;
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message || 'Error al descargar el reporte');
    }
  }

  const eliminarReporte = async (id) => {
    try {
      console.log(id);
      const reporteBorrado = await borrarReporte.mutateAsync(id);

      if (reporteBorrado?.ok) {
        
        mostrarNotificacion("success", "Reporte eliminado del historial")
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message || 'Error al eliminar el reporte.');
    }
  }

  const toggleReporteProgramado = (id) => {
    mostrarNotificacion("success", "Configuración de reporte actualizada")
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "ready":
        return "green"
      case "program":
        return "blue"
      case "failed":
        return "red"
      case "proccesing":
        return "amber"
      default:
        return "blue-gray"
    }
  }

  const getEstadoLabel = (rawEstado) => {
    const estado = String(rawEstado ?? "").trim().toLowerCase();
    switch (estado) {
      case "ready":
        return "Listo"
        case "failed":
          return "Falló"
          case "processing":
            return 'Procesando'
            case "queued":
              return "En cola"
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "ready":
        return <CheckCircle className="h-4 w-4" />
      case "programado":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "proccesing":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

   
 

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
        <span ref={topRef}></span>
      {/* Alerta flotante */}
      {componenteAlerta}
      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase">Reportes DEL SISTEMA</h1>
            <p className="text-gray-600">Genera, programa y gestiona todos tus reportes de inventario</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              color="blue-gray"
              className="flex items-center gap-2 uppercase"
              onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
            >
              <Settings className="h-4 w-4" />
              Configuración
            </Button>
            <Button
              color="blue"
              className="flex items-center gap-2 uppercase"
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
              <Typography variant="h6" color="blue-gray" className="font-semibold uppercase">
                Configuración Global de Reportes
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Formato por Defecto
                </Typography>
                <Select>
                  <Option value="xlsx">Excel</Option>
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
            <Tab value="generar">
              <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Generar Reporte</span>
              </div>
            </Tab>
            <Tab value="historial">
              <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Historial</span>
              </div>
            </Tab>
            <Tab value="programados">
              <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Programados</span>
              </div>
            </Tab>
          </TabsHeader>

          <TabsBody>
            {/* Tab Generar Reporte */}
            <TabPanel value="generar" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selección de Tipo de Reporte */}
                <div className="lg:col-span-2">
                  <Typography variant="h6" color="blue-gray" className="font-semibold uppercase  mb-4">
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
                                  <Typography variant="h6" color="blue-gray" className="font-semibold uppercase">
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
                        <Typography variant="h6" color="blue-gray" className="font-bold mb-4 uppercase">
                          Configuración del Reporte
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(reporteSeleccionado === 'ventas' ||
                            reporteSeleccionado === 'movimientos' ||
                            reporteSeleccionado === 'rentabilidad' ||
                            reporteSeleccionado === 'clientes' 
                            ) && (
                              <>
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
                              </>
                          )}
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              Categoría
                            </Typography>
                            <Select
                            label="Filtrar por categoría"
                            value={categoriaFiltro}
                            onChange={(val) => setCategoriaFiltro(val || "")}
                            className="..."
                          >
                            <Option value="">Todas las categorías</Option>
                            {categoria.map((c) => (
                              <Option key={c.id} value={String(c.id)}>
                                {c.nombre}
                              </Option>
                            ))}
                          </Select>
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              Formato de Salida
                            </Typography>
                            <Select
                            label="Formato del reporte"
                            value={formatoSeleccionado} 
                            onChange={(value) => setFormatoSeleccionado(value)}
                            >
                              {TIPOS_REPORTES.find((t) => t.id === reporteSeleccionado)?.formatos.map((formato) => (
                                <Option key={formato} value={formato}>
                                  {formato === 'xlsx' ? 'Excel' : 'XLSX'}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        {/* Opciones Adicionales */}
                        <div className="mt-6 space-y-4">
                          {/* <div className="flex items-center justify-between">
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                Incluir Gráficos
                              </Typography>
                              <Typography variant="small" color="gray">
                                Añadir visualizaciones al reporte
                              </Typography>
                            </div>
                            <Switch checked={incluirGraficos} onChange={(e) => setIncluirGraficos(e.target.checked)} />
                          </div> */}
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
                      <Typography variant="h6" color="blue-gray" className="font-semibold uppercase mb-4">
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
                              {formatoSeleccionado === 'xlsx' ? 'Excel' : 'PDF'}
                            </Typography>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                              Opciones
                            </Typography>
                            <div className="space-y-1">
                              {/* <Typography variant="small" color="gray">
                                {incluirGraficos ? "✓" : "✗"} Incluir gráficos
                              </Typography> */}
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
                        className="w-full mt-6 flex items-center justify-center gap-2 uppercase"
                        onClick={generarReporte}
                        disabled={!reporteSeleccionado || generandoReporte || nuevoReporte.isPending}
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
                  <Button 
                  variant="outlined" 
                  color="blue-gray" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    refetch();
                    mostrarNotificacion('success', 'Reportes actualizados');
                  }}>
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
                        {historial.map((reporte) => (
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
                                value={reporte.formato === 'xlsx' ? 'Excel' : 'Pdf'}
                                color="cyan"
                                size="sm"
                                variant="ghost"
                                className="rounded-full uppercase"
                              />
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Typography variant="small" color="blue-gray">
                                {reporte.fecha_generacion}
                              </Typography>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Chip
                                value={getEstadoLabel(reporte.estado)}
                                color={getEstadoColor(reporte.estado)}
                                size="sm"
                                variant="ghost"
                                className="rounded-full w-28 capitalize"
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
                                {reporte.estado === "ready" && (
                                  <>
                                    <IconButton
                                      variant="text"
                                      color="blue"
                                      size="sm"
                                      onClick={() => descargarReporte(reporte)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </IconButton>
                                    
                                  </>
                                )}
                                <IconButton
                                  variant="text"
                                  color="red"
                                  size="sm"
                                  disabled={borrarReporte.isPending}
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
                  {/* Paginación */}
            {!showEmpty ? (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  Mostrando {start} a {" "} {end} de {total} {" "} reportes
                </Typography>
                <div className="flex gap-2">
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1, setCurrentPage, topRef, totalPages)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1, setCurrentPage, topRef, totalPages)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Package className="h-12 w-12 text-gray-400 mb-3" />
                <Typography variant="h6" color="blue-gray">
                  No se encontró ningún historial
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta con otra búsqueda o agrega nuevos reportes.
                </Typography>
              </div>
            )}
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
