"use client"
import { editProduct, obtenerProductosCompletos, deleteProductLogic, activarProductLogic } from "../../../services/productServices";
import { fetchTSPL } from "../../../services/impresoraServices";
import { useProductos } from "../../../context/ProductsContext";
import { useCategorias } from "../../../context/CategoriasContext";
import { useSubcategorias } from "../../../context/SubcategoriasContext";
import { getAllCategories } from "../../../services/categorieService";
import { getSubcategories } from "../../../services/subcategorieService";
import { useState, useEffect } from "react"
import { mostrarImagen } from "../../../helpers/mostrarImagen";
import { formatearPesos } from "../../../helpers/formatearPesos";
import { useNotificacion } from "../../../hooks/useNotificacion"; 
import qz from 'qz-tray';
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
  CardFooter
} from "@material-tailwind/react"
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
  Printer
} from "lucide-react"
import { XMarkIcon } from "@heroicons/react/24/outline"

// Componente principal
const Productos = () => {
  const [activeTab, setActiveTab] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [copias, setCopias] = useState("")
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubCategoriaSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEtiqueta, setOpenEtiqueta] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formularioEditar, setFormularioEditar] = useState({
    nombre: "",
    precio: "",
    marca: "",
    descripcion: "",
    subcategoria: "",
    cantidad_stock: ''
  })

  // Notificaciones
 const { componenteAlerta, mostrarNotificacion } = useNotificacion();
  //Context
    const { recargarProductos, setRecargarProductos } = useProductos();
    const { categoriasContext } = useCategorias();
    const { subcategoriasContext } = useSubcategorias();

  // Obtener productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productos = await obtenerProductosCompletos()
        console.log("Productos obtenidos:", productos)
        setProducts(productos)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProducts()
  }, [recargarProductos])

  // Obtener categorias y subcategorias
  useEffect(() => {
    const fetchDatos = async () => {
      const categoriasData = await getAllCategories();
      const subcategoriasData = await getSubcategories();
      
      setCategorias(categoriasData);
      setSubCategorias(subcategoriasData);

      if (selectedProduct) {

        const subcategoriaActual = subcategoriasData.find(sub => sub.id === selectedProduct.subcategoria_id);
        setSubCategoriaSeleccionada(subcategoriaActual.id);
        setCategoriaSeleccionada(subcategoriaActual.categoria_id); 
      }
    }
    fetchDatos();
  }, [selectedProduct, categoriasContext, subcategoriasContext])
  
  // Resetear página cuando cambien filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchTerm])


  // Estadísticas
  const totalProductos = products.length
  const productosActivos = products.filter((p) => p.estado === 1).length
  const productosSinStock = products.filter((p) => p.stock_cantidad === 0).length
  const productosBajoStock = products.filter((p) => p.stock_cantidad > 0 && p.stock_cantidad < 10).length

  // Filtrar productos según la pestaña activa
  const filteredProducts = products
    .filter((producto) => {
      // console.log(
      //   "Filtrando producto:",
      //   producto.nombre,
      //   "Tab activo:",
      //   activeTab,
      //   "Estado:",
      //   producto.estado,
      //   "Stock:",
      //   producto.stock_cantidad,
      // )

      if (activeTab === "todos") return true
      if (activeTab === "activos") return producto.estado === 1 && producto.stock_cantidad > 0
      if (activeTab === "sin-stock") return producto.stock_cantidad === 0
      if (activeTab === "bajo-stock") return producto.stock_cantidad > 0 && producto.stock_cantidad < 10
      return true
    })
    .filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.categoria_nombre && producto.categoria_nombre.toLowerCase().includes(searchTerm.toLowerCase())),
    )

  // console.log("Productos filtrados:", filteredProducts.length, "Tab activo:", activeTab)

  // Paginación
  const productsPerPage = 5
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  const obtenerEstadoProducto = (producto) => {
    if (producto.estado === 0) return "Inactivo"
    if (producto.stock_cantidad === 0) return "Sin stock"
    if (producto.stock_cantidad < 10) return "Bajo stock"
    return "Activo"
  }

  const getChipColor = (estado) => {
    switch (estado) {
      case "Activo":
        return "green"
      case "Sin stock":
        return "red"
      case "Bajo stock":
        return "amber"
      case "Inactivo":
        return "gray"
      default:
        return "blue-gray"
    }
  }

  const handleViewProduct = (producto) => {
    setSelectedProduct(producto)
    setOpenModal(true)
  }

  const handleOpenLabel = (producto) => {
    setSelectedProduct(producto)
    setOpenEtiqueta(true);
  }
  const handleCloseLabel = () => {
    setOpenEtiqueta(false);
    setSelectedProduct(null);
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedProduct(null)
  }

  const handleCloseModalEdit = () => {
    setOpenEdit(false);
    setSelectedProduct(null);
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let nuevoValor = value;
    if (["precio", "cantidad_stock"].includes(name)) {
    nuevoValor = value === '' ? '' : parseFloat(value);
  }
    setFormularioEditar((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }))
  }

  const handleSelectChange = (name, value) => {
  const nuevoValor = ["subcategoria"].includes(name) ? Number(value) : value;

  setFormularioEditar((prev) => ({
    ...prev,
    [name]: nuevoValor,
  }));
  };

  const validarFormulario = () => {
    if (!formularioEditar.nombre.trim()) {
      mostrarNotificacion("error", "El nombre es obligatorio")
      return false
    }
    if (typeof formularioEditar.precio !== "number" || isNaN(formularioEditar.precio)) {
      mostrarNotificacion("error", "El precio es obligatorio")
      return false
    }
    if (typeof formularioEditar.subcategoria !== "number" || isNaN(formularioEditar.subcategoria)) {
      mostrarNotificacion("error", "Debes seleccionar una subcategoria")
      return false
    }
    if (typeof formularioEditar.cantidad_stock !== "number" || isNaN(formularioEditar.cantidad_stock)) {
      mostrarNotificacion("error", "Debes seleccionar una cantidad")
      return false
    }
    return true
  }

  const comenzarEdicion = (producto) => {
  setFormularioEditar({
    nombre: producto.nombre,
    precio: Number(producto.precio),
    marca: producto.marca,
    descripcion: producto.descripcion,
    subcategoria: Number(producto.subcategoria_id),
    cantidad_stock: Number(producto.stock_cantidad),
  });
  setOpenEdit(true);
  setSelectedProduct(producto);
};

  const guardarEdicion = async () => {

    try {
      if (!validarFormulario()) return;
      const productoActualizado = await editProduct({
        id: Number(selectedProduct.id),
        ...formularioEditar,
        cantidad_stock: formularioEditar.cantidad_stock,
        precio: formularioEditar.precio,
        subcategoria_id: formularioEditar.subcategoria
      });
      setRecargarProductos((prev) => prev + 1);
      mostrarNotificacion("success", "Producto actualizado con éxito");
      handleCloseModalEdit();
      setFormularioEditar({
      nombre: "",
      precio: "",
      marca: "",
      descripcion: "",
      subcategoria: "",
      cantidad_stock: ''
    })
      
    } catch (error) {
      console.error(error)
    }
  }
  const editarDesdeModal = () => {
  comenzarEdicion(selectedProduct);
  setOpenModal(false);
  };
  
  const deleteLogico = async (producto) => {
    try {
      if (producto.estado === 0) return;
      const id = Number(producto.id);
      const borrado = await deleteProductLogic(id);
      mostrarNotificacion('success', 'Producto deshabilitado correctamente')
      setRecargarProductos((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  }
  const activadoLogico = async (producto) => {
    try {
      if (producto.estado === 1) return;
      const id = Number(producto.id);
      const activado = await activarProductLogic(id);
      mostrarNotificacion('success', 'Producto habilitado correctamente')
      setRecargarProductos((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="text-black flex flex-col w-full py-3 px-8 font-worksans">
      {/* Título y Botón */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold uppercase tracking-tight">Gestión de Productos</h1>
            <p className="text-gray-600 mt-1">Controlá tus productos activos, precios y stock desde un solo lugar.</p>
          </div>
          <Button variant="gradient" color="deep-orange" className="flex items-center gap-2" size="md">
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
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Total Productos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {totalProductos}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <Package className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <Typography variant="small" color="green" className="font-medium">
                +12% este mes
              </Typography>
            </div>
          </CardBody>
        </Card>

        {/* Card Productos Activos */}
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Productos Activos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosActivos}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {totalProductos > 0 ? Math.round((productosActivos / totalProductos) * 100) : 0}% del total
                </Typography>
              </div>
              <Progress value={totalProductos > 0 ? (productosActivos / totalProductos) * 100 : 0} color="green" />
            </div>
          </CardBody>
        </Card>

        {/* Card Sin Stock */}
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Sin Stock
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosSinStock}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {totalProductos > 0 ? Math.round((productosSinStock / totalProductos) * 100) : 0}% del total
                </Typography>
              </div>
              <Progress value={totalProductos > 0 ? (productosSinStock / totalProductos) * 100 : 0} color="red" />
            </div>
          </CardBody>
        </Card>

        {/* Card Bajo Stock */}
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Bajo Stock
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosBajoStock}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {totalProductos > 0 ? Math.round((productosBajoStock / totalProductos) * 100) : 0}% del total
                </Typography>
              </div>
              <Progress value={totalProductos > 0 ? (productosBajoStock / totalProductos) * 100 : 0} color="amber" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8 shadow-sm border border-gray-200">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-72">
              <Input
                label="Buscar productos"
                icon={<Search className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
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

      {/* Debug info - puedes eliminar esto después */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        Debug: Tab activo: {activeTab} | Productos totales: {products.length} | Filtrados: {filteredProducts.length}
      </div>

      {/* Tabs y Tabla de Productos */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader className="p-2">
            <Tab value="todos" className="text-sm font-medium">
              Todos ({totalProductos})
            </Tab>
            <Tab value="activos" className="text-sm font-medium">
              Activos ({productosActivos})
            </Tab>
            <Tab value="sin-stock" className="text-sm font-medium">
              Sin Stock ({productosSinStock})
            </Tab>
            <Tab value="bajo-stock" className="text-sm font-medium">
              Bajo Stock ({productosBajoStock})
            </Tab>
          </TabsHeader>

          {/* Contenido de la tabla */}
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                        Producto
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                        Categoría
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                        Precio
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium text-center leading-none">
                        Stock
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium text-center leading-none">
                        Estado
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium leading-none text-center">
                        Ventas
                      </Typography>
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-medium leading-none ml-9">
                        Acciones
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((producto, index) => (
                    <tr key={producto.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={mostrarImagen(producto.imagen_url)}
                            alt={producto.nombre}
                            size="md"
                            variant="rounded"
                            className="border border-gray-200 p-1"
                          />
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {producto.nombre}
                          </Typography>
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
                      <td className="p-4 border-b border-gray-200 text-center">
                        <Typography variant="small" color="blue-gray">
                          {producto.stock_cantidad}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-center">
                        <Chip
                          value={obtenerEstadoProducto(producto)}
                          color={getChipColor(obtenerEstadoProducto(producto))}
                          size="sm"
                          variant="ghost"
                          className="rounded-full"
                        />
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
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            size="sm"
                            onClick={() => handleViewProduct(producto)}
                          >
                            <Eye className="h-4 w-4" />
                          </IconButton>
                          <IconButton variant="text" color="blue" size="sm" onClick={() => comenzarEdicion(producto)}>
                            <Edit className="h-4 w-4" />
                          </IconButton>
                          <IconButton variant="text" color="black" size="sm" onClick={() => handleOpenLabel(producto)}>
                            <Printer className="h-4 w-4" />
                          </IconButton>
                          {producto.estado === 0 ? (
                            <IconButton variant="text" color="green" size="sm" onClick={() => activadoLogico(producto)}>
                              <CheckCircle className="h-4 w-4"/>
                            </IconButton>
                          ) : (
                            <IconButton variant="text" color="red" size="sm" onClick={() => deleteLogico(producto)}>
                            <Trash2 className="h-4 w-4" />
                            </IconButton>
                          )}
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredProducts.length > 0 ? (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  Mostrando {(currentPage - 1) * productsPerPage + 1} a{" "}
                  {Math.min(currentPage * productsPerPage, filteredProducts.length)} de {filteredProducts.length}{" "}
                  productos
                </Typography>
                <div className="flex gap-2">
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
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
            <Typography variant="h4" color="blue-gray">
              Cantidad de copias
            </Typography>
            <Input
            type="number"
            value={copias}
            onChange={(e) => setCopias(e.target.valueAsNumber)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex justify-center items-center gap-2">
              <Button
              variant="gradient"
              color="red"
              onClick={handleCloseLabel}
            >
              Cancelar
            </Button>
            <Button variant="gradient" onClick={()=>handlePrint(selectedProduct?.id, copias)}>
              Imprimir etiqueta
            </Button>
            </div>
          </CardFooter>
        </Card>
      </Dialog>

      {/* Modal de Detalles del Producto */}
      <Dialog open={openModal} handler={handleCloseModal} size="lg" className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-4xl">
          <DialogHeader className="flex items-center justify-between p-6 border-b border-gray-200">
            <Typography variant="h4" color="blue-gray" className="uppercase">
              Detalles del Producto
            </Typography>
            <IconButton variant="text" color="blue-gray" onClick={handleCloseModal}>
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
                      src={mostrarImagen(selectedProduct.imagen_url) || "/placeholder.svg"}
                      alt={selectedProduct.nombre}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Chip
                      value={obtenerEstadoProducto(selectedProduct)}
                      color={getChipColor(obtenerEstadoProducto(selectedProduct))}
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
                    <Typography variant="paragraph" color="gray" className="text-lg">
                      {selectedProduct.descripcion || "Sin descripción disponible"}
                    </Typography>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <Typography variant="small" color="blue-gray" className="font-medium">
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
                        <Typography variant="small" color="blue-gray" className="font-medium">
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
                        <Typography variant="small" color="blue-gray" className="font-medium">
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
                        <Typography variant="small" color="blue-gray" className="font-medium">
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
                          ? new Date(selectedProduct.fecha_creacion).toLocaleDateString()
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
                          <strong>Código de barras:</strong> {selectedProduct.barcode}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter className="flex gap-2 p-6 border-t border-gray-200">
            <Button variant="outlined" color="blue-gray" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="filled" color="blue" className="flex items-center gap-2" onClick={editarDesdeModal}>
              <Edit className="h-4 w-4" />
              Editar Producto
            </Button>
          </DialogFooter>
        </Card>
      </Dialog>

      {/* Modal para editar el producto */}
       <Dialog size="xl" open={openEdit} handler={handleCloseModalEdit} className="max-h-[90vh] w-full max-w-4xl p-4">
        {/* HEADER */}
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray" className="uppercase">
            Editar producto
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Modificá los datos necesarios y guardá los cambios.
          </Typography>
          <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={handleCloseModalEdit}>
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>

        {/* BODY CON SCROLL Y GRID DE DOS COLUMNAS */}
        <DialogBody className="overflow-y-auto max-h-[60vh] px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NOMBRE */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Nombre
              </Typography>
              <Input name="nombre" value={formularioEditar.nombre} onChange={handleChange} placeholder="ej. Iphone 16" />
            </div>

            {/* MARCA */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Marca
              </Typography>
              <Input
                name="marca"
                value={formularioEditar.marca}
                onChange={handleChange}
                placeholder="ej. Apple"
              />
            </div>

            {/* PRECIO */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Precio
              </Typography>
              <Input
                name="precio"
                value={formularioEditar.precio}
                onChange={handleChange}
                placeholder="ej. $500.000"
              />
            </div>
            {/* CATEGORIA */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Categoría
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
            {/* CANTIDAD */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Cantidad
              </Typography>
              <Input
                name="cantidad_stock"
                value={formularioEditar.cantidad_stock}
                onChange={handleChange}
                placeholder="ej. 20"
              />
            </div>


            {/* SUBCATEGORIAS */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Subcategoría
              </Typography>
              {subcategorias.length > 0 && categoriaSeleccionada && (
                <Select
                  key={categoriaSeleccionada}
                  value={subcategoriaSeleccionada || ""}
                  onChange={(val) => {
                    setSubCategoriaSeleccionada(val)
                    handleSelectChange('subcategoria', val)
                  }}
                >
                  {subcategorias
                    .filter((sub) => sub.categoria_id === parseInt(categoriaSeleccionada))
                    .map((sub) => (
                      <Option key={sub.id} value={sub.id}>
                        {sub.nombre}
                      </Option>
                    ))}
                </Select>
              )}
            </div>

            {/* NOTAS (OCUPA DOS COLUMNAS) */}
            <div className="md:col-span-2">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Descripcion (opcional)
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
  )
}

// Exportaciones
export { Productos }
export default Productos
