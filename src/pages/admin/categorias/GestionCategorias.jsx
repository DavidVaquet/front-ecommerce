"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import {
  Search,
  Plus,
  Tag,
  Folder,
  Grid3X3,
  Package,
  TrendingUp,
  Filter,
  Save
} from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  Button,
  Input,
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
  Select,
  Option,
  Textarea,
  Switch,
  Typography,
  IconButton,
  Chip
} from "@material-tailwind/react"
import StatsCard from "../../../components/StatsCard"
import { useDebouncedValue } from "../../../hooks/useDebouncedValue"
import { useCategoriaSubcategoria, useStatsCategoriaSubcategorias } from "../../../hooks/useCategorias"
import { CategoriaRow } from "../../../components/Categorias/CategoriaRow";
import { useNotificacion } from "../../../hooks/useNotificacion"
import { useCategoriasMutation } from "../../../hooks/useCategoriasMutation";
import { useSubcategoriasMutation } from "../../../hooks/useSubcategoriaMutation";

const EstadoBadge = (estado) =>
  estado == true ? (
    <Chip value='Activo' color="green" size="sm" className="text-xs" />
  ) : (
    <Chip value='Inactivo' color="red" size="sm" className="text-xs" />
  );


export const GestionCategorias = () => {
  const [activeTab, setActiveTab] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstadoSubcategoria, setFiltroEstadoSubcategoria] = useState("");
  const [filtroVisibleCat, setFiltroVisibleCat] = useState("");   
  const [filtroVisibleSubcat, setFiltroVisibleSubcat] = useState(""); 
  const [categoriasExpandidas, setCategoriasExpandidas] = useState(new Set([1, 2]));
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombreCategoria: "",
    descripcionCategoria: "",
    estadoCategoria: ""
  })
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState({
    nombre: "",
    descripcion: "",
    estado: "",
    categoria_id: null
  })

  // NOTIFICACIONES
  const {componenteAlerta, mostrarNotificacion} = useNotificacion();

  const categoriasPerPage = 25;
  const debouncedSearch = useDebouncedValue(busqueda, 500);
  const limit = categoriasPerPage;
  const offset = (currentPage - 1) * categoriasPerPage;

  
  const filtros = useMemo(() => {
    const f = { limit, offset, search: debouncedSearch };
    if (activeTab === "activas") f.estado = true;     
    if (activeTab === "inactivas") f.estado = false;
    if (filtroVisibleCat === "1") f.visible = "1";
    if (filtroVisibleCat === "0") f.visible = "0";
    if (filtroVisibleSubcat === "1") f.visibleSub = "1";
    if (filtroVisibleSubcat === "0") f.visibleSub = "0";
    return f;
  }, [limit, offset, debouncedSearch, activeTab, filtroVisibleCat, filtroVisibleSubcat]);

  const { data, isLoading } = useCategoriaSubcategoria(filtros);
  const categorias = useMemo(() => data?.rows ?? [], [data]);

  const { data: stats } = useStatsCategoriaSubcategorias();
  const totalCategorias = stats?.total_categorias ?? 0;
  const categoriasActivas = stats?.categorias_activas ?? 0;
  const categoriasInactivas = stats?.categorias_inactivas ?? 0;

  // paginación
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  // CATEGORIAS
  const handleOpen = () => setOpen(!open);

  const { crearCategoria } = useCategoriasMutation();

  const resetFieldsCategorys = () => {
    setNuevaCategoria(prev => ({
       ...prev, 
       nombreCategoria: "",
       estadoCategoria: "",
       descripcionCategoria: ""
      }))
  };

  const handleNewCategory = async (e) => {
    e.preventDefault();

    try {
      const payload = {
      nombre: nuevaCategoria.nombreCategoria,
      descripcion: nuevaCategoria.descripcionCategoria,
      activo: nuevaCategoria.estadoCategoria
    };

      const cate = await crearCategoria.mutateAsync(payload)

      if (cate?.ok) {
        mostrarNotificacion('success', 'Categoría creada correctamente');
        resetFieldsCategorys();
        handleOpen();
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message || 'Error al crear la categoría');
    }
    
    
  };


  // SUBCATEGORIAS
  const handleOpenModalSub = useCallback((categoria) => {
    setCategoriaSeleccionada(categoria);
    setOpenSub(true);
  }, []);

  const handleCloseModalSub = useCallback(() => {
    setCategoriaSeleccionada(null);
    setOpenSub(false);
  }, []);

  // MUTATION
  const {crearSubcategoria} = useSubcategoriasMutation();

  useEffect(() => {
    if (openSub && categoriaSeleccionada) {
      setNuevaSubcategoria(prev => ({ ...prev, categoria_id: categoriaSeleccionada.id}))
    }
  }, [openSub, categoriaSeleccionada]);

  const resetFieldsSubCategorys = () => {
    setNuevaSubcategoria(prev => ({
      ...prev,
      nombre: "",
      descripcion: "",
      categoria_id: null,
      estado: ""
    }))
  };
  

  const handleNewSubcategory = async (e) => {
    e.preventDefault();
  
  try {
      
        const payload = {
          nombre: nuevaSubcategoria.nombre,
          descripcion: nuevaSubcategoria.descripcion,
          activo: nuevaSubcategoria.estado,
          categoria_id: Number(nuevaSubcategoria.categoria_id)
          }
        
        const subcate =  await crearSubcategoria.mutateAsync(payload);
        if (subcate?.ok) {
          mostrarNotificacion('success', 'Subcategoría creada correctamente');
          resetFieldsSubCategorys();
          handleCloseModalSub()
        }
    } catch (error) {
        mostrarNotificacion('error', error.message || 'Error al crear la subcategoría');
    }
  };



  const toggleExpansion = useCallback((categoriaId) => {
    setCategoriasExpandidas((prev) => {
      const next = new Set(prev);
      next.has(categoriaId) ? next.delete(categoriaId) : next.add(categoriaId);
      return next;
    });
  }, []);

  const abrirModal = useCallback((categoria = null, edicion = false) => {
    setCategoriaSeleccionada(categoria);
    setModoEdicion(edicion);
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
    setModoEdicion(false);
  }, []);

  return (
    <div className="flex flex-col w-full py-6 px-8 space-y-8">
      {/* Notificaciones */}
      {componenteAlerta}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Typography variant="h3" className="font-semibold text-black tracking-tight uppercase">
            GESTIÓN DE CATEGORÍAS
          </Typography>
          <Typography variant="paragraph" color="gray" className="mt-1">
            Organiza y administra las categorías y subcategorías de tus productos
          </Typography>
        </div>
        <div className="flex gap-3">
          <Button variant="outlined" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="flex items-center gap-2 bg-orange-500" onClick={handleOpen}>
            <Plus className="h-5 w-5" />
            NUEVA CATEGORÍA
          </Button>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          titulo="Total Categorías"
          icono={<Tag className="h-6 w-6 text-blue-500" />}
          iconoBackground="blue-50"
          colorTyppography="blue-gray"
          valor={totalCategorias}
        />
        <StatsCard
          titulo="Categorías Activas"
          icono={<Grid3X3 className="h-6 w-6 text-green-500" />}
          iconoBackground="green-50"
          colorTyppography="blue-gray"
          valor={categoriasActivas}
        />
        <StatsCard
          titulo="Categorías Inactivas"
          icono={<Grid3X3 className="h-6 w-6 text-red-500" />}
          iconoBackground="red-50"
          colorTyppography="blue-gray"
          valor={categoriasInactivas}
        />
        <StatsCard
          titulo="Subcategorías"
          icono={<Folder className="h-6 w-6 text-purple-500" />}
          iconoBackground="purple-50"
          colorTyppography="blue-gray"
          valor={categorias.reduce((acc, c) => acc + (c.subcategorias?.length ?? 0), 0)}
        />
      </div>

      {/* Filtros y búsqueda */}
      <Card className="shadow-sm">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                label="Buscar categorías..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select label="Estado de las subcategorías" value={filtroEstadoSubcategoria} onChange={(val) => setFiltroEstadoSubcategoria(val)}>
              <Option value="">Todos los estados</Option>
              <Option value="true">Activas</Option>
              <Option value="false">Inactivas</Option>
            </Select>
            <Select label="Visibilidad de las subcategorías" value={filtroVisibleSubcat} onChange={(val) => setFiltroVisibleSubcat(val)}>
              <Option value="">Todos los estados</Option>
              <Option value="1">Visible</Option>
              <Option value="0">Oculta</Option>
            </Select>
            <Select label="Visibilidad de las categorías" value={filtroVisibleCat} onChange={(val) => setFiltroVisibleCat(val)}>
              <Option value="">Todos los estados</Option>
              <Option value="1">Visible</Option>
              <Option value="0">Oculta</Option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Tabs y contenido */}
      <Card className="shadow-sm">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsHeader className="p-2">
            <Tab 
            value="todas" 
            className="text-sm font-medium"
            onClick={() => {
              setActiveTab('todas'),
              setCurrentPage(1)
            }}
            >
              Todas ({totalCategorias})
            </Tab>
            <Tab 
            value="activas" 
            className="text-sm font-medium"
            onClick={() => {
              setActiveTab('activas'),
              setCurrentPage(1)
            }}
            >
              Activas ({categoriasActivas})
              </Tab>
            <Tab 
            value="inactivas" 
            className="text-sm font-medium"
            onClick={() => {
              setActiveTab('inactivas'),
              setCurrentPage(1)
            }}
            >
              Inactivas ({categoriasInactivas})
              </Tab>
          </TabsHeader>

          <TabsBody>
            <TabPanel value={activeTab} className="p-6">
              {isLoading ? (
                <Typography>Cargando…</Typography>
              ) : categorias.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Tag className="h-16 w-16 text-gray-400 mb-4" />
                  <Typography variant="h5" className="font-semibold">No se encontraron categorías</Typography>
                  <Typography variant="paragraph" color="gray" className="mt-1">
                    Intenta ajustar los filtros de búsqueda.
                  </Typography>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorias.map((categoria) => (
                    <CategoriaRow
                      key={categoria.id}
                      categoria={categoria}
                      expandida={categoriasExpandidas.has(categoria.id)}
                      onToggle={toggleExpansion}
                      onAbrirModal={abrirModal}
                      onAgregarSubcategoria={handleOpenModalSub}
                    />
                  ))}
                </div>
              )}
              {/* paginación simple */}
              <div className="flex items-center justify-between mt-6">
                <Typography variant="small" color="gray">
                  {total === 0 ? "Sin resultados" : `Mostrando ${start}-${end} de ${total} categorías`}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>

          {/* Modal - Categorias*/}
            <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
              <form onSubmit={handleNewCategory}>
                <DialogHeader className="relative m-0 block">
                  <Typography variant="h4" color="blue-gray">
                    Nueva categoria
                  </Typography>
                  <Typography className="mt-1 font-normal text-gray-600">
                    Completa el formulario para crear una nueva categoría en el
                    sistema.
                  </Typography>
                  <IconButton
                    size="sm"
                    variant="text"
                    className="!absolute right-3.5 top-3.5"
                    onClick={handleOpen}
                  >
                    <XMarkIcon className="h-4 w-4 stroke-2" />
                  </IconButton>
                </DialogHeader>
                <DialogBody className="space-y-4 pb-6">
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Nombre <span className="text-red-900 font-bold text-md">*</span>
                    </Typography>
                    <Input
                      color="gray"
                      size="lg"
                      placeholder="ej. Celulares"
                      name="name"
                      onChange={(e) => setNuevaCategoria(prev => ({ ...prev, nombreCategoria: e.target.value}))}
                      value={nuevaCategoria.nombreCategoria}
                      className="placeholder:opacity-100 focus:!border-t-gray-900"
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Estado actual{" "}
                      <span className="text-red-900 font-bold text-md">*</span>
                    </Typography>
                    <Select
                      className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                      placeholder="1"
                      value={nuevaCategoria.estadoCategoria}
                      onChange={(val) => setNuevaCategoria(prev => ({ ...prev, estadoCategoria: val}))}
                      labelProps={{
                        className: "hidden",
                      }}
                    >
                      <Option value="true">Activo</Option>
                      <Option value="false">Inactivo</Option>
                    </Select>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Descripción (Opcional)
                    </Typography>
                    <Textarea
                      rows={4}
                      onChange={(e) => setNuevaCategoria(prev => ({ ...prev, descripcionCategoria: e.target.value}))}
                      value={nuevaCategoria.descripcionCategoria}
                      placeholder="ej. Esto es una marca de celulares."
                      className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button className="ml-auto" type="submit" disabled={crearCategoria.isPending}>
                    Añadir categoria
                  </Button>
                </DialogFooter>
              </form>
            </Dialog>

      {/* Modal */}
      <Dialog open={modalAbierto} handler={cerrarModal} size="xl">
        <DialogHeader>
          <Typography variant="h4">
            {modoEdicion ? (categoriaSeleccionada ? "Editar Categoría" : "Nueva Categoría") : "Detalles de Categoría"}
          </Typography>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {modoEdicion ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input label="Nombre de la categoría" placeholder="Ej: Electrónicos" defaultValue={categoriaSeleccionada?.nombre || ""} />
                </div>
                <div>
                  <Select label="Estado" defaultValue={categoriaSeleccionada?.estado || "activo"}>
                    <Option value="activo">Activo</Option>
                    <Option value="inactivo">Inactivo</Option>
                  </Select>
                </div>
              </div>

              <div>
                <Textarea label="Descripción" placeholder="Describe la categoría..." defaultValue={categoriaSeleccionada?.descripcion || ""} />
              </div>

              <div>
                <Input label="URL de imagen" placeholder="https://ejemplo.com/imagen.jpg" defaultValue={categoriaSeleccionada?.imagen || ""} />
              </div>

              <div className="flex items-center gap-2">
                <Switch id="destacada" />
                <Typography variant="small">Categoría destacada</Typography>
              </div>
            </div>
          ) : (
            categoriaSeleccionada && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar src={categoriaSeleccionada.imagen || "/placeholder.svg"} alt={categoriaSeleccionada.nombre} size="xl" />
                  <div>
                    <Typography variant="h4" className="font-semibold">{categoriaSeleccionada.nombre}</Typography>
                    <Typography variant="paragraph" color="gray">{categoriaSeleccionada.descripcion}</Typography>
                    <EstadoBadge estado={categoriaSeleccionada.activo} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardBody className="p-4 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <Typography variant="h3" className="font-bold">{categoriaSeleccionada.totalProductos ?? 0}</Typography>
                      <Typography variant="small" color="gray">Productos</Typography>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="p-4 text-center">
                      <Folder className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <Typography variant="h3" className="font-bold">{categoriaSeleccionada.subcategorias?.length ?? 0}</Typography>
                      <Typography variant="small" color="gray">Subcategorías</Typography>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <Typography variant="h3" className="font-bold">{categoriaSeleccionada.totalVentas ?? 0}</Typography>
                      <Typography variant="small" color="gray">Ventas</Typography>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <Typography variant="h6" className="font-semibold mb-2">Subcategorías</Typography>
                  <div className="space-y-2">
                    {(categoriaSeleccionada.subcategorias ?? []).map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Typography variant="small">{sub.nombre}</Typography>
                        <div className="flex items-center gap-2">
                          <Typography variant="small" color="gray">{sub.totalProductos ?? 0} productos</Typography>
                          <EstadoBadge estado={sub.activo} />
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
          <Button variant="outlined" onClick={cerrarModal}>Cancelar</Button>
          {modoEdicion && (
            <Button className="bg-orange-500" onClick={cerrarModal}>
              <Save className="h-4 w-4 mr-2" /> Guardar Cambios
            </Button>
          )}
        </DialogFooter>
      </Dialog>

      {/* Modal - SubCategorias*/}
            <Dialog size="sm" open={openSub} handler={handleOpenModalSub} className="p-4">
              <form onSubmit={handleNewSubcategory}>
                <DialogHeader className="relative m-0 block">
                  <Typography variant="h4" color="blue-gray">
                    Nueva subcategoria
                  </Typography>
                  <Typography className="mt-1 font-normal text-gray-600">
                    Completa el formulario para crear una nueva subcategoría en el
                    sistema.
                  </Typography>
                  <IconButton
                    size="sm"
                    variant="text"
                    className="!absolute right-3.5 top-3.5"
                    onClick={handleCloseModalSub}
                  >
                    <XMarkIcon className="h-4 w-4 stroke-2" />
                  </IconButton>
                </DialogHeader>
                <DialogBody className="space-y-4 pb-6">
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Nombre <span className="text-red-900 font-bold text-md">*</span>
                    </Typography>
                    <Input
                      color="gray"
                      size="lg"
                      placeholder="ej. Apple"
                      value={nuevaSubcategoria?.nombre}
                      onChange={(e) => setNuevaSubcategoria(prev => ({ ...prev, nombre: e.target.value}))}
                      name="name"
                      className="placeholder:opacity-100 focus:!border-t-gray-900"
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Categoria perteneciente{" "}
                      <span className="text-red-900 font-bold text-md">*</span>
                    </Typography>
                     <Input
                      color="gray"
                      size="lg"
                      value={categoriaSeleccionada?.nombre}
                      disabled
                      readOnly
                      name="name"
                      className="placeholder:opacity-100 focus:!border-t-gray-900"
                      containerProps={{
                        className: "!min-w-full",
                      }}
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                   
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Estado actual{" "}
                      <span className="text-red-900 font-bold text-md">*</span>
                    </Typography>
                    <Select
                      className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                      placeholder="1"
                      onChange={(val) => setNuevaSubcategoria(prev => ({ ...prev, estado: val}))}
                      value={nuevaSubcategoria?.estado}
                      labelProps={{
                        className: "hidden",
                      }}
                    >
                      <Option value="true">Activo</Option>
                      <Option value="false">Inactivo</Option>
                    </Select>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Descripción (Opcional)
                    </Typography>
                    <Textarea
                      rows={4}
                      placeholder="ej. Esto es una marca de celulares."
                      value={nuevaSubcategoria?.descripcion}
                      onChange={(e) => setNuevaSubcategoria(prev => ({ ...prev, descripcion: e.target.value}))}
                      className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button className="ml-auto" type="submit" disabled={crearSubcategoria.isPending}>
                    Añadir subcategoria
                  </Button>
                </DialogFooter>
              </form>
            </Dialog>
    </div>
  );
};