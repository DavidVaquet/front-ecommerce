import { memo, useMemo } from "react";
import { mostrarImagen } from "../../helpers/mostrarImagen";
import { Avatar, Typography } from "@material-tailwind/react";


function ProductRowVentas({
    imagen, nombre, precio, cantidad, id
}) {

    const subtotal = useMemo(() => precio * cantidad, [precio, cantidad]);
    return (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                  <Avatar
                                    src={mostrarImagen(imagen)}
                                    alt={nombre}
                                    size="sm"
                                    variant="rounded"
                                    className="border border-gray-200"
                                  />
                                  <div className="flex-1">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {nombre}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                      ${precio.toFixed(2)} × {cantidad}
                                    </Typography>
                                  </div>
                                  <Typography variant="small" color="blue-gray" className="font-bold">
                                    ${subtotal.toFixed(2)}
                                  </Typography>
                                </div>
    )
}

function areEqual(prev, next) {
  return (
    prev.id === next.id &&
    prev.nombre === next.nombre &&
    prev.precio === next.precio &&
    prev.cantidad === next.cantidad &&
    prev.imagen === next.imagen
  );
}

export default memo(ProductRowVentas, areEqual);