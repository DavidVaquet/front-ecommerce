"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatearPesos, formatearPesosRedondeo } from "../../../helpers/formatearPesos";
import { mostrarImagen } from "../../../helpers/mostrarImagen";
import { formatearFechaHora } from "../../../helpers/formatoFecha";
import { useNotificacion } from "../../../hooks/useNotificacion";
import ButtonResponsive from "../../../components/Button";
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
  Progress,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react"
import {
  Search,
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
  MapPin,
  Mail,
  Smartphone,
  Phone,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { descargarReciboAttachment, enviarReciboService, generarReciboService } from "../../../services/reciboServices";
import { useVentas, useVentasTotales } from "../../../hooks/useVentas";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import VentasRow from "../../../components/Ventas/VentasRow";

 const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }


export const HistorialVentas = () => {
  const [activeTab, setActiveTab] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const topRef = useRef(null);
  
  // NOTIFICACION
  const { mostrarNotificacion, componenteAlerta } = useNotificacion();
  const ventasPerPage = 25;
  const limit = ventasPerPage;
  const offset = (currentPage - 1) * ventasPerPage;

  // FILTROS DE VENTAS
  const searchDebounced = useDebouncedValue(busqueda, 500);
  const filtros = useMemo(() => {
  const s = searchDebounced?.trim();
  const f = {};
  if (s) f.search = s;
  if (activeTab && activeTab !== 'todos') {
    f.origen = activeTab;
  }
  if (limit) f.limit = limit;
  if (offset) f.offset = offset;
  if (fechaInicio && fechaFin) {
    f.fecha_desde = fechaInicio;
    f.fecha_fin = fechaFin;
  } 
  return f;
}, [searchDebounced, activeTab, limit, offset, fechaFin, fechaInicio]);
  // TRAER VENTAS DESDE REACT QUERY 
  const { data, isLoading } = useVentas(filtros);
  const ventas = useMemo(() => data?.ventas ?? [], [data])
  // console.log(ventas);

  // TRAER ESTADISTICAS DE TOTALES DESDE REACT QUERY
  const { data: totalesVentas } = useVentasTotales();
  const totalVentasEstadisticas = totalesVentas ?? [];

  // ESTADISTICAS
  const totalVentas = totalVentasEstadisticas?.total_ventas ?? 0;
  const ventasLocal = totalVentasEstadisticas?.total_ventas_local ?? 0;
  const ventasEcommerce = totalVentasEstadisticas?.total_ventas_online ?? 0;

  const totalIngresos = totalVentasEstadisticas?.ingresos_totales ?? 0;
  const ingresosLocal = totalVentasEstadisticas?.ingresos_local ?? 0;
  const ingresosEcommerce = totalVentasEstadisticas?.ingresos_online ?? 0;

  // Resetear página cuando cambien filtros
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchDebounced, fechaInicio, fechaFin]);

 

  // PAGINACIÓN
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
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
  
  const handleOpenModal = useCallback((venta) => {
    setOpen(true);
    setVentaSeleccionada(venta);
  }, []);


  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setVentaSeleccionada(null);
  }, []);

   const imprimirRecibo = async (venta) => {
  try {
     
     const data = await generarReciboService(venta);
     
    const url = data?.descarga_jwt_url ?? data?.descarga_auth_url;
     if (!url) throw new Error("No se obtuvo la URL del recibo");

     
     window.open(url, "_blank", "noopener");
     mostrarNotificacion("info", "Abriendo el recibo en una nueva pestaña.");
   } catch (e) {
     console.error(e);
     mostrarNotificacion("error", "No se pudo abrir el recibo.");
   }
 }; 

  const handleDescargarRecibo =  (codigo) => {;
    descargarReciboAttachment(codigo);
};

  const enviarRecibo = async (venta) => {
   try {
     const resp = await enviarReciboService(venta);
    if (resp?.ok) {
       mostrarNotificacion("success", "Recibo enviado correctamente al email del cliente.");
     } else {
       mostrarNotificacion("error", resp?.msg || "No se pudo enviar el recibo.");
     }
   } catch (error) {
     console.error(error);
     mostrarNotificacion("error", "Error al enviar el recibo por email.");
   }
 };


  return (
    <div className="text-black flex flex-col w-full py-6 px-8 ">
      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight uppercase">Historial de Ventas</h1>
            <p className="text-gray-600 mt-1 lg:text-base text-sm">
              Visualiza y analiza todas las ventas realizadas tanto en el local como en la tienda e-commerce.
            </p>
          </div>
          <div className="flex gap-3">
            <ButtonResponsive
            variant= "outlined"
            className="flex items-center gap-2 uppercase px-2.5 py-2.5 text-xs md:py-2 md:px-4 md:text-sm whitespace-nowrap"
            color="blue-gray"
            icon={Download} >
              Exportar Reporte
            </ButtonResponsive>
            <ButtonResponsive
            variant= "filled"
            color="deep-orange"
            className="flex items-center gap-2 uppercase px-2.5 py-2.5 text-xs md:py-2 md:px-4 md:text-sm whitespace-nowrap"
            icon={BarChart3} >
              Ver Analytics
            </ButtonResponsive>
            
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
                  
                  ${formatearPesosRedondeo(totalIngresos)}
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
                  ${formatearPesosRedondeo(ingresosLocal)}
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
                  ${formatearPesosRedondeo(ingresosEcommerce)}
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
        <span ref={topRef}></span>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8 shadow-sm border border-gray-200">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Buscar ventas"
                placeholder="Código de venta, email del cliente, nombre del cliente o vendedor"
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
          </div>
        </CardBody>
      </Card>

      {/* Tabs y Lista de Ventas */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab}>
          <TabsHeader className="p-2 whitespace-nowrap overflow-x-auto">
            <Tab value="todos" className="text-sm font-medium" onClick={() => { setActiveTab('todos'), setCurrentPage(1)}}>
              Todas ({totalVentas})
            </Tab>
            <Tab 
            value="local" 
            className="text-sm font-medium"
            onClick={() => {
            setActiveTab('local')
            setCurrentPage(1);
            } 
              }
            >
              
              <div className="flex items-center gap-2">

              <Store className="h-4 w-4" />
              Local ({ventasLocal})
              </div>
            </Tab>
            <Tab value="online" className="text-sm font-medium"
            onClick={() => {
              setActiveTab('online');
              setCurrentPage(1);
            }}>
              <div className="flex items-center gap-2">

              <Globe className="h-4 w-4" />
              Tienda ({ventasEcommerce})
              </div>
            </Tab>
          </TabsHeader>

          <div className="p-6">
            
              <div className="space-y-4">
                {ventas.map((venta) => (
                  <VentasRow 
                  key={venta.id}
                  id={venta.id}
                  codigo={venta.codigo}
                  canal={venta.canal}
                  fecha={venta.fecha}
                  medio_pago={venta.medio_pago}
                  usuarioNombre={venta.usuario.nombre}
                  orden={venta.orden}
                  clienteNombre={venta.cliente.nombre}
                  clienteEmail={venta.cliente.email}
                  clienteTelefono={venta.cliente.telefono}
                  productos={venta.productos}
                  subtotal={venta.subtotal}
                  total={venta.total}
                  descuento={venta.descuento}
                  impuestos={venta.impuestos}
                  venta={venta}
                  onDetalle={handleOpenModal}
                  onDescargarRecibo={handleDescargarRecibo}  
                  />
                ))}
              </div>
            
            {/* Paginación */}
                        {!showEmpty ? (
                          <div className="flex items-center justify-between p-4 border-t border-gray-200">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              Mostrando {start} a {end} de {total} ventas
                            </Typography>
                            <div className="flex gap-2">
                              <IconButton
                                variant="outlined"
                                color="blue-gray"
                                size="sm"
                                disabled={currentPage === 1 || isLoading}
                                onClick={() => goToPage(currentPage - 1, setCurrentPage, topRef, totalPages)}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                variant="outlined"
                                color="blue-gray"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                  setCurrentPage((p) => goToPage(currentPage + 1, setCurrentPage, topRef, totalPages))
                                }
                              >
                                <ChevronRight className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                          <Receipt className="h-16 w-16 text-gray-300 mb-4" />
                          <Typography variant="h6" color="blue-gray">
                            No se encontraron ventas
                          </Typography>
                          <Typography variant="small" color="gray" className="mt-1">
                            Intenta ajustar los filtros o el rango de fechas.
                          </Typography>
                        </div>
                        )}
          </div>
        </Tabs>
      </Card>

            {/* MODAL DETALLES DE VENTA */}
            {ventaSeleccionada && (
            <Dialog size="xl" open={open} handler={handleCloseModal} className="max-h-[90vh] w-full max-w-5xl p-4">
              {/* HEADER */}
              <DialogHeader className="relative m-0 block">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center mb-7 h-10 w-10 rounded-full bg-deep-orange-50">
                    <Receipt className="h-6 w-6 text-deep-orange-500" />
                  </div>
                  <div>
                    <Typography variant="h4" color="blue-gray" className="uppercase">
                      Detalles de la Venta: {ventaSeleccionada?.codigo}
                    </Typography>
                    <Typography className="mt-1 font-normal text-gray-600">
                      Información completa sobre esta transacción.
                    </Typography>
                  </div>
                </div>
                <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={handleCloseModal}>
                  <XMarkIcon className="h-4 w-4 stroke-2" />
                </IconButton>
              </DialogHeader>

              {/* BODY CON SCROLL Y GRID DE DOS COLUMNAS */}
              <DialogBody className="overflow-y-auto max-h-[60vh] px-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* COLUMNA IZQUIERDA - INFORMACIÓN PRINCIPAL Y PRODUCTOS */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Información General de la Venta */}
                    <Card className="p-4 bg-gray-50">
                      <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2 uppercase">
                        <Receipt className="h-5 w-5" />
                        Información General
                      </Typography>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <Typography variant="small" color="blue-gray">
                            <strong>Fecha:</strong> {formatearFechaHora(ventaSeleccionada?.fecha)}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-600" />
                          <Typography variant="small" color="blue-gray">
                            Método de Pago: <strong className="capitalize">{ventaSeleccionada?.medio_pago}</strong>
                          </Typography>
                        </div>
                                              <div className="flex items-center gap-2">
                        <Typography variant="small" color="blue-gray">
                          <strong>Tipo de Venta:</strong>
                        </Typography>
                        <Chip
                          value={ventaSeleccionada.canal === "local" ? "Local" : "E-commerce"}
                          color={ventaSeleccionada.canal === "local" ? "deep-orange" : "purple"}
                          size="sm"
                          variant="ghost"
                          className="rounded-full capitalize"
                        />
                      </div>
                        {ventaSeleccionada.canal === "local" && (
                          <>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-600" />
                              <Typography variant="small" color="blue-gray">
                                <strong>Vendedor:</strong> {ventaSeleccionada.usuario.nombre}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-600" />
                              <Typography variant="small" color="blue-gray">
                                <strong>Sucursal:</strong> Illia
                              </Typography>
                            </div>
                          </>
                        )}
                        {ventaSeleccionada.canal === "ecommerce" && (
                          <>
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-gray-600" />
                              <Typography variant="small" color="blue-gray">
                                <strong>Plataforma:</strong> Tienda Ecommerce
                              </Typography>
                            </div>
                            {ventaSeleccionada.orden && (
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-gray-600" />
                                <Typography variant="small" color="blue-gray">
                                  <strong>N° Orden:</strong> {ventaSeleccionada.orden}
                                </Typography>
                              </div>
                            )}
                            {ventaSeleccionada.numeroSeguimiento && (
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-gray-600" />
                                <Typography variant="small" color="blue-gray">
                                  <strong>N° Seguimiento:</strong> {venta.numeroSeguimiento}
                                </Typography>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Card>

                    {/* Información del Cliente */}
                    <Card className="p-4 bg-gray-50">
                      <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2 uppercase">
                        <User className="h-5 w-5" />
                        Información del Cliente
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <Typography variant="small" color="blue-gray">
                            <strong>Nombre:</strong> {ventaSeleccionada.cliente?.nombre}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <Typography variant="small" color="blue-gray">
                            <strong>Email:</strong> {ventaSeleccionada.cliente?.email || "N/A"}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <Typography variant="small" color="blue-gray">
                            <strong>Teléfono:</strong> {ventaSeleccionada.cliente?.telefono || "N/A"}
                          </Typography>
                        </div>
                        {ventaSeleccionada.cliente?.direccion && (
                          <div className="flex items-center gap-2 md:col-span-2">
                            <MapPin className="h-4 w-4 text-gray-600" />
                            <Typography variant="small" color="blue-gray">
                              <strong>Dirección:</strong> {ventaSeleccionada.cliente?.direccion}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Productos de la Venta */}
                    <Card className="p-4 bg-gray-50">
                      <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        PRODUCTOS ({ventaSeleccionada.productos?.length})
                      </Typography>
                      <div className="space-y-3">
                        {ventaSeleccionada?.productos?.map((producto) => (
                          <div key={producto.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            <Avatar
                              src={mostrarImagen(producto.imagen)}
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
                                Cantidad: {producto.cantidad} | Precio Unitario: ${producto.precio.toFixed(2)}
                              </Typography>
                            </div>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              ${(producto.precio * producto.cantidad).toFixed(2)}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* COLUMNA DERECHA - RESUMEN FINANCIERO */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card className="p-4 bg-gradient-to-br from-deep-orange-50 to-orange-50 border border-deep-orange-100">
                      <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2 uppercase">
                        <DollarSign className="h-5 w-5" />
                        Resumen Financiero
                      </Typography>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Typography variant="small" color="blue-gray">
                            Subtotal:
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            ${formatearPesos(ventaSeleccionada.subtotal)}
                          </Typography>
                        </div>
                        {ventaSeleccionada.descuento > 0 && (
                          <div className="flex justify-between">
                            <Typography variant="small" color="blue-gray">
                              Descuento:
                            </Typography>
                            <Typography variant="small" color="red" className="font-medium">
                              -${ventaSeleccionada.descuento.toFixed(2)}
                            </Typography>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <Typography variant="small" color="blue-gray">
                            Impuestos:
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            ${Number(ventaSeleccionada.impuestos).toFixed(2)}
                          </Typography>
                        </div>
                        <hr className="border-gray-300 my-2" />
                        <div className="flex justify-between items-center">
                          <Typography variant="h5" color="blue-gray">
                            Total:
                          </Typography>
                          <Typography variant="h4" color="deep-orange" className="font-bold">
                            ${Number(ventaSeleccionada.total).toFixed(2)}
                          </Typography>
                        </div>
                      </div>
                    </Card>

                    {/* Acciones Adicionales */}
                    <Card className="p-4 bg-gray-50">
                      <Typography variant="h6" color="blue-gray" className="mb-4">
                        Acciones
                      </Typography>
                      <div className="space-y-3">
                        <Button 
                        color="blue"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => imprimirRecibo(ventaSeleccionada)}
                        >
                          <Receipt className="h-4 w-4" />
                          Imprimir Recibo
                        </Button>
                        <Button
                        variant="outlined" 
                        color="blue-gray" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => enviarRecibo(ventaSeleccionada)}>
                          <Mail className="h-4 w-4" />
                          Enviar Recibo por Email
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogBody>

              {/* FOOTER FIJO */}
              <DialogFooter className="border-t border-gray-200 pt-4 sticky bottom-0 bg-white z-10">
                <Button variant="outlined" color="blue-gray" onClick={handleCloseModal} className="ml-auto">
                  Cerrar
                </Button>
              </DialogFooter>
            </Dialog>
            )}
                                  {componenteAlerta}
    </div>
      
  )
}
