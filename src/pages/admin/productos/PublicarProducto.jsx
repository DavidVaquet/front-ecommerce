"use client"
import { useEffect, useState } from "react";
import { publicarProductosServices } from "../../../services/productServices";
import { useProductos } from "../../../context/ProductsContext";
import { getProducts } from "../../../services/productServices";
import { mostrarImagen } from "../../../helpers/mostrarImagen";
import { formatearPesosRedondeo } from "../../../helpers/formatearPesos";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Chip,
  Avatar,
  IconButton,
  Checkbox,
  Progress,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from "@material-tailwind/react"
import {
  Search,
  Package,
  Eye,
  Upload,
  CheckCircle,
  AlertCircle,
  Globe,
  Tag,
  DollarSign,
  BarChart3,
  Calendar,
  X,
  ShoppingCart,
  TrendingUp,
  Zap,
} from "lucide-react"

export const PublicarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("")
  const [filtroStock, setFiltroStock] = useState("")
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [productoPreview, setProductoPreview] = useState(null)
  const [mostrarAlerta, setMostrarAlerta] = useState(false)
  const [tipoAlerta, setTipoAlerta] = useState("success")
  const [mensajeAlerta, setMensajeAlerta] = useState("")

  // Contexto
  const { recargarProductos } = useProductos();

  // Estadísticas
  const totalProductos = productos.length; // Total de productos en el sistema
  const productosPublicados = productos.filter((prod) => prod.publicado = 1).length;
  const productosNoPublicados = productos.filter((prod) => prod.publicado = 0).length;
  const productosListosParaPublicar = productos.filter((p) => p.estado === 1 && p.cantidad > 0).length

  // useEffect
  useEffect(() => {
    const fetchProductosNoPublicados = async () => {
      try {
        const productosNoPublicados = await getProducts({publicado: 0});
        console.log(productosNoPublicados.products);
        setProductos(productosNoPublicados.products);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProductosNoPublicados();
  }, [recargarProductos]);
  
  // Obtener categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria_nombre))]

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.barcode?.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())

    const coincideCategoria = !filtroCategoria || producto.categoria_nombre === filtroCategoria

    const coincideStock =
      !filtroStock ||
      (filtroStock === "con-stock" && producto.cantidad > 0) ||
      (filtroStock === "sin-stock" && producto.cantidad === 0) ||
      (filtroStock === "bajo-stock" && producto.cantidad > 0 && producto.cantidad < 10)

    return coincideBusqueda && coincideCategoria && coincideStock
  })

  // Manejar selección individual
  const handleSeleccionarProducto = (productoId) => {
    setProductosSeleccionados((prev) =>
      prev.includes(productoId) ? prev.filter((id) => id !== productoId) : [...prev, productoId],
    )
  }

  // Manejar selección de todos
  const handleSeleccionarTodos = () => {
    const productosListos = productosFiltrados.filter((p) => p.estado === 1 && p.cantidad > 0)

    if (productosSeleccionados.length === productosListos.length) {
      setProductosSeleccionados([])
    } else {
      setProductosSeleccionados(productosListos.map((p) => p.id))
    }
  }

  // Mostrar notificación
  const mostrarNotificacion = (tipo, mensaje) => {
    setTipoAlerta(tipo)
    setMensajeAlerta(mensaje)
    setMostrarAlerta(true)
    setTimeout(() => setMostrarAlerta(false), 4000)
  }

  // Publicar productos seleccionados
  const publicarProductos = async () => {
    try {
      // Aquí iría tu lógica para publicar productos
      console.log("Publicando productos:", productosSeleccionados)

      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Actualizar estado local
      setProductos((prev) => prev.filter((p) => !productosSeleccionados.includes(p.id)))

      mostrarNotificacion("success", `${productosSeleccionados.length} producto(s) publicado(s) exitosamente`)

      setProductosSeleccionados([])
      setOpenConfirmModal(false)
    } catch (error) {
      mostrarNotificacion("error", "Error al publicar productos")
    }
  }

  // Verificar si un producto puede ser publicado
  const puedeSerPublicado = (producto) => {
    return producto.estado === 1 && producto.cantidad > 0
  }


  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Alerta flotante */}
      {mostrarAlerta && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Alert
            color={tipoAlerta === "success" ? "green" : "red"}
            icon={tipoAlerta === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            className="shadow-lg"
          >
            {mensajeAlerta}
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Publicar Productos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y publica productos en tu tienda e-commerce de forma rápida y sencilla.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Zap className="h-4 w-4" />
                <span>Selecciona y publica múltiples productos</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              color="blue-gray"
              className="flex items-center gap-2 normal-case"
              disabled={productosSeleccionados.length === 0}
              onClick={() => setOpenPreviewModal(true)}
            >
              <Eye className="h-5 w-5" />
              Vista Previa ({productosSeleccionados.length})
            </Button>
            <Button
              variant="filled"
              color="deep-orange"
              className="flex items-center gap-2 normal-case shadow-md"
              size="lg"
              disabled={productosSeleccionados.length === 0}
              onClick={() => setOpenConfirmModal(true)}
            >
              <Upload className="h-5 w-5" />
              Publicar Seleccionados ({productosSeleccionados.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Cards informativas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray">
                  Publicados: {productosPublicados}
                </Typography>
              </div>
              <Progress value={(productosPublicados / totalProductos) * 100} color="blue" />
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  No Publicados
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosNoPublicados}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="amber" className="font-medium">
                Pendientes de publicación
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Listos para Publicar
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosListosParaPublicar}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Typography variant="small" color="green" className="font-medium">
                Con stock disponible
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Seleccionados
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosSeleccionados.length}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Upload className="h-4 w-4 text-deep-orange-500" />
              <Typography variant="small" color="deep-orange" className="font-medium">
                Para publicar
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8 shadow-sm border border-gray-200">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                label="Buscar productos"
                icon={<Search className="h-5 w-5" />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.value = ''
                  }
                }}
                autoFocus
              />
            </div>
            <div>
              <Select label="Categoría" value={filtroCategoria} onChange={(value) => setFiltroCategoria(value)}>
                <Option value="">Todas las categorías</Option>
                {categorias.map((categoria) => (
                  <Option key={categoria} value={categoria}>
                    {categoria}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Select label="Estado de Stock" value={filtroStock} onChange={(value) => setFiltroStock(value)}>
                <Option value="">Todos</Option>
                <Option value="con-stock">Con Stock</Option>
                <Option value="sin-stock">Sin Stock</Option>
                <Option value="bajo-stock">Bajo Stock</Option>
              </Select>
            </div>
            <div>
              <Button
                variant="outlined"
                color="blue-gray"
                className="flex items-center gap-2 normal-case w-full"
                onClick={handleSeleccionarTodos}
              >
                <CheckCircle className="h-4 w-4" />
                {productosSeleccionados.length === productosFiltrados.filter((p) => puedeSerPublicado(p)).length
                  ? "Deseleccionar Todos"
                  : "Seleccionar Todos"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Lista de Productos */}
      <Card className="shadow-sm border border-gray-200">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h6" color="blue-gray" className="flex items-center gap-2 uppercase">
              <Package className="h-5 w-5" />
              Productos No Publicados ({productosFiltrados.length})
            </Typography>
            {productosSeleccionados.length > 0 && (
              <Typography variant="small" color="deep-orange" className="font-medium">
                {productosSeleccionados.length} producto(s) seleccionado(s)
              </Typography>
            )}
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <Typography variant="h6" color="blue-gray">
                No hay productos para publicar
              </Typography>
              <Typography variant="small" color="gray" className="mt-1 text-center">
                Todos los productos están publicados o no coinciden con los filtros aplicados.
              </Typography>
            </div>
          ) : (
            <div className="space-y-4">
              {productosFiltrados.map((producto) => {
                const esPublicable = puedeSerPublicado(producto)
                const estaSeleccionado = productosSeleccionados.includes(producto.id)

                return (
                  <Card
                    key={producto.id}
                    className={`border transition-all ${
                      estaSeleccionado ? "border-deep-orange-300 bg-deep-orange-50" : "border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Checkbox */}
                        <Checkbox
                          checked={estaSeleccionado}
                          onChange={() => handleSeleccionarProducto(producto.id)}
                          disabled={!esPublicable}
                          color="deep-orange"
                        />

                        {/* Imagen del producto */}
                        <Avatar
                          src={mostrarImagen(producto.imagen_url)}
                          alt={producto.nombre}
                          size="lg"
                          variant="rounded"
                          className="border border-gray-200"
                        />

                        {/* Información del producto */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Typography variant="h6" color="blue-gray" className="font-bold">
                                {producto.nombre}
                              </Typography>
                              <Typography variant="small" color="gray" className="mt-1">
                                {producto.descripcion}
                              </Typography>
                            </div>
                            <div className={ esPublicable ? 'flex gap-2 mr-[52px]' : 'flex gap-2 mr-8'}>
                              {esPublicable ? (
                                <Chip
                                  value="Listo para publicar"
                                  color="green"
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full"
                                  icon={<CheckCircle className="h-3 w-3 mt-[2px]" />}
                                />
                              ) : (
                                <Chip
                                  value='No listo para publicar'
                                  color="red"
                                  size="sm"
                                  variant="ghost"
                                  className="rounded-full"
                                  icon={<AlertCircle className="h-3 w-3 mt-[2px]" />}
                                />
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-gray-500" />
                              <Typography variant="small" color="blue-gray">
                                <strong>Categoría:</strong> {producto.categoria_nombre}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <Typography variant="small" color="blue-gray">
                                <strong>Precio:</strong> ${formatearPesosRedondeo(producto.precio)}
                                {producto.precio_oferta && (
                                  <span className="text-red-500 ml-1">
                                    (Oferta: ${producto.precio_oferta.toFixed(2)})
                                  </span>
                                )}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-gray-500" />
                              <Typography variant="small" color="blue-gray">
                                <strong>Stock:</strong> {producto.cantidad}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <Typography variant="small" color="blue-gray">
                                <strong>Creado:</strong> {new Date(producto.fecha_creacion).toLocaleDateString()}
                              </Typography>
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col gap-2">
                          <IconButton
                            variant="text"
                            color="blue"
                            size="sm"
                            onClick={() => {
                              setProductoPreview(producto)
                              setOpenPreviewModal(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal de Confirmación */}
      <Dialog open={openConfirmModal} handler={() => setOpenConfirmModal(false)} size="md">
        <DialogHeader className="flex items-center gap-2">
          <Upload className="h-6 w-6 text-deep-orange-500" />
          Confirmar Publicación
        </DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            ¿Estás seguro de que deseas publicar {productosSeleccionados.length} producto(s) en tu tienda e-commerce?
          </Typography>
          <Typography variant="small" color="gray" className="mt-2">
            Una vez publicados, los productos estarán disponibles para la compra en línea.
          </Typography>
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setOpenConfirmModal(false)}>
            Cancelar
          </Button>
          <Button color="deep-orange" onClick={publicarProductos} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Publicar Productos
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal de Vista Previa */}
      <Dialog open={openPreviewModal} handler={() => setOpenPreviewModal(false)} size="lg">
        <DialogHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2 uppercase">
            <Eye className="h-6 w-6 text-blue-500" />
            Vista Previa del Producto
          </div>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenPreviewModal(false)}>
            <X className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          {productoPreview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img
                  src={mostrarImagen(productoPreview.imagen_url)}
                  alt={productoPreview.nombre}
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex justify-center">
                  <Chip
                    value="Vista de Cliente"
                    color="blue"
                    size="lg"
                    variant="ghost"
                    className="rounded-full"
                    icon={<Globe className="h-4 w-4 mt-[4px]" />}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    {productoPreview.nombre}
                  </Typography>
                  <Typography variant="paragraph" color="gray">
                    {productoPreview.descripcion}
                  </Typography>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Typography variant="h3" color="green" className="font-bold">
                      ${formatearPesosRedondeo(productoPreview.precio)}
                    </Typography>
                    {productoPreview.precio_oferta && (
                      <Typography variant="h5" color="gray" className="line-through">
                        ${productoPreview.precio_oferta.toFixed(2)}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="small" color="blue-gray">
                    Stock disponible: {productoPreview.cantidad}
                  </Typography>
                  <Chip
                    value={productoPreview.categoria_nombre}
                    color="blue-gray"
                    size="sm"
                    variant="ghost"
                    className="rounded-full w-fit"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="blue-gray" onClick={() => setOpenPreviewModal(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

// Exportaciones
export default PublicarProductos
