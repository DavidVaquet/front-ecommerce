"use client";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { mostrarImagen } from "../../../helpers/mostrarImagen";
import { useSearchParams, useNavigate } from "react-router";
import {
  formatearPesos,
  formatearMiles,
  precioToNumber,
} from "../../../helpers/formatearPesos";
import StatsCard from "../../../components/StatsCard";
import ProductRow from "../../../components/Productos/ProductRow";
import { useNotificacion } from "../../../hooks/useNotificacion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Tabs,
  TabsHeader,
  Tab,
  Progress,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Textarea,
  Option,
  CardFooter,
} from "@material-tailwind/react";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  DollarSign,
  Tag,
  User,
  CheckCircle,
  Power,
  PowerOff,
} from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useProductos, useProductoStats } from "../../../hooks/useProductos";
import { useProductosMutation } from "../../../hooks/useProductosMutation";
import { useCategorias } from "../../../hooks/useCategorias";
import { useSubcategorias } from "../../../hooks/useSubcategorias";
import { printEtiqueta } from "../../../services/printServices";

// Estilos CSS
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
    const MySwal = withReactContent(Swal);
    

const Productos = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const topRef = useRef(null);

  
  const [activeTab, setActiveTab] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubCategoriaSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEtiqueta, setOpenEtiqueta] = useState(false);
  const [ancho, setAncho] = useState(60);
  const [alto, setAlto] = useState(30);
  const [copias, setCopias] = useState(1);
  const [mode, setMode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formularioEditar, setFormularioEditar] = useState({
    nombre: "",
    precio: "",
    marca: "",
    descripcion: "",
    subcategoria: "",
    precio_costo: "",
    descripcion_corta: "",
  });


  
  const productsPerPage = 25;
  useEffect(() => {
  setSearchTerm(initialSearch);
  setCurrentPage(1);
}, [initialSearch]);
  
// NOTIFICACIONES
const { componenteAlerta, mostrarNotificacion } = useNotificacion();
  const navigate = useNavigate();

  // MUTATION
  const {
    activarProducto,
    editarProducto,
    eliminarProducto,
    desactivarProducto,
  } = useProductosMutation();

  // Filtros para traer los datos del backend
  const debouncedSearch = useDebouncedValue(searchTerm, 500);
  const limit = productsPerPage;
  const offset = (currentPage - 1) * productsPerPage;
  const filtros = useMemo(() => {
    const f = { limit, offset, search: debouncedSearch, include: "ventas" };
    if (activeTab === "activos") f.estado = 1;
    if (activeTab === "inactivos") f.estado = 0;
    if (activeTab === "sin-stock") f.stockBajo = 0;
    return f;
  }, [limit, offset, debouncedSearch, activeTab]);

  // Obtener productos
  const { data, isLoading, error, refetch, isFetching } = useProductos(filtros);
  const products = data?.rows ?? [];
  // console.log(data);

  // Obtener categorias y subcategorias
  const { data: categoriasData } = useCategorias();
  const categorias = categoriasData ?? [];
  const { data: subcategoriasData } = useSubcategorias();
  const subcategorias = subcategoriasData ?? [];


  useEffect(() => {
    const fetchDatos = () => {
      try {

        if (selectedProduct) {
          const subcategoriaActual = subcategorias.find(
            (sub) => sub.id === selectedProduct.subcategoria_id
          );

          if (subcategoriaActual) {
            setSubCategoriaSeleccionada(subcategoriaActual.id);
            setCategoriaSeleccionada(subcategoriaActual.categoria_id);
          }
        }
      } catch (error) {
        console.error(error);
        mostrarNotificacion("error", error.message);
      }
    };

    fetchDatos();
  }, [selectedProduct, subcategorias]);

  // Resetear página cuando cambien filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearch]);

  // Estadísticas
  const { data: stats } = useProductoStats();
  const {
      totalProductos,
      productosActivos,
      productosSinStock,
      productosBajoStock,
      productosInactivos
    } = useMemo(() => ({
      totalProductos: stats?.total ?? 0,
      productosActivos: stats?.activos ?? 0,
      productosSinStock: stats?.sin_stock ?? 0,
      productosBajoStock: stats?.bajo_stock ?? 0,
      productosInactivos: stats?.inactivos ?? 0
    }), [stats]);
  const porcActivos   = useMemo(() => totalProductos ? Math.round((productosActivos / totalProductos) * 100) : 0, [productosActivos, totalProductos]);
  const porcSinStock  = useMemo(() => totalProductos ? Math.round((productosSinStock  / totalProductos) * 100) : 0, [productosSinStock, totalProductos]);
  const porcBajoStock = useMemo(() => totalProductos ? Math.round((productosBajoStock / totalProductos) * 100) : 0, [productosBajoStock, totalProductos]);


  // Paginación
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
  const showEmpty = !isLoading && total === 0;

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


  const handleViewProduct = useCallback((producto) => {
    setSelectedProduct(producto);
    setOpenModal(true);
  }, []);

  const handleCloseLabel = () => {
    setOpenEtiqueta(false);
    setSelectedProduct(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const handleCloseModalEdit = () => {
    setOpenEdit(false);
    setSelectedProduct(null);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    let nuevoValor = value;
    if (["precio", "precio_costo"].includes(name)) {
      nuevoValor = value === "" ? "" : value;
    }
    setFormularioEditar((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    const nuevoValor = ["subcategoria"].includes(name) ? Number(value) : value;

    setFormularioEditar((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));
  }, []);


  const comenzarEdicion = useCallback((producto) => {
    setFormularioEditar({
      nombre: producto.nombre,
      precio: Number(producto.precio),
      marca: producto.marca,
      descripcion: producto.descripcion,
      subcategoria: Number(producto.subcategoria_id),
      descripcion_corta: producto.descripcion_corta,
      precio_costo: producto.precio_costo,
    });
    setOpenEdit(true);
    setSelectedProduct(producto);
  }, []);

  const guardarEdicion = useCallback(async () => {
    try {
      const payload = {
        id: Number(selectedProduct.id),
        ...formularioEditar,
        precio: parseFloat(formularioEditar.precio),
        subcategoria_id: formularioEditar.subcategoria,
        precio_costo: parseFloat(formularioEditar.precio_costo),
      };

      await editarProducto.mutateAsync(payload);
      mostrarNotificacion("success", "Producto actualizado con éxito");
      handleCloseModalEdit();
      setFormularioEditar({
        nombre: "",
        precio: "",
        marca: "",
        descripcion: "",
        subcategoria: "",
      });
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message);
    }


  }, [editarProducto, formularioEditar, selectedProduct, mostrarNotificacion]);

  const editarDesdeModal = useCallback(() => {
    comenzarEdicion(selectedProduct);
    setOpenModal(false);
  }, [selectedProduct, comenzarEdicion]);

  const deleteLogico = useCallback(async (producto) => {
    try {
      if (producto.estado === 0) return;
      const id = Number(producto.id);
      const borrado = await desactivarProducto.mutateAsync(id);
      mostrarNotificacion("success", "Producto deshabilitado correctamente");
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message || 'Error al desactivar el producto')
    }
  }, [desactivarProducto, mostrarNotificacion]);

  const activadoLogico = useCallback(async (producto) => {
    try {
      if (producto.estado === 1) return;
      const id = Number(producto.id);
      const activado = await activarProducto.mutateAsync(id);
      mostrarNotificacion("success", "Producto habilitado correctamente");
    } catch (error) {
      console.error(error);
      mostrarNotificacion("error", "Error al activar el producto");
    }
  }, [activarProducto, mostrarNotificacion]);

  const handleDelete = useCallback((producto) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const id = Number(producto?.id);
        await eliminarProducto.mutateAsync(id);
        mostrarNotificacion("success", "Producto eliminado correctamente.");
      } catch (error) {
        console.error(error);
        mostrarNotificacion("error", error.message || "No se pudo eliminar");
      }
    });
  }, [eliminarProducto, mostrarNotificacion]);


  const openPrint = useCallback((producto) => {
    setSelectedProduct(producto);
    setOpenEtiqueta(true);
  }, [])

  const handlePrint = useCallback(
  async (producto, ancho, alto, copias, mode) => {
    try {
      if (!ancho) { mostrarNotificacion('Debes especificar el ancho de la etiqueta'); return; }
      if (!alto) { mostrarNotificacion('Debes especificar el alto de la etiqueta'); return; }
      if (!copias || Number(copias) <= 0) { mostrarNotificacion('Debes especificar la cantidad de copias (> 0)'); return; }
      if (!mode) { mostrarNotificacion('Debes especificar el modo de impresión'); return; }

      const resp = await printEtiqueta({ producto, ancho, alto, copias, mode });

      if (resp?.ok || resp?.status === 'queued') {
        mostrarNotificacion('success', 'Etiqueta en cola de impresión');
        setSelectedProduct(null);
        setOpenEtiqueta(false);
        return;
      }

      
      mostrarNotificacion('error', 'No se pudo encolar la etiqueta');
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message || 'Ocurrió un error al imprimir la etiqueta');
    }
  },[mostrarNotificacion]
);

  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Título y Botón */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold uppercase tracking-tight">
              Gestión de Productos
            </h1>
            <p className="text-gray-600 mt-1">
              Controlá tus productos activos, precios y stock desde un solo
              lugar.
            </p>
          </div>
          <Button
            variant="gradient"
            color="deep-orange"
            className="flex items-center gap-2"
            size="md"
            onClick={() => navigate('/admin/productos/nuevo')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            NUEVO PRODUCTO
          </Button>
        </div>
      </div>

      {/* Cards informativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card Total Productos */}
        <StatsCard
         titulo='Total Productos'
         valor={totalProductos}
         icono={<Package className="h-6 w-6 text-deep-orange-500" />} />
        {/* Card Productos Activos */}
        <StatsCard
        titulo="Productos Activos"
        valor={productosActivos}
        icono={<CheckCircle2 className="h-6 w-6 text-green-500" />}
        progreso={porcActivos}
        progresoTexto={`${porcActivos}% del total`}
        colorProgreso="green"
        colorTyppography='blue-gray'/>
        {/* Card Sin Stock */}
        <StatsCard
        titulo="Sin Stock"
        valor={productosSinStock}
        icono={<XCircle className="h-6 w-6 text-red-500" />}
        progreso={porcSinStock}
        progresoTexto={`${porcSinStock}% del total`}
        colorProgreso="red"
        colorTyppography='blue-gray' />
        {/* Card Bajo Stock */}
        <StatsCard
        titulo="Bajo Stock"
        valor={productosBajoStock}
        icono={<AlertTriangle className="h-6 w-6 text-amber-500" />}
        progreso={porcBajoStock}
        progresoTexto={`${porcBajoStock}% del total`}
        colorProgreso="amber"
        colorTyppography='blue-gray'/>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8 shadow-sm border border-gray-200">
        <span ref={topRef}></span>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-96">
              <Input
                label="Buscar productos"
                placeholder="Ingresa el nombre del producto o código de barra"
                icon={<Search className="h-5 w-5" />}
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="blue-gray"
                className="flex items-center gap-2 normal-case"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Button
                    variant="outlined"
                    color="blue-gray"
                    className="flex items-center gap-2 normal-case"
                  >
                    Ordenar por
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem>Nombre (A-Z)</MenuItem>
                  <MenuItem>Nombre (Z-A)</MenuItem>
                  <MenuItem>Precio (menor a mayor)</MenuItem>
                  <MenuItem>Precio (mayor a menor)</MenuItem>
                  <MenuItem>Stock (menor a mayor)</MenuItem>
                  <MenuItem>Stock (mayor a menor)</MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Debug info - puedes eliminar esto después
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        Debug: Tab activo: {activeTab} | Productos totales: {products.length} | Filtrados: {filteredProducts.length}
      </div> */}

      {/* Tabs y Tabla de Productos */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab}>
          <TabsHeader className="p-2">
            <Tab
              value="todos"
              className="text-sm font-medium"
              onClick={() => {
                setActiveTab("todos");
                setCurrentPage(1);
              }}
            >
              Todos ({totalProductos})
            </Tab>
            <Tab
              value="activos"
              className="text-sm font-medium"
              onClick={() => {
                setActiveTab("activos");
                setCurrentPage(1);
              }}
            >
              Activos ({productosActivos})
            </Tab>
            <Tab
              value="sin-stock"
              className="text-sm font-medium"
              onClick={() => {
                setActiveTab("sin-stock");
                setCurrentPage(1);
              }}
            >
              Sin Stock ({productosSinStock})
            </Tab>
            <Tab
              value="inactivos"
              className="text-sm font-medium"
              onClick={() => {
                setActiveTab("inactivos");
                setCurrentPage(1);
              }}
            >
              Inactivos ({productosInactivos})
            </Tab>
          </TabsHeader>

          {/* Contenido de la tabla */}
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none"
                      >
                        Producto
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none"
                      >
                        Categoría
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none"
                      >
                        Precio venta
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none"
                      >
                        Costo
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium text-center leading-none"
                      >
                        Stock
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium text-center leading-none"
                      >
                        Estado
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none text-center"
                      >
                        Ventas
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none ml-9"
                      >
                        Acciones
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((producto) => (
                    <ProductRow
                    key={producto.id}
                    producto={producto}
                    onView={handleViewProduct}
                    onEdit={comenzarEdicion}
                    onActivar={activadoLogico}
                    onDelete={handleDelete}
                    onDesactivar={deleteLogico}
                    onPrint={openPrint} />
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
                  Mostrando {start} a {end} de {total} productos
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
                <Package className="h-12 w-12 text-gray-400 mb-3" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron productos
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta con otra búsqueda o agrega nuevos productos.
                </Typography>
              </div>
            )}
          </div>
        </Tabs>
      </Card>

      {/* Modal para imprimir etiquetas */}
      <Dialog
        size="xs"
        open={openEtiqueta}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-row gap-2">
              <div>
              <Typography variant="h4" color="blue-gray">
              Ancho de la etiqueta
            </Typography>
            <Input
              type="number"
              value={ancho}
              onChange={(e) => setAncho(e.target.valueAsNumber)}
            />
              </div>
              <div>
              <Typography variant="h4" color="blue-gray">
              Alto de la etiqueta
            </Typography>
            <Input
              type="number"
              value={alto}
              onChange={(e) => setAlto(e.target.valueAsNumber)}
            />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div>
              <Typography variant="h4" color="blue-gray">
              Cantidad de copias
            </Typography>
            <Input
              type="number"
              value={copias}
              onChange={(e) => setCopias(e.target.valueAsNumber)}
            />
              </div>
              <div>
              <Typography variant="h4" color="blue-gray">
              Modo de impresión
            </Typography>
              <Select onChange={(value) => setMode(value)}>
                <Option value="windows-share">MacOS</Option>
                <Option value="mac-local">Windows</Option>
              </Select>
              </div>
            </div>

          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex justify-center items-center gap-2">
              <Button variant="gradient" color="red" onClick={handleCloseLabel}>
                Cancelar
              </Button>
              <Button
                variant="gradient"
                onClick={() => handlePrint(selectedProduct, copias, ancho, alto, mode)}
              >
                Imprimir etiqueta
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Dialog>

      {/* Modal de Detalles del Producto */}
      <Dialog
        open={openModal}
        handler={handleCloseModal}
        size="lg"
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-4xl">
          <DialogHeader className="flex items-center justify-between p-6 border-b border-gray-200">
            <Typography variant="h4" color="blue-gray" className="uppercase">
              Detalles del Producto
            </Typography>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={handleCloseModal}
            >
              <X className="h-5 w-5" />
            </IconButton>
          </DialogHeader>

          <DialogBody className="p-6">
            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagen del producto */}
                <div className="space-y-4">
                  <div className="aspect-square w-full max-w-md mx-auto">
                    <img
                      src={
                        mostrarImagen(selectedProduct.imagen_url) ||
                        "/placeholder.svg"
                      }
                      alt={selectedProduct.nombre}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Chip
                      value={obtenerEstadoProducto(selectedProduct)}
                      color={getChipColor(
                        obtenerEstadoProducto(selectedProduct)
                      )}
                      size="lg"
                      variant="ghost"
                      className="rounded-full"
                    />
                  </div>
                </div>

                {/* Información del producto */}
                <div className="space-y-6">
                  <div>
                    <Typography variant="h3" color="blue-gray" className="mb-2">
                      {selectedProduct.nombre}
                    </Typography>
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="text-lg"
                    >
                      {selectedProduct.descripcion ||
                        "Sin descripción disponible"}
                    </Typography>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          Precio
                        </Typography>
                      </div>
                      <Typography variant="h4" color="green">
                        ${formatearPesos(selectedProduct.precio || 0)}
                      </Typography>
                    </Card>

                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          Stock
                        </Typography>
                      </div>
                      <Typography variant="h4" color="blue">
                        {selectedProduct.stock_cantidad}
                      </Typography>
                    </Card>

                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-5 w-5 text-purple-500" />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          Categoría
                        </Typography>
                      </div>
                      <Typography variant="h6" color="purple">
                        {selectedProduct.categoria_nombre || "Sin categoría"}
                      </Typography>
                    </Card>

                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          Ventas
                        </Typography>
                      </div>
                      <Typography variant="h6" color="orange">
                        {selectedProduct.total_vendido || 0}
                      </Typography>
                    </Card>
                  </div>

                  {/* Información adicional */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Typography variant="small" color="gray">
                        <strong>Fecha de creación:</strong>{" "}
                        {selectedProduct.fecha_creacion
                          ? new Date(
                              selectedProduct.fecha_creacion
                            ).toLocaleDateString()
                          : "No disponible"}
                      </Typography>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <Typography variant="small" color="gray">
                        <strong>ID del producto:</strong> {selectedProduct.id}
                      </Typography>
                    </div>

                    {selectedProduct.barcode && (
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="gray">
                          <strong>Código de barras:</strong>{" "}
                          {selectedProduct.barcode}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter className="flex gap-2 p-6 border-t border-gray-200">
            <Button
              variant="outlined"
              color="blue-gray"
              onClick={handleCloseModal}
            >
              Cerrar
            </Button>
            <Button
              variant="filled"
              color="blue"
              className="flex items-center gap-2"
              onClick={editarDesdeModal}
            >
              <Edit className="h-4 w-4" />
              Editar Producto
            </Button>
          </DialogFooter>
        </Card>
      </Dialog>

      {/* Modal para editar el producto */}
      <Dialog
        size="xl"
        open={openEdit}
        handler={handleCloseModalEdit}
        className="max-h-[90vh] w-full max-w-4xl p-4"
      >
        {/* HEADER */}
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray" className="uppercase">
            Editar producto
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Modificá los datos necesarios y guardá los cambios.
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleCloseModalEdit}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>

        {/* BODY CON SCROLL Y GRID DE DOS COLUMNAS */}
        <DialogBody className="overflow-y-auto max-h-[60vh] px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NOMBRE */}
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Nombre <span className="text-red-500">*</span>
              </Typography>
              <Input
                name="nombre"
                value={formularioEditar.nombre}
                onChange={handleChange}
                placeholder="ej. Iphone 16"
              />
            </div>

            {/* MARCA */}
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Marca
              </Typography>
              <Input
                name="marca"
                value={formularioEditar.marca}
                onChange={handleChange}
                placeholder="ej. Apple"
              />
            </div>

            {/* PRECIO COSTO */}
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Costo unitario <span className="text-red-500">*</span>
              </Typography>
              <Input
                name="precio_costo"
                value={formatearMiles(formularioEditar.precio_costo)}
                onChange={handleChange}
                placeholder="ej. $100.000"
              />
            </div>
            {/* PRECIO */}
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Precio de venta <span className="text-red-500">*</span>
              </Typography>
              <Input
                name="precio"
                value={formatearMiles(formularioEditar.precio)}
                onChange={handleChange}
                placeholder="ej. $200.000"
              />
            </div>
            {/* CATEGORIA */}
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Categoría <span className="text-red-500">*</span>
              </Typography>
              {categorias.length > 0 && (
                <Select
                  value={categoriaSeleccionada || ""}
                  onChange={(val) => {
                    setCategoriaSeleccionada(val);
                    setSubCategoriaSeleccionada(null);
                  }}
                >
                  {categorias.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </Option>
                  ))}
                </Select>
              )}
            </div>

            {/* SUBCATEGORIAS */}
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Subcategoría <span className="text-red-500">*</span>
              </Typography>
              {subcategorias.length > 0 && categoriaSeleccionada && (
                <Select
                  key={categoriaSeleccionada}
                  value={subcategoriaSeleccionada || ""}
                  onChange={(val) => {
                    setSubCategoriaSeleccionada(val);
                    handleSelectChange("subcategoria", val);
                  }}
                >
                  {subcategorias
                    .filter(
                      (sub) =>
                        sub.categoria_id === parseInt(categoriaSeleccionada)
                    )
                    .map((sub) => (
                      <Option key={sub.id} value={sub.id}>
                        {sub.nombre}
                      </Option>
                    ))}
                </Select>
              )}
            </div>
            {/* DESCRIPCION CORTA (OCUPA DOS COLUMNAS) */}
            <div className="md:col-span-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Descripción corta (opcional)
              </Typography>
              <Textarea
                name="descripcion_corta"
                value={formularioEditar.descripcion_corta}
                onChange={handleChange}
                rows={2}
                className="h-4 resize-none"
                placeholder="..."
              />
            </div>
            {/* NOTAS (OCUPA DOS COLUMNAS) */}
            <div className="md:col-span-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Descripción (opcional)
              </Typography>
              <Textarea
                name="descripcion"
                value={formularioEditar.descripcion}
                onChange={handleChange}
                rows={4}
                placeholder="..."
              />
            </div>
          </div>
        </DialogBody>

        {/* FOOTER FIJO */}
        <DialogFooter className="border-t border-gray-200 pt-4 sticky bottom-0 bg-white z-10">
          <Button className="ml-auto mt-4" onClick={guardarEdicion}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ALERTAS  */}
      {componenteAlerta}
    </div>
  );
};

// Exportaciones
export { Productos };
export default Productos;
