"use client"

import { useEffect, useState } from "react";
import { stockMovementEstadisticasToday, stockMovements } from "../../../services/stockServices";
import { formatearFecha, fechaHora } from "../../../helpers/formatoFecha";
import { formatearEntero } from "../../../helpers/numeros";
import { useVentas } from "../../../context/VentasContext";
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
} from "lucide-react"
import { Card, CardBody, Typography, Button, Input, Chip, Select, Option } from "@material-tailwind/react"

const MovimientosStock = () => {
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroFecha, setFiltroFecha] = useState("semana")
  const [busqueda, setBusqueda] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);

  // CONTEXT
  const { ventasContext } = useVentas();
  const { recargarProductos } = useProductos();

  useEffect(() => {
      const { fechaDesde, fechaHasta } = computeRange(filtroFecha);
      const fetchMovimientos = async () => {
        const mov = await stockMovements({fechaDesde, fechaHasta});
        // console.log(mov);
        setMovimientos(mov); 
      };
      fetchMovimientos();
  }, [filtroFecha, ventasContext, recargarProductos])

  useEffect(() => {
      const fetchEstadisticas = async () => {
        const { fechaDesde } = computeRange("hoy");
        const est = await stockMovementEstadisticasToday({hoy: fechaDesde});
        console.log(est);
        setEstadisticas(est); 
      };
      fetchEstadisticas();
  }, [filtroFecha, ventasContext, recargarProductos])
  


  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "Entrada":
        return <ArrowUpCircle className="w-4 h-4 text-green-600" />
      case "Salida":
        return <ArrowDownCircle className="w-4 h-4 text-red-600" />
      case "Ajuste":
        return <RefreshCw className="w-4 h-4 text-blue-600" />
      case "Devolucion_cliente":
        return <RotateCcw className="w-4 h-4 text-orange-600" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getTipoBadge = (tipo) => {
    const variants = {
      entrada: "green",
      salida: "red",
      ajuste: "blue",
      devolucion_cliente: "orange",
    }

    return <Chip value={tipo} color={variants[tipo]} icon={getTipoIcon(tipo)} className="capitalize" />
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  const movimientosFiltrados = movimientos.filter((mov) => {
    const matchTipo = filtroTipo === "todos" || mov.tipo === filtroTipo
    const matchBusqueda =
      mov.producto_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      mov.barcode.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusqueda
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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
                    {estadisticas.total_movimientos}
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
                    {estadisticas.entradas_count}
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
                    {estadisticas.salidas_count}
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
                    {estadisticas.ajustes_count}
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
                    {formatCurrency(estadisticas.entradas_valor_costo)}
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
                    {formatCurrency(estadisticas.salidas_valor_costo)}
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
                  icon={<Search className="w-4 h-4" />}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select label="Tipo de movimiento" value={filtroTipo} onChange={(value) => setFiltroTipo(value)}>
                  <Option value="todos">Todos los tipos</Option>
                  <Option value="Entrada">Entradas</Option>
                  <Option value="Salida">Salidas</Option>
                  <Option value="Ajuste">Ajustes</Option>
                  <Option value="Devolucion_cliente">Devoluciones</Option>
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
                  value={`${movimientosFiltrados.length} registros`}
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
                  {movimientosFiltrados.map((mov) => {

                    const dir = mov.direction;
                    const qty = mov.cantidad_movimiento;
                    const isOut = dir < 0;
                    const color = isOut ? 'text-red-600' : 'text-green-600';
                    const signedQty = `${isOut ? '-' : '+'}${formatearEntero(qty)}`;

                    return (
                    <tr key={mov.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {formatearFecha(mov.fecha_creacion.split(" ")[0])}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {fechaHora(mov.fecha_creacion)}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {mov.producto_nombre}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {mov.barcode}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">{getTipoBadge(mov.tipo)}</td>
                      <td className="p-4 text-center">
                        <Typography
                          variant="small"
                          className={`font-medium ${color}`}
                        >
                          {signedQty}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="gray">
                          {formatearEntero(mov.stock_anterior)} →{" "}
                          <span className="font-medium text-blue-gray-900">{formatearEntero(mov.stock_actual)}</span>
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <Typography variant="small" color="blue-gray">
                            {mov.usuario_nombre}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="max-w-xs truncate">
                          {mov.motivo}
                        </Typography>
                        
                      </td>
                      <td className="p-4">
                        <Chip value={mov.document} variant="outlined" size="sm" />
                        {formatearEntero(mov.costo_unitario) && (
                          <Typography variant="small" className="text-green-600 mt-1">
                            {formatCurrency(Number(mov.costo_unitario))}
                          </Typography>
                        )}
                        {Number(mov.precio_venta).toFixed(2) && (
                          <Typography variant="small" className="text-blue-600 mt-1">
                            {formatCurrency(Number(mov.precio_venta))}
                          </Typography>
                        )}
                      </td>
                    </tr>

                    )

                  })}
                </tbody>
              </table>
            </div>
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
