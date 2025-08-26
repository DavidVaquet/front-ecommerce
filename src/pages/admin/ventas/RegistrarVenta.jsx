"use client"
import { clientesEstado } from "../../../services/clienteServices";
import { registrarVentaService } from "../../../services/ventasServices";
import { getProductoPorBarcode, getProducts } from "../../../services/productServices";
import { useState, useEffect } from "react";
import { isBarcodeLike } from "../../../utils/barcode";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  IconButton,
  Avatar,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  Progress,
  Alert,
} from "@material-tailwind/react"
import {
  PlusCircle,
  Search,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Trash2,
  Calculator,
  Receipt,
  Star,
  CreditCard,
  Banknote,
  Smartphone,
  Users,
  Tag,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
} from "lucide-react"
import { useProductos } from "../../../context/ProductsContext";
import { useVentas } from "../../../context/VentasContext";
import { useClientes } from "../../../context/ClientesContext";
import { estadisticasVentasServices } from "../../../services/estadisticasServices";


export const RegistrarVenta = () => {
  const [productosVenta, setProductosVenta] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [impuesto, setImpuesto] = useState(0) 
  const [activeTab, setActiveTab] = useState("todos");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("success");
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [canal, setCanal] = useState('local');


  // CONTEXT
  const { recargarProductos, setRecargarProductos } = useProductos();
  const { setVentasContext } = useVentas();
  const { clientesContext } = useClientes();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesActivos = await clientesEstado({activo: true});
        setClientes(clientesActivos);
      } catch (error) {
        console.error(error);
      }
    }
    fetchClientes();
  
  }, [clientesContext]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await getProducts();
        setProductos(response.products);
      } catch (error) {
        console.error(error)
      }
    }
    fetchProductos()
  }, [recargarProductos])

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await estadisticasVentasServices();
        // console.log(response);
        setEstadisticas(response);
      } catch (error) {
        console.error(error)
      }
    }
    fetchEstadisticas()
  }, [])
  
  
  const navigate = useNavigate();
  // Estadísticas del día
  const ventasHoy = estadisticas.ventasHoy;
  const totalVentasHoy = estadisticas?.totalVentasHoy;
  const productosVendidos = estadisticas.productosVendidos;
  const metaVentas = estadisticas?.metaVentas;
  const progresoMeta = parseFloat(((totalVentasHoy / metaVentas) * 100).toFixed(2));

  const agregarProducto = (producto) => {
    const productoExistente = productosVenta.find((p) => p.id === producto.id)

    if (productoExistente) {
      if (productoExistente.cantidadSeleccionada < producto.cantidad) {
        setProductosVenta(productosVenta.map((p) => (p.id === producto.id ? { ...p, cantidadSeleccionada: p.cantidadSeleccionada + 1 } : p)))
        mostrarNotificacion("success", "Cantidad actualizada")
      } else {
        mostrarNotificacion("error", "Stock insuficiente")
      }
    } else {
      setProductosVenta([...productosVenta, { ...producto, cantidadSeleccionada: 1 }])
      mostrarNotificacion("success", `${producto.nombre} agregado a la venta`)
    }
    setBusquedaProducto("")
  }

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(id)
      return
    }

    const producto = productos.find((p) => p.id === id)
    if (nuevaCantidad > producto.cantidad) {
      mostrarNotificacion("error", "Stock insuficiente")
      return
    }

    setProductosVenta(productosVenta.map((p) => (p.id === id ? { ...p, cantidadSeleccionada: nuevaCantidad } : p)))
  }

  const eliminarProducto = (id) => {
    setProductosVenta(productosVenta.filter((p) => p.id !== id))
    mostrarNotificacion("success", "Producto eliminado")
  }

  const mostrarNotificacion = (tipo, mensaje) => {
    setTipoAlerta(tipo)
    setMensajeAlerta(mensaje)
    setMostrarAlerta(true)
    setTimeout(() => setMostrarAlerta(false), 3000)
  }

  const calcularSubtotal = () => {
    return productosVenta.reduce((total, producto) => {
      const descuento = producto.descuento || 0;
      const precioConDescuento = producto.precio * (1 - descuento / 100)
      return total + precioConDescuento * producto.cantidadSeleccionada
    }, 0)
  }

  const calcularDescuentoGeneral = () => {
    return (calcularSubtotal() * descuentoGeneral) / 100
  }

  const calcularImpuestos = () => {
    const subtotalConDescuento = calcularSubtotal() - calcularDescuentoGeneral()
    return (subtotalConDescuento * impuesto) / 100
  }

  const calcularTotal = () => {
    return calcularSubtotal() - calcularDescuentoGeneral() + calcularImpuestos()
  }

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
    const tieneStock = producto.cantidad > 0

    if (activeTab === "todos") return coincideBusqueda && tieneStock
    if (activeTab === "populares") return coincideBusqueda && tieneStock && producto.popular
    if (activeTab === "ofertas") return coincideBusqueda && tieneStock && producto.descuento > 0
    if (activeTab === "bajo-stock") return coincideBusqueda && tieneStock && producto.cantidad <= 10

    return coincideBusqueda && tieneStock && producto.categoria_nombre.toLowerCase() === activeTab
  })

  const clienteActual = clientes.find((cli) => cli.id.toString() === clienteSeleccionado);

  const handleCreateVenta = async() => {

    if (productosVenta.length === 0) {
      mostrarNotificacion("error", "Agrega productos a la venta")
      return
    }
    if (!clienteSeleccionado) {
      mostrarNotificacion("error", "Selecciona un cliente")
      return
    }
    if (!metodoPago) {
      mostrarNotificacion("error", "Selecciona un método de pago")
      return
    }

    try {
      
      const venta = await registrarVentaService({
        canal,
        medio_pago: metodoPago,
        cliente_id: Number(clienteSeleccionado),
        productos: productosVenta.map((p) => ({
          product_id: p.id,
          cantidad: p.cantidadSeleccionada,
          precio: Number(p.precio),
          descuento: Number(p.descuento || 0)
        })),
        total: Number(calcularTotal()),
        subtotal: Number(calcularSubtotal()),
        descuento: Number(calcularDescuentoGeneral()),
        impuestos: Number(calcularImpuestos())

      })

      if (venta) {
        setVentasContext((prev) => prev + 1);
        setRecargarProductos((prev) => prev + 1);
        mostrarNotificacion("success", "¡Venta procesada exitosamente!")
        setTimeout(() => {
          setProductosVenta([])
          setClienteSeleccionado("")
          setMetodoPago("")
          setDescuentoGeneral(0)
        }, 1000)

      }
    } catch (error) {
      console.error(error);
    }
  }

  const limpiarVenta = () => {
        setProductosVenta([])
        setClienteSeleccionado("")
        setMetodoPago("")
        setDescuentoGeneral(0)
        setImpuesto(0)
  }

  const handleScanOrSearch = async (value) => {
  const input = (value || '').trim();
  if (!input) return;

  if (isBarcodeLike(input)) {
    try {
      const producto = await getProductoPorBarcode(input);
      if (producto) {
        agregarProducto(producto);
        mostrarNotificacion("success", `Agregado por código: ${input}`);
        setBusquedaProducto(""); 
        return;
      }
      mostrarNotificacion("error", "Código no encontrado. Probá buscar por nombre.");
    } catch (e) {
      console.error(e);
      mostrarNotificacion("error", "Error al buscar por código de barras");
    }
    return;
  }

  const primerMatch = productos.find(p => 
    p.nombre?.toLowerCase().includes(input.toLowerCase()) && p.cantidad > 0
  );
  if (primerMatch) {
    agregarProducto(primerMatch);
    mostrarNotificacion("success", `Agregado: ${primerMatch.nombre}`);
    setBusquedaProducto("");
  } else {
    mostrarNotificacion("error", "No se encontraron productos con ese nombre");
  }
};

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "Enter":
            e.preventDefault()
            handleCreateVenta()
            break
          case "Escape":
            e.preventDefault()
            setProductosVenta([])
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [productosVenta, clienteSeleccionado, metodoPago])

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

      {/* Título y Botón */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Registrar Nueva Venta</h1>
            <p className="text-gray-600 mt-1">
              Agrega productos, selecciona cliente y procesa la venta de forma rápida.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Zap className="h-4 w-4" />
                <span>Ctrl+Enter para procesar</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
            variant="outlined" 
            color="blue-gray" 
            className="flex items-center gap-2 uppercase"
            onClick={() => navigate('/admin/ventas/historial-ventas')}>
              <Receipt className="h-5 w-5" />
              Ver Historial
            </Button>
            <Button
              variant="filled"
              color="deep-orange"
              className="flex items-center gap-2 uppercase shadow-md"
              size="lg"
              onClick={handleCreateVenta}
            >
              <Calculator className="h-5 w-5" />
              Procesar Venta
            </Button>
          </div>
        </div>
      </div>

      {/* Cards informativas mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card Ventas Hoy */}
        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Ventas Hoy
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {ventasHoy}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Typography variant="small" color="green" className="font-medium">
                +8% vs ayer
              </Typography>
            </div>
          </CardBody>
        </Card>

        {/* Card Total Ventas Hoy */}
        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Total Ventas Hoy
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${totalVentasHoy?.toFixed(2)}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray">
                  Meta: ${metaVentas}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {progresoMeta.toFixed(0)}%
                </Typography>
              </div>
              <Progress value={progresoMeta} color="deep-orange" />
            </div>
          </CardBody>
        </Card>

        {/* Card Productos Vendidos */}
        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Productos Vendidos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosVendidos}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <Typography variant="small" color="blue" className="font-medium">
                Promedio: 2.3/venta
              </Typography>
            </div>
          </CardBody>
        </Card>

        {/* Card Venta Actual */}
        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Venta Actual
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${calcularTotal().toFixed(2)}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Package className="h-4 w-4 text-purple-500" />
              <Typography variant="small" color="purple" className="font-medium">
                {productosVenta.length} productos
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Venta */}
        <div className="lg:col-span-2">
          {/* Información del Cliente */}
          <Card className="shadow-sm border border-gray-200 mb-6">
            <CardBody className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2 uppercase font-semibold">
                <Users className="h-5 w-5" />
                Información del Cliente
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Cliente*
                  </Typography>
                   {clientes.length > 0 && (
                      <Select
                      label="Seleccionar cliente"
                      value={clienteSeleccionado?.toString() || ""}
                      onChange={(value) =>  {
                        console.log("Cliente seleccionado:", value);
                        setClienteSeleccionado(value.toString())}}
                        >
                    {clientes.map((cli) => (
                      <Option key={cli.id} value={cli.id.toString()}>
                        <div className="flex items-center gap-2">
                          {cli.es_vip && <Star className="h-4 w-4 text-yellow-500" />}
                          <span>{cli.nombre}</span>
                          {cli.es_vip && <Chip size="sm" value="VIP" color="yellow" />}
                        </div>
                      </Option>
                    ))}
                  </Select>
                    )}
                  {clienteActual && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <Typography variant="small" color="gray">
                        {clienteActual.email && `📧 ${clienteActual.email}`}
                        {clienteActual.telefono && ` | 📱 ${clienteActual.telefono}`}
                      </Typography>
                    </div>
                  )}
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Método de Pago*
                  </Typography>
                  <Select label="Seleccionar método" value={metodoPago} onChange={(value) => setMetodoPago(value)}>
                    <Option value="efectivo">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Efectivo
                      </div>
                    </Option>
                    <Option value="tarjeta">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Tarjeta de Crédito
                      </div>
                    </Option>
                    <Option value="debito">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Tarjeta de Débito
                      </div>
                    </Option>
                    <Option value="transferencia">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Transferencia
                      </div>
                    </Option>
                  </Select>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Búsqueda y Agregar Productos Mejorada */}
          <Card className="shadow-sm border border-gray-200 mb-6">
            <CardBody className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2 uppercase font-semibold">
                <Package className="h-5 w-5" />
                Agregar Productos
              </Typography>

              {/* Tabs para categorías */}
              <Tabs value={activeTab} onChange={(value) => setActiveTab(value)} className="mb-4">
                <TabsHeader className="bg-gray-50">
                  <Tab value="todos">Todos</Tab>
                  <Tab value="populares">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Ofertas
                    </div>
                  </Tab>
                  <Tab value="ofertas">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Inactivos
                    </div>
                  </Tab>
                  <Tab value="bajo-stock">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Bajo Stock
                    </div>
                  </Tab>
                </TabsHeader>
              </Tabs>

              <div className="relative">
                <Input
                  label="Buscar productos por nombre o código de barra"
                  icon={<Search className="h-5 w-5" />}
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="!border-gray-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleScanOrSearch(busquedaProducto);
                    }
                  }}
                  autoFocus
                  />

                {/* Dropdown de productos mejorado */}
                {busquedaProducto && productosFiltrados.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-10 mt-1 max-h-80 overflow-y-auto">
                    {productosFiltrados.slice(0, 8).map((producto) => {
                      const ruta = producto.imagen_url ? producto.imagen_url.replace(/\\/g, '/') : 'uploads/default.jpg';
                      const imagenPrincipal = `http://localhost:5002/${ruta}`;
                      
                      return (
                        <div
                        key={producto.id}
                        onClick={() => agregarProducto(producto)}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                        <Avatar
                          src={imagenPrincipal}
                          alt={producto.nombre}
                          size="md"
                          variant="rounded"
                          className="border border-gray-200"
                          />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {producto.nombre}
                            </Typography>
                            {producto.popular && <Star className="h-4 w-4 text-yellow-500" />}
                            {producto.descuento > 0 && <Chip size="sm" value={`-${producto.descuento}%`} color="red" />}
                          </div>
                          <div className="flex items-center gap-4">
                            <Typography variant="small" color="gray">
                              Stock: {producto.cantidad}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              ${Number(producto.precio).toFixed(2)}
                            </Typography>
                            <Chip size="sm" value={producto.categoria_nombre} color="blue-gray" />
                          </div>
                        </div>
                        <PlusCircle className="h-5 w-5 text-deep-orange-500" />
                      </div>
                      )})}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Lista de Productos en la Venta Mejorada */}
          <Card className="shadow-sm border border-gray-200">
            <CardBody className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2 uppercase font-semibold">
                <ShoppingCart className="h-5 w-5 mb-1" />
                Productos en el carrito ({productosVenta.length})
              </Typography>

              {productosVenta.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <Typography variant="h6" color="blue-gray">
                    No hay productos agregados
                  </Typography>
                  <Typography variant="small" color="gray" className="mt-1 text-center">
                    Busca y agrega productos para comenzar la venta.
                    <br />
                    Usa las pestañas para filtrar por categoría.
                  </Typography>
                </div>
              ) : (
                <div className="space-y-4">
                  {productosVenta.map((producto, index) => {
                    const ruta = producto.imagen_url ? producto.imagen_url.replace(/\\/g, '/') : 'uploads/default.jpg';
                    const imagenPrincipal = `http://localhost:5002/${ruta}`;
                    return (
                      <div
                      key={producto.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                      <div className="flex items-center gap-1">
                        <Typography variant="small" color="gray" className="w-6">
                          {index + 1}.
                        </Typography>
                        <Avatar
                          src={imagenPrincipal}
                          alt={producto.nombre}
                          size="lg"
                          variant="rounded"
                          className="border border-gray-200"
                          />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {producto.nombre}
                          </Typography>
                          {producto.popular && <Star className="h-4 w-4 text-yellow-500" />}
                          {producto.descuento > 0 && <Chip size="sm" value={`-${producto.descuento}%`} color="red" />}
                        </div>
                        <div className="flex items-center gap-4">
                          <Typography variant="small" color="gray">
                            ${Number(producto.precio).toFixed(2)} c/u
                          </Typography>
                          {producto.descuento > 0 && (
                            <Typography variant="small" color="green" className="font-medium">
                              Precio con descuento: ${(producto.precio * (1 - producto.descuento / 100)).toFixed(2)}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <IconButton
                            variant="outlined"
                            size="sm"
                            onClick={() => actualizarCantidad(producto.id, producto.cantidadSeleccionada - 1)}
                            className="rounded-full"
                            >
                            <span className="text-lg">-</span>
                          </IconButton>
                          <Typography variant="small" color="blue-gray" className="w-8 text-center font-medium">
                            {producto.cantidadSeleccionada}
                          </Typography>
                          <IconButton
                            variant="outlined"
                            size="sm"
                            onClick={() => actualizarCantidad(producto.id, producto.cantidadSeleccionada + 1)}
                            // disabled={producto.cantidad >= producto.stock}
                            className="rounded-full"
                            >
                            <span className="text-lg">+</span>
                          </IconButton>
                        </div>
                        <Typography variant="small" color="blue-gray" className="font-bold w-24 text-right">
                          ${producto.precio}
                        </Typography>
                        <IconButton
                          variant="text"
                          color="red"
                          size="sm"
                          onClick={() => eliminarProducto(producto.id)}
                          className="rounded-full"
                          >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                    )})}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Resumen de Venta Mejorado */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border border-gray-200 sticky top-6">
            <CardBody className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-6 flex items-center gap-2 uppercase font-semibold">
                <Calculator className="h-5 w-5" />
                Resumen de Venta
              </Typography>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Typography variant="small" color="blue-gray">
                    Subtotal:
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    ${calcularSubtotal().toFixed(2)}
                  </Typography>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="small" color="blue-gray">
                      Descuento General:
                    </Typography>
                    <Typography variant="small" color="red" className="font-medium">
                      -${calcularDescuentoGeneral().toFixed(2)}
                    </Typography>
                  </div>
                  <Input
                    type="number"
                    label="% Descuento"
                    value={descuentoGeneral}
                    onChange={(e) =>
                      setDescuentoGeneral(Math.max(0, Math.min(100, Number.parseFloat(e.target.value) || 0)))
                    }
                    className="!border-gray-300"
                    icon={<Tag className="h-4 w-4" />}
                    />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="small" color="blue-gray">
                      Impuestos ({impuesto}%):
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      +${calcularImpuestos().toFixed(2)}
                    </Typography>
                  </div>
                  <Input
                    type="number"
                    label="% Impuesto"
                    value={impuesto}
                    onChange={(e) => setImpuesto(Math.max(0, Math.min(100, Number.parseFloat(e.target.value) || 0)))}
                    className="!border-gray-300"
                    size="sm"
                    />
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center p-3 bg-deep-orange-50 rounded-lg">
                  <Typography variant="h6" color="blue-gray">
                    Total:
                  </Typography>
                  <Typography variant="h5" color="deep-orange" className="font-bold">
                    ${calcularTotal().toFixed(2)}
                  </Typography>
                </div>

                {clienteActual?.vip && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <Typography variant="small" color="yellow" className="font-medium">
                        Cliente VIP
                      </Typography>
                    </div>
                    <Typography variant="small" color="yellow">
                      Descuento adicional del 5% aplicado
                    </Typography>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <Button
                    color="deep-orange"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={productosVenta.length === 0}
                    onClick={handleCreateVenta}
                    size="lg"
                    >
                    <Calculator className="h-5 w-5" />
                    Procesar Venta
                  </Button>
                  <Button
                  variant="outlined"
                  color="blue-gray"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={limpiarVenta}
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpiar Venta
                  </Button>
                </div>

                {/* Información adicional */}
                <div className="pt-4 border-t border-gray-200">
                  <Typography variant="small" color="gray" className="text-center">
                    💡 Tip: Usa Ctrl+Enter para procesar rápidamente
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
