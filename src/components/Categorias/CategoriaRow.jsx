"use client"

import { useMemo, memo } from "react"
import { Plus, Edit, Trash2, Eye, MoreVertical, Folder, ChevronDown, ChevronRight } from "lucide-react"
import {
  Card,
  CardBody,
  Button,
  Chip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react"

const EstadoBadge = ({ estado }) =>
  estado ? (
    <Chip value="Activo" color="green" variant="filled" size="sm" className="text-xs" />
  ) : (
    <Chip value="Inactivo" color="red" variant="filled" size="sm" className="text-xs" />
  )

const VisibleEdge = ({ visible }) =>
  Number(visible) === 1 ? (
    <Chip value="Visible" color="blue" variant="filled" size="sm" className="text-xs" />
  ) : (
    <Chip value="Oculta" color="gray" variant="outlined" size="sm" className="text-xs" />
  )

export const CategoriaRow = memo(
  function CategoriaRow({
    categoria,
    expandida,
    onToggle,
    onAbrirModal,
    onAgregarSubcategoria,
    onDeleteCategoria,
    onAbrirSubcategoria,
    onEliminarSubcategoria,
  }) {
    const subcatsOrdenadas = useMemo(
      () => [...(categoria.subcategorias ?? [])].sort((a, b) => a?.nombre?.localeCompare(b?.nombre ?? "") || 0),
      [categoria.subcategorias],
    )

    return (
      <Card className="border border-gray-200 text-black">
        <CardBody className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start md:items-center gap-2 md:gap-4 flex-1">
              <Button
                variant="text"
                size="sm"
                onClick={() => onToggle(categoria.id)}
                className="p-1 min-w-0 mt-1 md:mt-0"
              >
                {expandida ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Typography variant="h6" className="font-semibold text-base md:text-lg">
                    {categoria.nombre}
                  </Typography>
                  <EstadoBadge estado={categoria.activo} />
                  <VisibleEdge visible={categoria.visible} />
                </div>
                <Typography variant="small" color="gray" className="text-xs mt-2 md:text-sm line-clamp-2 md:line-clamp-1">
                  {categoria.descripcion}
                </Typography>
                <div className="flex md:hidden items-center gap-3 mt-2 text-xs">
                  <span className="text-gray-600">{categoria.totalProductos ?? 0} prod.</span>
                  <span className="text-gray-600">{categoria.subcategorias?.length ?? 0} subcat.</span>
                  <span className="text-gray-600">{categoria.totalVentas ?? 0} ventas</span>
                </div>
              </div>

              <div className="md:hidden">
                <Menu>
                  <MenuHandler>
                    <Button variant="text" size="sm" className="p-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => onAbrirModal(categoria, false)}>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" /> Ver detalles
                      </div>
                    </MenuItem>
                    <MenuItem onClick={() => onAbrirModal(categoria, true)}>
                      <div className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </div>
                    </MenuItem>
                    <MenuItem onClick={() => onAgregarSubcategoria(categoria)}>
                      <div className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" /> Agregar subcategoría
                      </div>
                    </MenuItem>
                    <MenuItem className="text-red-600" onClick={() => onDeleteCategoria(categoria.id)}>
                      <div className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                      </div>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <Typography variant="small" className="font-medium">
                  {categoria.totalProductos ?? 0}
                </Typography>
                <Typography variant="small" color="gray">
                  Productos
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="small" className="font-medium">
                  {categoria.subcategorias?.length ?? 0}
                </Typography>
                <Typography variant="small" color="gray">
                  Subcategorías
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="small" className="font-medium">
                  {categoria.totalVentas ?? 0}
                </Typography>
                <Typography variant="small" color="gray">
                  Ventas
                </Typography>
              </div>

              <Menu>
                <MenuHandler>
                  <Button variant="text" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => onAbrirModal(categoria, false)}>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" /> Ver detalles
                    </div>
                  </MenuItem>
                  <MenuItem onClick={() => onAbrirModal(categoria, true)}>
                    <div className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </div>
                  </MenuItem>
                  {/* <MenuItem onClick={() => onAgregarSubcategoria(categoria)}>
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" /> Agregar subcategoría
                    </div>
                  </MenuItem> */}
                  <MenuItem className="text-red-600" onClick={() => onDeleteCategoria(categoria.id)}>
                    <div className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>

          {/* subcategorías */}
          {expandida && (
            <div className="mt-3 md:mt-4 ml-4 md:ml-8 space-y-2">
              {subcatsOrdenadas.map((subcategoria) => (
                <div
                  key={subcategoria.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 md:p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <Folder className="h-3 w-3 md:h-4 md:w-4 text-gray-400 flex-shrink-0" />
                    <Typography variant="small" className="font-medium text-xs md:text-sm truncate">
                      {subcategoria.nombre}
                    </Typography>
                    <EstadoBadge estado={subcategoria.estado} />
                    <VisibleEdge visible={subcategoria.visible} />
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 ml-5 md:ml-0">
                    <Typography variant="small" color="gray" className="text-xs md:text-sm">
                      {subcategoria.totalProductos ?? 0} productos
                    </Typography>
                    <Menu>
                      <MenuHandler>
                        <Button variant="text" size="sm" className="p-1">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem onClick={() => onAbrirSubcategoria(subcategoria, true)}>
                          <div className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </div>
                        </MenuItem>
                        <MenuItem className="text-red-600" onClick={() => onEliminarSubcategoria(subcategoria.id)}>
                          <div className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </div>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </div>
              ))}
              <Button
                variant="outlined"
                size="sm"
                className="ml-3 md:ml-7 mt-2 flex items-center gap-2 text-xs md:text-sm"
                onClick={() => onAgregarSubcategoria(categoria)}
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4" /> Agregar subcategoría
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    )
  },
  (prev, next) => {
    return (
      prev.expandida === next.expandida &&
        prev.categoria.id === next.categoria.id &&
        prev.categoria.nombre === next.categoria.nombre &&
        prev.categoria.descripcion === next.categoria.descripcion &&
        prev.categoria.activo === next.categoria.activo &&
        (prev.categoria.subcategorias?.length ?? 0) === (next.categoria.subcategorias?.length ?? 0),
      prev.onAbrirModal === next.onAbrirModal,
      prev.onAgregarSubcategoria === next.onAgregarSubcategoria,
      prev.onDeleteCategoria === next.onDeleteCategoria
    )
  },
)
