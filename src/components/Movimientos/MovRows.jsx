import { memo, useMemo } from "react";
import { formatearEntero } from "../../helpers/numeros";
import { formatearFecha, fechaHora } from "../../helpers/formatoFecha";
import {
  Package,
  User,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  RotateCcw
} from "lucide-react"
import { Typography, Chip } from "@material-tailwind/react"

const normalizeTipo = (t) => (t ?? '').toLowerCase();

const getTipoIcon = (tipo) => {
  const t = normalizeTipo(tipo);
  switch (t) {
    case 'entrada': return <ArrowUpCircle className="w-4 h-4 text-gray-50 mt-[2px]" />;
    case 'salida': return <ArrowDownCircle className="w-4 h-4 text-gray-50 mt-[2px]" />;
    case 'ajuste': return <RefreshCw className="w-4 h-4 text-gray-50 mt-[2px]" />;
    case 'devolucion_cliente': return <RotateCcw className="w-4 h-4 text-gray-50 mt-[2px]" />;
    default: return <Package className="w-4 h-4" />;
  }
};

const getTipoBadge = (tipo) => {
  const t = normalizeTipo(tipo);
  const variants = {
    entrada: 'green',
    salida: 'red',
    ajuste: 'blue',
    devolucion_cliente: 'orange',
  };
  return (
    <Chip
      value={t}
      color={variants[t]}
      icon={getTipoIcon(t)}
      className="capitalize"
    />
  );
};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }


function MovRows({
    id, fecha_creacion, producto_nombre, barcode, tipo, stock_anterior,
    usuarioNombre, motivo, document, costo_unitario, precio_venta, stock_actual,
    direction, cantidad_movimiento

}) {

    const { color, signedQty } = useMemo(() => {
    const isOut = Number(direction) < 0;
    const qty = Number(cantidad_movimiento) || 0;
    return {
      color: isOut ? "text-red-600" : "text-green-600",
      signedQty: `${isOut ? "-" : "+"}${formatearEntero(qty)}`,
    };
  }, [direction, cantidad_movimiento]);

  
  const { fecha, fechaHoraFmt } = useMemo(() => {
    const soloFecha = fecha_creacion?.split(" ")[0] ?? "";
    return {
      fecha: formatearFecha(soloFecha),
      fechaHoraFmt: fechaHora(fecha_creacion),
    };
  }, [fecha_creacion]);

  
  const costoUnitFmt = useMemo(() => {
    if (costo_unitario == null) return null;
    const n = Number(costo_unitario);
    if (Number.isNaN(n)) return null;
    return formatCurrency(n);
  }, [costo_unitario]);

  const precioVentaFmt = useMemo(() => {
    if (precio_venta == null) return null;
    const n = Number(precio_venta);
    if (Number.isNaN(n)) return null;
    return formatCurrency(n);
  }, [precio_venta]);

  return (

    <tr className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {fecha}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {fechaHoraFmt}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {producto_nombre}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {barcode}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">{getTipoBadge(tipo)}</td>
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
                          {formatearEntero(stock_anterior)} →{" "}
                          <span className="font-medium text-blue-gray-900">{formatearEntero(stock_actual)}</span>
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <Typography variant="small" color="blue-gray">
                            {usuarioNombre}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="max-w-xs truncate">
                          {motivo}
                        </Typography>
                        
                      </td>
                      <td className="p-4">
                        <Chip value={document} variant="outlined" size="sm" />
                        {costoUnitFmt && (
                          <Typography variant="small" className="text-green-600 mt-1">
                            {costoUnitFmt}
                          </Typography>
                        )}
                        {precioVentaFmt && (
                          <Typography variant="small" className="text-blue-600 mt-1">
                            {precioVentaFmt}
                          </Typography>
                        )}
                      </td>
                    </tr>
  )

}

const areEqual = (prev, next) => {
    if (prev.id !== next.id) return false;
    if (prev.fecha_creacion !== next.fecha_creacion) return false;
    if (prev.producto_nombre !== next.producto_nombre) return false;
    if (prev.barcode !== next.barcode) return false;
    if (prev.tipo !== next.tipo) return false;
    if (prev.direction !== next.direction) return false;
    if (prev.cantidad_movimiento !== next.cantidad_movimiento) return false;
    if (prev.stock_anterior !== next.stock_anterior) return false;
    if (prev.stock_actual !== next.stock_actual) return false;
    if (prev.usuarioNombre !== next.usuarioNombre) return false;
    if (prev.motivo !== next.motivo) return false;
    if (prev.document !== next.document) return false;
    if (prev.costo_unitario !== next.costo_unitario) return false;
    if (prev.precio_venta !== next.precio_venta) return false;

    return true;
}

export default memo(MovRows, areEqual);