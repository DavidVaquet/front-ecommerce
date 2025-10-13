"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Tag,
  Folder,
  Grid3X3,
  ChevronDown,
  ChevronRight,
  Package,
  TrendingUp,
  Filter,
  Save,
  ArrowUpRight,
} from "lucide-react"
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Avatar,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Select,
  Option,
  Textarea,
  Switch,
  Typography,
} from "@material-tailwind/react"
import StatsCard from "../../../components/StatsCard"
import { useDebouncedValue } from "../../../hooks/useDebouncedValue"
import { useCategoriaSubcategoria } from "../../../hooks/useCategorias"

export const GestionCategorias = () => {
  const [activeTab, setActiveTab] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroVisibleCat, setFiltroVisibleCat] = useState("");
  const [filtroVisibleSubcat, setFiltroVisibleSubcat] = useState("");
  const [categoriasExpandidas, setCategoriasExpandidas] = useState(new Set([1, 2]));
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false)
  const categoriasPerPage = 25;

  const debouncedSearch = useDebouncedValue(busqueda, 500);
  const limit = categoriasPerPage;
  const offset = (currentPage - 1) * categoriasPerPage;
  const filtros = useMemo(() => {
      const f = { limit, offset, search: debouncedSearch }
      if (activeTab === 'activos') f.estado = true;
      if (activeTab === 'inactivos') f.estado = false;
      if (filtroEstado !=)
  }, [limit, offset, debouncedSearch, activeTab])

  const { data, isLoading, error, refetch, isFetching } = useCategoriaSubcategoria(filtros);
  const categorias = useMemo(() => data?.rows ?? [], [data]);

  // Paginación
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
  const showEmpty = !isLoading && total === 0;

  // Estadísticas
  

  const toggleExpansion = (categoriaId) => {
    const nuevasExpandidas = new Set(categoriasExpandidas)
    if (nuevasExpandidas.has(categoriaId)) {
      nuevasExpandidas.delete(categoriaId)
    } else {
      nuevasExpandidas.add(categoriaId)
    }
    setCategoriasExpandidas(nuevasExpandidas)
  }

  const abrirModal = (categoria = null, edicion = false) => {
    setCategoriaSeleccionada(categoria)
    setModoEdicion(edicion)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setCategoriaSeleccionada(null)
    setModoEdicion(false)
  }

  const getEstadoBadge = (estado) => {
    return estado === "activo" ? (
      <Chip value="Activo" color="green" size="sm" className="text-xs" />
    ) : (
      <Chip value="Inactivo" color="red" size="sm" className="text-xs" />
    )
  }

  

  return (
    <div className="flex flex-col w-full py-6 px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Typography variant="h3" className="font-bold tracking-tight uppercase">
            GESTIÓN DE CATEGORÍAS
          </Typography>
          <Typography variant="paragraph" color="gray" className="mt-1">
            Organiza y administra las categorías y subcategorías de productos
          </Typography>
        </div>
        <div className="flex gap-3">
          <Button variant="outlined" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="flex items-center gap-2 bg-orange-500" onClick={() => abrirModal()}>
            <Plus className="h-5 w-5" />
            NUEVA CATEGORÍA
          </Button>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
        titulo='Total Categorías'
        icono={<Tag className="h-6 w-6 text-blue-500"/>}
        iconoBackground='blue-50'
        colorTyppography='blue-gray'
        valor={1000}
        />
        <StatsCard 
        titulo='Categorías Activas'
        icono={<Grid3X3 className="h-6 w-6 text-green-500"/>}
        iconoBackground='green-50'
        colorTyppography='blue-gray'
        valor={1000}
        />
        <StatsCard 
        titulo='Subcategorías'
        icono={<Folder className="h-6 w-6 text-purple-500"/>}
        iconoBackground='purple-50'
        colorTyppography='blue-gray'
        valor={1000}
        />
        <StatsCard 
        titulo='Total Productos'
        icono={<Tag className="h-6 w-6 text-orange-500"/>}
        iconoBackground='orange-50'
        colorTyppography='blue-gray'
        valor={1000}
        />
      </div>

      {/* Filtros y búsqueda */}
      <Card className="shadow-sm">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                label="Buscar categorías..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select label="Visibilidad de Categorías" value={filtroVisibleCat} onChange={setFiltroVisibleCat}>
              <Option value="">Todos los estados</Option>
              <Option value="1">Activo</Option>
              <Option value="0">Inactivo</Option>
            </Select>
            <Select label="Visibilidad de Subcategorías" value={filtroVisibleSubcat} onChange={setFiltroVisibleSubcat}>
              <Option value="">Todos los estados</Option>
              <Option value="1">Activo</Option>
              <Option value="0">Inactivo</Option>
            </Select>
            
          </div>
        </CardBody>
      </Card>

      {/* Tabs y contenido principal */}
      <Card className="shadow-sm">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsHeader className="p-2">
            <Tab value="todas" className="text-sm font-medium">
              Todas ({totalCategorias})
            </Tab>
            <Tab value="activas" className="text-sm font-medium">
              Activas ({categoriasActivas})
            </Tab>
            <Tab value="inactivas" className="text-sm font-medium">
              Inactivas ({totalCategorias - categoriasActivas})
            </Tab>
          </TabsHeader>

          <TabsBody>
            <TabPanel value={activeTab} className="p-6">
              {categoriasFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Tag className="h-16 w-16 text-gray-400 mb-4" />
                  <Typography variant="h5" className="font-semibold">
                    No se encontraron categorías
                  </Typography>
                  <Typography variant="paragraph" color="gray" className="mt-1">
                    Intenta ajustar los filtros de búsqueda.
                  </Typography>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoriasFiltradas.map((categoria) => (
                    <Card key={categoria.id} className="border border-gray-200">
                      <CardBody className="p-4">
                        {/* Categoría principal */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="text"
                              size="sm"
                              onClick={() => toggleExpansion(categoria.id)}
                              className="p-1"
                            >
                              {categoriasExpandidas.has(categoria.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>

                            <Avatar src={categoria.imagen || "/placeholder.svg"} alt={categoria.nombre} size="md" />

                            <div>
                              <div className="flex items-center gap-2">
                                <Typography variant="h6" className="font-semibold">
                                  {categoria.nombre}
                                </Typography>
                                {getEstadoBadge(categoria.estado)}
                              </div>
                              <Typography variant="small" color="gray">
                                {categoria.descripcion}
                              </Typography>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <Typography variant="small" className="font-medium">
                                {categoria.totalProductos}
                              </Typography>
                              <Typography variant="small" color="gray">
                                Productos
                              </Typography>
                            </div>
                            <div className="text-center">
                              <Typography variant="small" className="font-medium">
                                {categoria.subcategorias.length}
                              </Typography>
                              <Typography variant="small" color="gray">
                                Subcategorías
                              </Typography>
                            </div>
                            <div className="text-center">
                              <Typography variant="small" className="font-medium">
                                {categoria.totalVentas}
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
                                <MenuItem onClick={() => abrirModal(categoria, false)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalles
                                </MenuItem>
                                <MenuItem onClick={() => abrirModal(categoria, true)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </MenuItem>
                                <MenuItem>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Agregar subcategoría
                                </MenuItem>
                                <MenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        </div>

                        {/* Subcategorías expandidas */}
                        {categoriasExpandidas.has(categoria.id) && (
                          <div className="mt-4 ml-8 space-y-2">
                            {categoria.subcategorias.map((subcategoria) => (
                              <div
                                key={subcategoria.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Folder className="h-4 w-4 text-gray-400" />
                                  <Typography variant="small" className="font-medium">
                                    {subcategoria.nombre}
                                  </Typography>
                                  {getEstadoBadge(subcategoria.estado)}
                                </div>
                                <div className="flex items-center gap-4">
                                  <Typography variant="small" color="gray">
                                    {subcategoria.totalProductos} productos
                                  </Typography>
                                  <Menu>
                                    <MenuHandler>
                                      <Button variant="text" size="sm">
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </MenuHandler>
                                    <MenuList>
                                      <MenuItem>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                      </MenuItem>
                                      <MenuItem className="text-red-600">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </div>
                              </div>
                            ))}
                            <Button variant="outlined" size="sm" className="ml-7 mt-2 flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Agregar subcategoría
                            </Button>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>

      {/* Modal de detalles/edición */}
      <Dialog open={modalAbierto} handler={cerrarModal} size="xl">
        <DialogHeader>
          <Typography variant="h4">
            {modoEdicion ? (categoriaSeleccionada ? "Editar Categoría" : "Nueva Categoría") : "Detalles de Categoría"}
          </Typography>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {modoEdicion ? (
            // Formulario de edición
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Nombre de la categoría"
                    placeholder="Ej: Electrónicos"
                    defaultValue={categoriaSeleccionada?.nombre || ""}
                  />
                </div>
                <div>
                  <Select label="Estado" defaultValue={categoriaSeleccionada?.estado || "activo"}>
                    <Option value="activo">Activo</Option>
                    <Option value="inactivo">Inactivo</Option>
                  </Select>
                </div>
              </div>

              <div>
                <Textarea
                  label="Descripción"
                  placeholder="Describe la categoría..."
                  defaultValue={categoriaSeleccionada?.descripcion || ""}
                />
              </div>

              <div>
                <Input
                  label="URL de imagen"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  defaultValue={categoriaSeleccionada?.imagen || ""}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch id="destacada" />
                <Typography variant="small">Categoría destacada</Typography>
              </div>
            </div>
          ) : (
            // Vista de detalles
            categoriaSeleccionada && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={categoriaSeleccionada.imagen || "/placeholder.svg"}
                    alt={categoriaSeleccionada.nombre}
                    size="xl"
                  />
                  <div>
                    <Typography variant="h4" className="font-semibold">
                      {categoriaSeleccionada.nombre}
                    </Typography>
                    <Typography variant="paragraph" color="gray">
                      {categoriaSeleccionada.descripcion}
                    </Typography>
                    {getEstadoBadge(categoriaSeleccionada.estado)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardBody className="p-4 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <Typography variant="h3" className="font-bold">
                        {categoriaSeleccionada.totalProductos}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Productos
                      </Typography>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="p-4 text-center">
                      <Folder className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <Typography variant="h3" className="font-bold">
                        {categoriaSeleccionada.subcategorias.length}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Subcategorías
                      </Typography>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <Typography variant="h3" className="font-bold">
                        {categoriaSeleccionada.totalVentas}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Ventas
                      </Typography>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <Typography variant="h6" className="font-semibold mb-2">
                    Subcategorías
                  </Typography>
                  <div className="space-y-2">
                    {categoriaSeleccionada.subcategorias.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Typography variant="small">{sub.nombre}</Typography>
                        <div className="flex items-center gap-2">
                          <Typography variant="small" color="gray">
                            {sub.totalProductos} productos
                          </Typography>
                          {getEstadoBadge(sub.estado)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outlined" onClick={cerrarModal}>
            Cancelar
          </Button>
          {modoEdicion && (
            <Button className="bg-orange-500" onClick={cerrarModal}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  )
}
