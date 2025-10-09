import { useCallback, memo, useRef, useEffect } from "react";
import ProductRowVentas from "./ProductRowVentas";
import { formatearFecha } from "../../helpers/formatoFecha";
import { Card, CardBody, Typography, Chip, Menu, MenuHandler, MenuList, MenuItem, Button, IconButton } from "@material-tailwind/react";
import {
  Eye,
  Package,
  CreditCard,
  DollarSign,
  User,
  Store,
  Globe,
  Download,
  Receipt,
  MoreVertical,
  Clock,
  MapPin,
  Smartphone
} from "lucide-react"

function VentasRow ({
    id, codigo, canal, fecha, medio_pago, usuarioNombre,
    orden, clienteNombre, clienteEmail, clienteTelefono,
    productos, onDescargarRecibo, subtotal, total, descuento,
    impuestos, onDetalle, venta
}) {

    const descargar = useCallback(() => {
        onDescargarRecibo?.(codigo);
    }, [onDescargarRecibo, codigo]);

    const ventaRef = useRef(venta);
    useEffect(() => { ventaRef.current = venta; }, [venta]);

    const verDetalle = useCallback(() => {
    onDetalle(ventaRef.current);
    }, [onDetalle]);

    const cantProductos = productos?.length ?? 0;

    return (
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardBody className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Información principal */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                  {codigo}
                                </Typography>
                                <Chip
                                  value={canal === "local" ? "Local" : "E-commerce"}
                                  color={canal === "local" ? "deep-orange" : "purple"}
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full"
                                  icon={
                                    canal === "local" ? (
                                      <Store className="h-3 w-3 mt-[1px]" />
                                    ) : (
                                      <Globe className="h-3 w-3 mt-[1px]" />
                                    )
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatearFecha(fecha)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-4 w-4" />
                                  <span className="capitalize">{medio_pago}</span>
                                </div>
                              </div>
                              {canal === "local" ? (
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>Vendedor: {usuarioNombre}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Sucursal Illia</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Smartphone className="h-4 w-4" />
                                    <span>Plataforma: Tienda Ecommerce</span>
                                  </div>
                                  {orden && (
                                    <div className="flex items-center gap-1">
                                      <Package className="h-4 w-4" />
                                      <span>Orden: {orden}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <Menu>
                              <MenuHandler>
                                <IconButton variant="text" color="blue-gray">
                                  <MoreVertical className="h-4 w-4" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList>
                                <MenuItem className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Ver detalles
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2">
                                  <Receipt className="h-4 w-4" />
                                  Imprimir recibo
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2" onClick={descargar}>
                                  <Download className="h-4 w-4" />
                                  Descargar PDF
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>

                          {/* Información del cliente */}
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium mb-2 flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              Cliente
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <span>
                                <strong>Nombre:</strong> {clienteNombre}
                              </span>
                              <span>
                                <strong>Email:</strong> {clienteEmail}
                              </span>
                              <span>
                                <strong>Teléfono:</strong> {clienteTelefono}
                              </span>
                            </div>
                          </div>

                          {/* Productos */}
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium mb-3 flex items-center gap-2"
                            >
                              <Package className="h-4 w-4" />
                              Productos ({cantProductos})
                            </Typography>
                            <div className="space-y-2">
                              {productos.map((producto) => (
                                <ProductRowVentas 
                                imagen={producto.imagen}
                                nombre={producto.nombre}
                                precio={producto.precio}
                                cantidad={producto.cantidad}
                                id={producto.id}
                                key={producto.id}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Resumen financiero */}
                        <div className="lg:w-80">
                          <Card className="bg-gray-50 border border-gray-200">
                            <CardBody className="p-4">
                              <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Resumen de Venta
                              </Typography>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <Typography variant="small" color="blue-gray">
                                    Subtotal:
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    ${subtotal}
                                  </Typography>
                                </div>
                                {descuento > 0 && (
                                  <div className="flex justify-between">
                                    <Typography variant="small" color="blue-gray">
                                      Descuento:
                                    </Typography>
                                    <Typography variant="small" color="red" className="font-medium">
                                      -${descuento}
                                    </Typography>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <Typography variant="small" color="blue-gray">
                                    Impuestos:
                                  </Typography>
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    ${impuestos}
                                  </Typography>
                                </div>
                                <hr className="border-gray-300" />
                                <div className="flex justify-between">
                                  <Typography variant="h6" color="blue-gray">
                                    Total:
                                  </Typography>
                                  <Typography variant="h6" color="deep-orange" className="font-bold">
                                    ${total.toFixed(2)}
                                  </Typography>
                                </div>
                              </div>
                              <div className="mt-4">
                                <Button color="deep-orange" className="w-full" size="sm" onClick={verDetalle}>
                                  Ver Detalles Completos
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
    )
}

const areEqual = (prev, next) => {

  if (prev.id !== next.id) return false;
  if (prev.codigo !== next.codigo) return false;
  if (prev.canal !== next.canal) return false;
  if (prev.fecha !== next.fecha) return false;
  if (prev.medio_pago !== next.medio_pago) return false;

  if (prev.usuarioNombre !== next.usuarioNombre) return false;
  if (prev.orden !== next.orden) return false;

  if (prev.clienteNombre !== next.clienteNombre) return false;
  if (prev.clienteEmail !== next.clienteEmail) return false;
  if (prev.clienteTelefono !== next.clienteTelefono) return false;

  if (prev.subtotal !== next.subtotal) return false;
  if (prev.descuento !== next.descuento) return false;
  if (prev.impuestos !== next.impuestos) return false;
  if (prev.total !== next.total) return false;

  if (prev.onDescargarRecibo !== next.onDescargarRecibo) return false;
  if (prev.onDetalle !== next.onDetalle) return false;

  return true;
}

export default memo(VentasRow, areEqual);