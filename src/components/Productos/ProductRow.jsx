import { memo, useCallback, useMemo } from "react";
import { mostrarImagen } from "../../helpers/mostrarImagen";
import { formatearPesos } from "../../helpers/formatearPesos";
import { Avatar, Chip, IconButton, Typography } from "@material-tailwind/react";
import { Eye, Edit, Power, PowerOff, Trash2, TrendingUp } from "lucide-react";


const obtenerEstadoProducto = (producto) => {
  if (producto.estado === 0) return "Inactivo";
  if (producto.stock_cantidad === 0) return "Sin stock";
  if (producto.stock_cantidad < 10) return "Bajo stock";
  return "Activo";
};

const getChipColor = (estado) => {
  switch (estado) {
    case "Activo":
      return "green";
    case "Sin stock":
      return "red";
    case "Bajo stock":
      return "amber";
    case "Inactivo":
      return "gray";
    default:
      return "blue-gray";
  }
};

const areEqual = (prev, next) => {
  const a = prev.producto, b = next.producto;
  const same =
    a.id === b.id &&
    a.nombre === b.nombre &&
    a.categoria_nombre === b.categoria_nombre &&
    a.precio === b.precio &&
    a.precio_costo === b.precio_costo &&
    a.cantidad === b.cantidad &&
    a.stock_cantidad === b.stock_cantidad &&
    (a.total_vendido || 0) === (b.total_vendido || 0) &&
    a.estado === b.estado &&
    a.imagen_url === b.imagen_url &&
    a.barcode === b.barcode;

  return same
    && prev.onView === next.onView
    && prev.onEdit === next.onEdit
    && prev.onActivar === next.onActivar
    && prev.onDesactivar === next.onDesactivar
    && prev.onDelete === next.onDelete;
};

const ProductRow = memo(function ProductRow({ producto, onView, onDelete, onActivar, onDesactivar, onEdit}) {
    const estadoStr = useMemo(() => obtenerEstadoProducto(producto), [producto.estado, producto.stock_cantidad, producto]);
    const chipColor = useMemo(() => getChipColor(estadoStr), [estadoStr]);

    const ver = useCallback(() => onView(producto), [onView, producto]);
    const editar = useCallback(() => onEdit(producto), [onEdit, producto]);
    const eliminar = useCallback(() => onDelete(producto), [onDelete, producto]);
    const activar = useCallback(() => onActivar(producto), [onActivar, producto]);
    const desactivar = useCallback(() => onDesactivar(producto), [onDesactivar, producto]);

        return (
    <tr className="hover:bg-gray-50">
      <td className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar
            src={mostrarImagen(producto.imagen_url)}
            alt={producto.nombre}
            size="md"
            variant="rounded"
            className="border border-gray-200 p-1"
          />
          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="font-medium">
              {producto.nombre}
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-xs">
              Barcode: {producto.barcode}
            </Typography>
          </div>
        </div>
      </td>

      <td className="p-4 border-b border-gray-200">
        <Typography variant="small" color="blue-gray">
          {producto.categoria_nombre || "Sin categoría"}
        </Typography>
      </td>

      <td className="p-4 border-b border-gray-200">
        <Typography variant="small" color="blue-gray" className="font-medium">
          ${formatearPesos(producto.precio)}
        </Typography>
      </td>

      <td className="p-4 border-b border-gray-200">
        <Typography variant="small" color="blue-gray" className="font-medium">
          ${formatearPesos(producto.precio_costo)}
        </Typography>
      </td>

      <td className="p-4 border-b border-gray-200 text-center">
        <Typography variant="small" color="blue-gray">
          {producto.cantidad}
        </Typography>
      </td>

      <td className="p-4 border-b border-gray-200 text-center">
        <Chip value={estadoStr} color={chipColor} size="sm" variant="ghost" className="rounded-full" />
      </td>

      <td className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 justify-center">
          <Typography variant="small" color="blue-gray">
            {producto.total_vendido || 0}
          </Typography>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
      </td>

      <td className="p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <IconButton variant="text" color="blue-gray" size="sm" onClick={ver}>
            <Eye className="h-4 w-4" />
          </IconButton>
          <IconButton variant="text" color="blue" size="sm" onClick={editar}>
            <Edit className="h-4 w-4" />
          </IconButton>

          {producto.estado === 0 ? (
            <IconButton
              variant="text"
              color="green"
              size="sm"
              onClick={activar}
            >
              <Power className="h-4 w-4" />
            </IconButton>
          ) : (
            <IconButton
              variant="text"
              color="red"
              size="sm"
              onClick={desactivar}
            >
              <PowerOff className="h-4 w-4" />
            </IconButton>
          )}

          <IconButton variant="text" color="red" size="sm" onClick={eliminar}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
    
});

export default memo(ProductRow, areEqual);