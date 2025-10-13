"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatearFecha, fechaHora } from "../../../helpers/formatoFecha";
import { formatearEntero } from "../../../helpers/numeros";
import { computeRange } from "../../../helpers/rangoFecha";
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  User,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  RotateCcw,
  Eye,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ReceiptText
} from "lucide-react"
import { Card, CardBody, Typography, Button, Input, Chip, Select, Option, IconButton } from "@material-tailwind/react"
import { useMovimientoEstadisticas, useMovimientoStock } from "../../../hooks/useMovimientosStock";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { isBarcodeLike } from "../../../utils/barcode";
import { getProductoPorBarcode } from "../../../services/productServices";
import { useNotificacion } from "../../../hooks/useNotificacion";
import MovRows from "../../../components/Movimientos/MovRows";

const MovimientosStock = () => {
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroFecha, setFiltroFecha] = useState("semana")
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [scannerEnabled] = useState(true);
  const movimientosPerPage = 25;
  
  // TRAER MOVIMIENTOS DESDE REACT QUERY
    const searchDebounced = useDebouncedValue(busqueda, 500);
    const limite = movimientosPerPage;
    const offset = (currentPage - 1) * limite;
    const filtros = useMemo(() => {
      const { fechaDesde, fechaHasta } = computeRange(filtroFecha);
      const f = {};
      if (filtroFecha) {
        f.fechaDesde = fechaDesde;
        f.fechaHasta = fechaHasta
      }
      if (searchDebounced) f.search = searchDebounced

      if (limite) f.limite = limite;

      if (filtroTipo != 'todos') f.tipo = filtroTipo;

      if (offset) f.offset = offset;

      return f;
    }, [filtroFecha, searchDebounced, filtroTipo, limite, offset])
    const { data, isLoading } = useMovimientoStock(filtros);
    const movimientos = useMemo(() => data?.items ?? [], [data]);

    const filtrosEstadisticas = useMemo(() => {
      const { fechaDesde } = computeRange('hoy');
      const f = { hoy: fechaDesde };
      return f;
    }, []);
    const { data: movEst } = useMovimientoEstadisticas(filtrosEstadisticas);
    const estadisticas = movEst ?? [];
  
  useEffect(() => { setCurrentPage(1); }, [filtroFecha, searchDebounced, filtroTipo]);

  // PAGINACION
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limite));
  const start = total === 0 ? 0 : (currentPage - 1) * limite + 1;
  const end = Math.min(currentPage * limite, total);
  const showEmpty = !isLoading && total === 0;
  const topRef = useRef(null);
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


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  // ALERTA HOOK
  const {componenteAlerta, mostrarNotificacion} = useNotificacion();

  // INPUT DE BUSQUEDA CONTROLADO
  const handleScanOrSearch = useCallback(async (codigoOpcional) => {
    const raw = (typeof codigoOpcional === 'string' ? codigoOpcional : searchDebounced);
    const input = (raw || '').trim();
    if (!input) return;
  
    if (isBarcodeLike(input)) {
      try {
        const producto = await getProductoPorBarcode(input);
        if (producto) {
          setBusqueda(producto.barcode || producto.nombre); 
          mostrarNotificacion("success", `Producto encontrado: ${producto.nombre}`);
          return;
        }
        mostrarNotificacion("error", "Código no encontrado. Probá buscar por nombre.");
      } catch (e) {
        console.error(e);
        mostrarNotificacion("error", "Error al buscar por código de barras");
      }
      return;
    }
  }, [setBusqueda, mostrarNotificacion, searchDebounced]);

  const handleScanRef = useRef(handleScanOrSearch);
  useEffect(() => { handleScanRef.current = handleScanOrSearch; }, [handleScanOrSearch]);

  useEffect(() => {
    if (!scannerEnabled) return;

    let buffer = '';
    let timer;
    let locked = false;

    const shouldIgnoreFocus = () => {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;

      if ((tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable) && el.dataset.scanIgnore === "true") {
        return true;
      }
      return false;
    };

    const flush = () => {
      if (!buffer || locked) return;
      locked = true;
      const code = buffer.trim();
      buffer = "";

      Promise.resolve(handleScanRef.current(code)).finally(() => {
        setTimeout(() => { locked = false }, 50);
      })
    };

    const onKeyDown = (e) => {
      if (shouldIgnoreFocus()) return;

      if (e.key === "Enter") {
        e.preventDefault();
        flush();
        return;
      }

      if (e.key.length === 1) {
        buffer += e.key;
        clearTimeout(timer);
        timer = setTimeout(() => {
          flush();
        }, 70)
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    }
  }, [scannerEnabled])
  
  

  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* COMPONENTE DE LA ALERTA */}
      {componenteAlerta}
      <span ref={topRef}></span>
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Typography variant="h4" color="blue-gray" className="flex items-center gap-2 mb-2 uppercase">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Movimientos de Stock
                </Typography>
                <Typography color="gray" className="font-normal">
                  Seguimiento detallado de todos los movimientos del inventario
                </Typography>
              </div>
              <div className="flex gap-2">
                <Button variant="outlined" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button size="sm" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Reporte
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography color="gray" className="font-normal text-[14px]">
                    Movimientos Hoy
                  </Typography>
                  <Typography variant="h4" color="blue-gray">
                    {Number(estadisticas?.total_movimientos ?? 0)}
                  </Typography>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography color="gray" className="font-normal text-sm">
                    Entradas Hoy
                  </Typography>
                  <Typography variant="h4" className="text-green-600">
                    {Number(estadisticas?.entradas_count ?? 0)}
                  </Typography>
                </div>
                <ArrowUpCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography color="gray" className="font-normal text-sm">
                    Salidas Hoy
                  </Typography>
                  <Typography variant="h4" className="text-red-600">
                    {Number(estadisticas?.salidas_count ?? 0)}
                  </Typography>
                </div>
                <ArrowDownCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography color="gray" className="font-normal text-sm">
                    Ajustes Hoy
                  </Typography>
                  <Typography variant="h4" className="text-blue-600">
                    {Number(estadisticas?.ajustes_count ?? 0)}
                  </Typography>
                </div>
                <RefreshCw className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography color="gray" className="font-normal text-sm">
                    Valor Entradas
                  </Typography>
                  <Typography variant="h6" className="text-green-600">
                    {formatCurrency(estadisticas?.entradas_valor_costo ?? 0)}
                  </Typography>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography color="gray" className="font-normal text-sm">
                    Valor Salidas
                  </Typography>
                  <Typography variant="h6" className="text-red-600">
                    {formatCurrency(estadisticas?.salidas_valor_costo ?? 0)}
                  </Typography>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  label="Buscar producto o SKU"
                  placeholder="Ingresa el nombre del producto o código de barra"
                  icon={<Search className="w-4 h-4" />}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select label="Tipo de movimiento" value={filtroTipo} onChange={(value) => setFiltroTipo(value)}>
                  <Option value="todos">Todos los tipos</Option>
                  <Option value="entrada">Entradas</Option>
                  <Option value="salida">Salidas</Option>
                  <Option value="ajuste">Ajustes</Option>
                  <Option value="devolucion_cliente">Devoluciones</Option>
                </Select>
                <Select label="Período" value={filtroFecha} onChange={(value) => setFiltroFecha(value)}>
                  <Option value="hoy">Hoy</Option>
                  <Option value="semana">Esta semana</Option>
                  <Option value="mes">Este mes</Option>
                  <Option value="trimestre">Trimestre</Option>
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardBody className="p-0">
            <div className="p-6 border-b">
              <Typography variant="h6" color="blue-gray" className="flex items-center gap-2 uppercase">
                <FileText className="w-5 h-5" />
                Historial de Movimientos
                <Chip
                  value={`${movimientos.length} registros`}
                  color="blue-gray"
                  variant="ghost"
                  className="ml-2"
                />
              </Typography>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Fecha/Hora
                      </Typography>
                    </th>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Producto
                      </Typography>
                    </th>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium text-center">
                        Tipo
                      </Typography>
                    </th>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium text-center">
                        Cantidad
                      </Typography>
                    </th>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Stock
                      </Typography>
                    </th>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Usuario
                      </Typography>
                    </th>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Motivo
                      </Typography>
                    </th>
                    <th className="text-left p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Documento
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((mov) => (
                    <MovRows
                    key={mov.id}
                    fecha_creacion={mov.fecha_creacion}
                    producto_nombre={mov.producto_nombre}
                    barcode={mov.barcode}
                    tipo={mov.tipo}
                    stock_anterior={mov.stock_anterior}
                    usuarioNombre={mov.usuario_nombre}
                    motivo={mov.motivo}
                    document={mov.document}
                    costo_unitario={mov.costo_unitario}
                    precio_venta={mov.precio_venta}
                    stock_actual={mov.stock_actual}
                    direction={mov.direction}
                    cantidad_movimiento={mov.cantidad_movimiento}
                    />

                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginación */}
            {!showEmpty ? (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Mostrando {start} a {end} de {total} movimientos
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
                    onClick={() => goToPage(currentPage + 1, setCurrentPage, topRef, totalPages)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <ReceiptText className="h-12 w-12 text-gray-400 mb-3" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron movimientos
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta con otra búsqueda o agrega nuevos movimientos.
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>

        {/* <Card className="shadow-sm">
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" />
              Tendencia de Movimientos
            </Typography>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <Typography color="gray">Gráfico de tendencias de movimientos</Typography>
                <Typography variant="small" color="gray">
                  Próximamente disponible
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card> */}
      </div>
    </div>
  )
}


export default MovimientosStock
