"use client";

import { useState, useEffect, useRef } from "react";
import {
  formatearPesos,
  formatearPesosRedondeo,
} from "../../../helpers/formatearPesos.js";
import { useNotificacion } from "../../../hooks/useNotificacion.jsx";
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
} from "@material-tailwind/react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCategorias } from "../../../hooks/useCategorias.jsx";
import { useEstadisticasDashboard } from "../../../hooks/useEstadisticas.jsx";
import { useNavigate } from "react-router";

export const Estadisticas = () => {
  const [activeTab, setActiveTab] = useState("resumen");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("30");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [cargando, setCargando] = useState(false);
  const [currentPageTop, setCurrentPageTop] = useState(1);
  const [currentPageCriticos, setCurrentPageCriticos] = useState(1);
  const estadisticasPerPage = 25;
  const topRefCriticos = useRef(null);
  const topRefProductosTop = useRef(null);

  // FILTROS PARA PAGINACION
  const topLimit = estadisticasPerPage;
  const topOffset = (currentPageTop - 1) * topLimit;
  const criticosLimit = estadisticasPerPage;
  const criticosOffset = (currentPageCriticos - 1) * criticosLimit;

  // TRAER ESTADISTICAS DESDE REACT QUERY
  const {
    data,
    isLoading,    
    isFetching,
    refetch,      
  } = useEstadisticasDashboard(periodoSeleccionado, categoriaFiltro, topLimit, topOffset, criticosLimit, criticosOffset);
  // console.log(data);
  
  const {
    metricas_principales = {},
    ventas_por_categoria = [],
    productos_top: {
      items: topItems = [],
      total: topTotal = 0,
      has_more: topHasMore = false,
  } = {},
  productos_criticos: {
    items: critItems = [],
    total: critTotal = 0,
    has_more: critHasMore = false,
  } = {},
} = data || {};


  // PAGINACION PRODUCTOS CRITICOS

  const total = critTotal ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / criticosLimit));
  const start = total === 0 ? 0 : (currentPageCriticos - 1) * criticosLimit + 1;
  const end = Math.min(currentPageCriticos * criticosLimit, total);
  const showEmpty = !isLoading && total === 0;

  // PAGINACION PRODUCTOS TOP
  const totalTop = topTotal ?? 0;
  const totalPagesTop = Math.max(1, Math.ceil(topTotal / topLimit));
  const startTop = topTotal === 0 ? 0 : (currentPageTop - 1) * topLimit + 1;
  const endTop = Math.min(currentPageTop * topLimit, totalTop);
  const showEmptyTop = !isLoading && totalTop === 0;

  // PAGINACION TOP REF AMBOS PRODUCTOS
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

  // TRAER CATEGORIAS DESDE REACT QUERY
  const { data: categorys } = useCategorias();
  const categorias = categorys ?? [];

  // Simular carga de datos
  useEffect(() => {
    setCargando(true);
    const timer = setTimeout(() => setCargando(false), 1000);
    return () => clearTimeout(timer);
  }, [periodoSeleccionado, categoriaFiltro]);

  // ALERTA HOOK
  const {mostrarNotificacion, componenteAlerta } = useNotificacion();

  const navigate = useNavigate();

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "bajo_stock":
        return "amber";
      case "sin_stock":
        return "red";
      case "critico":
        return "red";
      default:
        return "blue-gray";
    }
  };

  const handleReabastecer = (p) => {
    navigate(`/admin/stock/registrar-movimiento-stock?productoId=${p.id}&tipo=entrada`)
  }

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Alerta flotante */}
      {componenteAlerta}

      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase">
              Estadísticas del sistema
            </h1>
            <p className="text-gray-600">
              Análisis completo de tu inventario y rendimiento de ventas
            </p>
          </div>
          <div className="flex gap-3">
            
                <Button
                  variant="outlined"
                  color="blue-gray"
                  className="flex uppercase items-center gap-2"
                  onClick={() => navigate('/admin/reportes')}
                >
                  <Download className="h-4 w-4" />
                  VER REPORTES
                </Button>
              
            <Button
            color="blue"
            className="flex items-center gap-2 uppercase"
            onClick={async () => {
              try {
                await refetch({ throwOnError: true });
                mostrarNotificacion('success', 'Datos actualizados');
              } catch (e) {
                mostrarNotificacion("error", e?.message ?? "No se pudo actualizar");
              }
            }}
            disabled={isFetching} 
          >
            {isFetching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Actualizar datos
          </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 shadow-sm">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Período de Análisis
              </Typography>
              <Select
                value={periodoSeleccionado}
                onChange={(value) => setPeriodoSeleccionado(value)}
              >
                <Option value="7">Últimos 7 días</Option>
                <Option value="30">Últimos 30 días</Option>
                <Option value="90">Últimos 3 meses</Option>
                <Option value="365">Último año</Option>
              </Select>
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Categoría
              </Typography>
              <Select
                value={categoriaFiltro} 
                onChange={(v) => setCategoriaFiltro(v ?? "")}
                selected={() => {
                  // <- ignoramos 'element'
                  if (categoriaFiltro === "") return "Todas las categorías";
                  const found = categorias.find(
                    (c) => String(c.id) === categoriaFiltro
                  );
                  return found ? found.nombre : "Seleccionar categoría";
                }}
              >
                <Option value="">Todas las categorías</Option>
                {categorias.map((cat) => (
                  <Option key={cat.id} value={String(cat.id)}>
                    {cat.nombre}
                  </Option>
                ))}
              </Select>
            </div>
            {/* <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Tipo de Reporte
              </Typography>
              <Select>
                <Option value="inventario">Inventario</Option>
                <Option value="ventas">Ventas</Option>
                <Option value="rotacion">Rotación</Option>
                <Option value="rentabilidad">Rentabilidad</Option>
              </Select>
            </div> */}
            <div className="flex items-end">
              <Button
                color="blue-gray"
                className="flex items-center gap-2 normal-case w-full"
              >
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
                  <span ref={topRefCriticos}></span>
                  <span ref={topRefProductosTop}></span>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium mb-1"
                >
                  Valor Total Inventario
                </Typography>
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="font-bold"
                >
                  $
                  {formatearPesosRedondeo(
                    metricas_principales?.valor_total_inventario
                  )}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <Typography
                    variant="small"
                    color="green"
                    className="font-medium"
                  >
                    +{metricas_principales.variacion_periodo}%
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
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium mb-1"
                >
                  Productos Bajo Stock
                </Typography>
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="font-bold"
                >
                  {metricas_principales?.productos_bajo_stock}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <Typography
                    variant="small"
                    color="amber"
                    className="font-medium"
                  >
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
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium mb-1"
                >
                  Ventas del Mes
                </Typography>
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="font-bold"
                >
                  $
                  {formatearPesosRedondeo(metricas_principales?.ventas_periodo)}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <Typography
                    variant="small"
                    color="blue"
                    className="font-medium"
                  >
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
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium mb-1"
                >
                  Rotación Promedio
                </Typography>
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="font-bold"
                >
                  {metricas_principales?.rotacion_promedio}
                </Typography>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <Typography
                    variant="small"
                    color="purple"
                    className="font-medium"
                  >
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
            <Tab value="resumen">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-base">Resumen</span>
              </div>
            </Tab>
            <Tab value="productos">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="text-base">Productos Top</span>
              </div>
            </Tab>
            <Tab value="categorias">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="text-base">Categorías</span>
              </div>
            </Tab>
            <Tab value="alertas">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-base">Alertas</span>
              </div>
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
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-bold"
                      >
                        Ventas por Categoría
                      </Typography>
                      <IconButton variant="text" color="blue-gray">
                        <Settings className="h-4 w-4" />
                      </IconButton>
                    </div>
                    <div className="space-y-4">
                      {ventas_por_categoria?.map((categoria) => (
                        <div key={categoria.categoria} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              {categoria.categoria}
                            </Typography>
                            <div className="flex items-center gap-2">
                              <Typography variant="small" color="gray">
                                ${formatearPesosRedondeo(categoria.ingresos)}
                              </Typography>
                              <Chip
                                value={`${categoria.porcentaje}%`}
                                color="blue"
                                size="sm"
                                variant="ghost"
                              />
                            </div>
                          </div>
                          <Progress
                            value={categoria.porcentaje}
                            color="blue"
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Métricas Adicionales */}
                <Card className="shadow-sm">
                  <CardBody className="p-6">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="font-bold mb-6"
                    >
                      Métricas Adicionales
                    </Typography>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Total de Productos
                            </Typography>
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="font-bold"
                            >
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
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Productos Críticos
                            </Typography>
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {metricas_principales.productos_bajo_stock}
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
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Eficiencia General
                            </Typography>
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="font-bold"
                            >
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
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="font-semibold uppercase flex items-center gap-2"
                    >
                      <Star className="h-6 w-6 text-yellow-500" />
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
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Producto
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Categoría
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Ventas/Mes
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Unidades vendidas
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Stock
                            </Typography>
                          </th>
                          <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              Valor Stock
                            </Typography>
                          </th>
                          {/* <th className="border-b border-gray-200 bg-gray-50 p-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              Rotación
                            </Typography>
                          </th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {topItems.map((producto, index) => (
                          <tr key={producto.id} className="hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium w-6 text-center"
                                  >
                                    #{index + 1}
                                  </Typography>
                                  <Avatar
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    size="sm"
                                    variant="rounded"
                                  />
                                </div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-medium"
                                >
                                  {producto.nombre}
                                </Typography>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Chip
                                value={producto.categoria}
                                color="blue"
                                variant="ghost"
                                className="rounded-full text-xs"
                              />
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-bold"
                                >
                                  ${formatearPesosRedondeo(producto?.ventas_mes)}
                                </Typography>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex ml-10 items-center gap-2">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-bold"
                                >
                                  {producto.unidades_vendidas}
                                </Typography>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex ml-3 items-center">
                                <Typography variant="small" color="blue-gray">
                                  {Number(producto.stock_actual)}
                                </Typography>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                ${formatearPesosRedondeo(producto.valor_stock)}
                              </Typography>
                            </td>
                            {/* <td className="p-4 border-b border-gray-200">
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
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                      
                    </table>
                    {!showEmptyTop ? (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Mostrando {startTop} a {endTop} de {totalTop} productos
                </Typography>
                <div className="flex gap-2">
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPageTop === 1 || isLoading}
                    onClick={() => goToPage(currentPageTop - 1, setCurrentPageTop, topRefProductosTop, totalPagesTop)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPageTop === totalPagesTop}
                    onClick={() => goToPage(currentPageTop + 1, setCurrentPageTop, topRefProductosTop, totalPagesTop)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Package className="h-12 w-12 text-gray-400 mb-3" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron productos Top
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta con otra búsqueda o agrega nuevos productos.
                </Typography>
              </div>
            )}
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
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {categoria.categoria}
                        </Typography>
                        <Chip
                          value={`${categoria.porcentaje}%`}
                          color="blue"
                          size="lg"
                          variant="gradient"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Typography variant="small" color="gray">
                              Ventas Totales
                            </Typography>
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="font-bold"
                            >
                              ${categoria.ingresos.toLocaleString()}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" color="gray">
                              Productos
                            </Typography>
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {categoria.productos}
                            </Typography>
                          </div>
                        </div>
                        <Progress
                          value={categoria.porcentaje}
                          color="blue"
                          className="h-3"
                        />
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="gray">
                            Participación en ventas
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
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
                      <Typography
                        variant="h6"
                        color="red"
                        className="font-semibold uppercase"
                      >
                        Productos que Requieren Atención
                      </Typography>
                      <Typography variant="small" color="gray">
                        {critTotal} productos necesitan
                        reabastecimiento
                      </Typography>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {critItems.map((producto) => (
                      <Card key={producto.id} className="shadow-sm border">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Typography
                                  variant="h6"
                                  color="blue-gray"
                                  className="font-bold"
                                >
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
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    {producto.categoria}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="small" color="gray">
                                    Stock Actual
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    {producto.stock_actual}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="small" color="gray">
                                    Stock Mínimo
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    {producto.stock_minimo}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="small" color="gray">
                                    Días sin venta
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    {producto.dias_sin_venta}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {/* <IconButton
                                variant="outlined"
                                color="blue"
                                size="sm"
                              >
                                <Eye className="h-4 w-4" />
                              </IconButton> */}
                              <Button 
                              color="deep-orange" 
                              size="sm"
                              onClick={() => handleReabastecer(producto)}>
                                Reabastecer
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                  {!showEmpty ? (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Mostrando {start} a {end} de {total} productos
                </Typography>
                <div className="flex gap-2">
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPageCriticos === 1 || isLoading}
                    onClick={() => goToPage(currentPageCriticos - 1, setCurrentPageCriticos, topRefCriticos, totalPages)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPageCriticos === totalPages}
                    onClick={() => goToPage(currentPageCriticos + 1, setCurrentPageCriticos, topRefCriticos, totalPages)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Package className="h-12 w-12 text-gray-400 mb-3" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron productos criticos
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta con otra búsqueda o agrega nuevos productos.
                </Typography>
              </div>
            )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
    </div>
  );
};
