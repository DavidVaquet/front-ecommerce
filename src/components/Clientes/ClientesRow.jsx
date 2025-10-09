import { memo, useCallback } from "react";
import { formatearFecha, formatearFechaHora } from "../../helpers/formatoFecha";
import {
  Typography,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  Eye,
  Edit,
  Globe,
  Store,
  Mail,
  Phone,
  MoreVertical,
  UserCheck,
  UserX,
  Crown
} from "lucide-react";


const getTipoIcon = (esVip) => {
    if (esVip) {
      return <Crown className="h-4 w-4" />
    } else {
      return <UserCheck className="h-4 w-4" />
    }
  }

const getChipColor = (estado) => {
    if (estado === true) return "green"
    if (estado === false) return "red"
    return "blue-gray"
  }  

function ClientesRow ({ usuario, onDetalle, onEdit, onToggleEstado, onAbrirEmail }) {

const verDetalle = useCallback(() => onDetalle(usuario), [onDetalle, usuario]);
const editar = useCallback(() => onEdit(usuario), [onEdit, usuario]);
const toggleEstado = useCallback(() => onToggleEstado(usuario), [onToggleEstado, usuario]);
const abrirEmail = useCallback(() => onAbrirEmail(usuario), [onAbrirEmail, usuario]);


return (

                        <tr className="hover:bg-gray-50">
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={`https://ui-avatars.com/api/background=0D8ABC&color=fff?name=${usuario.nombre}+${usuario.apellido}`}
                              alt={`${usuario.nombre} ${usuario.apellido}`}
                              size="md"
                              className="border border-gray-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                  {usuario.nombre} {usuario.apellido}
                                </Typography>
                                {usuario.es_vip && <Crown className="h-4 w-4 text-yellow-500" />}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Chip
                                    value={usuario.tipo_cliente ?? "Desconocido"}
                                    color={usuario.es_vip ? "yellow" : "blue"}
                                    size="sm"
                                    variant="ghost"
                                    className="rounded-full capitalize"
                                    icon={getTipoIcon(usuario.es_vip)}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-500" />
                              <Typography variant="small" color="blue-gray">
                                {usuario.email}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <Typography variant="small" color="gray">
                                {usuario.telefono}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Chip
                            value={usuario.origen === "online" ? "E-commerce" : "Manual"}
                            color={usuario.origen === "online" ? "purple" : "deep-orange"}
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                            icon={
                              usuario.origen === "online" ? (
                                <Globe className="h-3 w-3" />
                              ) : (
                                <Store className="h-3 w-3" />
                              )
                            }
                          />
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Chip
                            value={usuario.estado === true ? "Activo" : "Inactivo"}
                            color={getChipColor(usuario.estado)}
                            size="sm"
                            variant="ghost"
                            className="rounded-full capitalize"
                          />
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="space-y-1">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {usuario.cantidad_compras} compras
                            </Typography>
                            <Typography variant="small" color="gray">
                              ${Number(usuario.total_gastado)}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="space-y-1">
                            <Typography variant="small" color="blue-gray">
                              {formatearFechaHora(usuario.fecha_ultima_compra)}
                            </Typography>
                            <Typography variant="small" color="gray">
                              Registro: {formatearFecha(usuario.fecha_creacion)}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex gap-2">
                            <IconButton variant="text" color="blue" size="sm" onClick={verDetalle}>
                              <Eye className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              size="sm"
                              onClick={editar}
                            >
                              <Edit className="h-4 w-4" />
                            </IconButton>
                            <Menu>
                              <MenuHandler>
                                <IconButton variant="text" color="blue-gray" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList>
                                <MenuItem
                                className="flex items-center gap-2"
                                onClick={abrirEmail}
                                >
                                  <Mail className="h-4 w-4" />
                                  Enviar email
                                </MenuItem>
                                <MenuItem className="flex items-center gap-2" onClick={toggleEstado}>
                                  <UserX className="h-4 w-4" />
                                  {usuario.estado === true ? "Suspender cuenta" : "Reactivar cuenta"}
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        </td>
                      </tr>

    )
};

const areEqual = (prev, next) => {
  const a = prev.usuario, b = next.usuario;

  const sameUsuario =
    a.id === b.id &&
    a.nombre === b.nombre &&
    a.apellido === b.apellido &&
    a.email === b.email &&
    a.telefono === b.telefono &&
    a.origen === b.origen &&
    a.estado === b.estado &&
    a.vip === b.vip &&
    a.tipo_cliente === b.tipo_cliente &&
    a.cantidad_compras === b.cantidad_compras &&
    a.total_gastado === b.total_gastado &&
    a.fecha_ultima_compra === b.fecha_ultima_compra &&
    a.fecha_creacion === b.fecha_creacion;

  const sameHandlers =
    prev.onDetalle === next.onDetalle &&
    prev.onEdit === next.onEdit &&
    prev.onToggleEstado === next.onToggleEstado &&
    prev.onAbrirEmail === next.onAbrirEmail;

  return sameUsuario && sameHandlers;
};

export default memo(ClientesRow, areEqual);