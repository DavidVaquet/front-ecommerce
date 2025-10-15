"use client"

import { getProductoPorBarcode } from "../../../services/productServices";
import { useState, useEffect, useRef, useCallback } from "react";
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
import { estadisticasVentasServices } from "../../../services/estadisticasServices";
import { useNotificacion } from "../../../hooks/useNotificacion";
import { useProductos } from "../../../hooks/useProductos";
import { useMemo } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useClientes } from "../../../hooks/useClientes";
import { useVentasMutation } from "../../../hooks/useVentasMutation";
import { useVentasEstadisticas } from "../../../hooks/useVentas";
import { mostrarImagen } from "../../../helpers/mostrarImagen";
import ButtonResponsive from "../../../components/Button";


export const RegistrarVenta = () => {
  const [productosVenta, setProductosVenta] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [descuentoGeneral, setDescuentoGeneral] = useState("");
  const [impuesto, setImpuesto] = useState("") 
  const [activeTab, setActiveTab] = useState("todos");
  const [canal, setCanal] = useState('local');
  const [currency, setCurrency] = useState('ARS');
  const [scannerEnabled] = useState(true);

  // NAVEGACION
  const navigate = useNavigate();
  // ALERTAS
  const { componenteAlerta, mostrarNotificacion } = useNotificacion();

  // TRAER DATOS DESDE REACT QUERY
  const debouncedSearch = useDebouncedValue(busquedaProducto);
  const filtroProducto = useMemo(() => {
    const f = {estado: 1, search: debouncedSearch};
    return f;
  }, [debouncedSearch])
  const { data, refetch } = useProductos(filtroProducto);
  const productos = data?.rows || [];
  // console.log(productos);
  
  // TRAER CLIENTES DESDE REACT QUERY
  const filtroCliente = useMemo(() => ({
    activo: 'true'
  }), []);
  const { data: dataCliente } = useClientes(filtroCliente);
  const clientes = dataCliente?.items ?? [];

  // VENTAS MUTATION
  const { crearVenta } = useVentasMutation();

  // OBTENER ESTADISTICAS DE VENTAS DESDE REACT QUERY
  const { data: ventasEstadisticas } = useVentasEstadisticas();
  const estadisticas = ventasEstadisticas ?? [];
  
  // ESTADISTICAS DEL DÍA
  const ventasHoy = estadisticas?.ventasHoy ?? 0;
  const totalVentasHoy = estadisticas?.totalVentasHoy ?? 0;
  const productosVendidos = estadisticas?.productosVendidos ?? 0;
  const metaVentas = estadisticas?.metaVentas ?? 0;
  const progresoMeta = parseFloat(((totalVentasHoy / metaVentas) * 100).toFixed(2));

  const agregarProducto = useCallback((producto) => {
  setProductosVenta(prev => {
    const existente = prev.find(p => p.id === producto.id);
    if (existente) {
      if (existente.cantidadSeleccionada < (producto.cantidad ?? existente.cantidad ?? 0)) {
        mostrarNotificacion("success", "Cantidad actualizada");
        return prev.map(p => p.id === producto.id
          ? { ...p, cantidadSeleccionada: p.cantidadSeleccionada + 1 }
          : p
        );
      } else {
        mostrarNotificacion("error", "Stock insuficiente");
        return prev;
      }
    } else {
      mostrarNotificacion("success", `${producto.nombre} agregado a la venta`);
      return [...prev, { ...producto, cantidadSeleccionada: 1 }];
    }
  });
  setBusquedaProducto("");
}, [mostrarNotificacion, setBusquedaProducto]);

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


  const clienteActual = useMemo(() => clientes.find(cli => String(cli.id) === String(clienteSeleccionado)),
  [clientes, clienteSeleccionado]);

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

    const insuf = productosVenta.find(p => {
    const stock = Number(p.cantidad ?? p.stock_cantidad ?? 0);
    const cant = Number(p.cantidadSeleccionada ?? 0);
    return stock <= 0 || cant > stock;
  });
    if (insuf) {
      mostrarNotificacion('error', `Stock insuficiente para ${insuf.nombre}`);
      return;
    }

    try {
      
      const payload = {
        canal,
        medio_pago: metodoPago,
        cliente_id: Number(clienteSeleccionado),
        productos: productosVenta.map((p) => ({
          product_id: p.id,
          cantidad: Number(p.cantidadSeleccionada),
          precio: Number(p.precio),
          descuento: Number(p.descuento || 0),
          precio_costo: Number(p.precio_costo)
        })),
        descuento: descuentoGeneral,
        impuestos: impuesto,
        currency

      };

      const venta = await crearVenta.mutateAsync(payload);

      if (venta) {
        mostrarNotificacion("success", "¡Venta procesada exitosamente!")
        setTimeout(() => {
          limpiarVenta();
        }, 1000)

      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message || 'Error al realizar la venta.');
    }
  }

  const limpiarVenta = () => {
        setProductosVenta([])
        setClienteSeleccionado("")
        setMetodoPago("")
        setDescuentoGeneral("")
        setImpuesto("")
  }

   const handleScanOrSearch = useCallback(async (codigoOpcional) => {
   const raw = typeof codigoOpcional === 'string' ? codigoOpcional : busquedaProducto;
   const input = (raw || '').trim();
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
       mostrarNotificacion("error", "Producto no encontrado. Probá buscar por nombre.");
     }
     return;
   }

   const { data: fresh } = await refetch();
   const first = fresh?.rows?.[0];
   if (first) {
     agregarProducto(first);
     mostrarNotificacion("success", `Agregado: ${first.nombre}`);
     setBusquedaProducto("");
   } else {
     mostrarNotificacion("error", "No se encontraron productos con ese nombre");
   }
 }, [agregarProducto, busquedaProducto, mostrarNotificacion, refetch]);

 const handleScanRef = useRef(handleScanOrSearch);
 useEffect(() => {
   handleScanRef.current = handleScanOrSearch
 }, [handleScanOrSearch]);


 useEffect(() => {
   if (!scannerEnabled) return;

   let buffer = '';
   let timer;
   let locked = false;

  const shouldIgnoreFocus = () => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;

    if ((tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable) && el.dataset.scanIgnore === "true") {
        return true;
      }
      return false;
  };

  const flush = () => {
    if (!buffer || locked) return;
    locked = true;
    const code = buffer.trim();
    buffer = "";
    Promise.resolve(handleScanRef.current(code)).finally(() => {
      setTimeout(() => { locked = false }, 50);
    })
  }

  const onKeyDown = (e) => {
    
    if (shouldIgnoreFocus()) return;

    if (e.key === "Enter") {
      e.preventDefault();
      flush();
      return;
    }

    if (e.key.length === 1) {
      buffer += e.key;
      clearTimeout(timer);
      timer = setTimeout(() => {
        flush();
      }, 80);
    }
  }

  window.addEventListener("keydown", onKeyDown);
  return () => {
    clearTimeout(timer);
    window.removeEventListener("keydown", onKeyDown)
  };

 }, [scannerEnabled])
 
 

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
    <div className="text-black flex flex-col w-full py-6 px-8 ">
      {/* Alerta flotante */}
      { componenteAlerta }

      {/* Título y Botón */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight uppercase">Registrar Nueva Venta</h1>
            <p className="text-gray-600 mt-1 lg:text-base text-sm">
              Agrega productos, selecciona cliente y procesa la venta de forma rápida.
            </p>
            <div className="flex items-center gap-4 mt-3 lg:mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Zap className="h-4 w-4" />
                <span>Ctrl+Enter para procesar</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <ButtonResponsive
            variant="outlined" 
            color="blue-gray"
            onClick={() => navigate('/admin/ventas/historial-ventas')}
            icon={Receipt}
            children="Ver Historial"
            />
            <ButtonResponsive
              variant="filled"
              color="deep-orange"
              onClick={handleCreateVenta}
              disabled= {crearVenta.isPending}
              icon={Calculator}
              children="Procesar Venta"
            />
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
                <TabsHeader className="bg-gray-50 overflow-x-auto whitespace-nowrap p-2">
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
                  label="Buscar productos"
                  placeholder="Buscar productos por nombre o código de barra"
                  icon={<Search className="h-5 w-5" />}
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="!border-gray-300"
                  data-scan-ignore="true"
                  />

                {/* Dropdown de productos mejorado */}
                {busquedaProducto && (
  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-10 mt-1 max-h-72 sm:max-h-80 overflow-y-auto">
    {productos.map((producto) => {
      return (
        <div
          key={producto.id}
          onClick={() => agregarProducto(producto)}
          className="flex items-start lg:items-center gap-3 p-2 lg:p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
        >
          <Avatar
            src={mostrarImagen(producto.imagen_url)}
            alt={producto.nombre}
            variant="rounded"
            className="border border-gray-200 !w-10 !h-10 lg:!w-12 lg:!h-12"
          />

          {/* Texto y tags */}
          <div className="flex-1 min-w-0">
            {/* Nombre + badges */}
            <div className="flex items-start gap-2 mb-1 min-w-0">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium truncate"
                title={producto.nombre}
              >
                {producto.nombre}
              </Typography>
              {producto.popular && (
                <Star className="h-4 w-4 text-yellow-500 shrink-0" />
              )}
              {producto.descuento > 0 && (
                <Chip
                  size="sm"
                  value={`-${producto.descuento}%`}
                  color="red"
                  className="shrink-0"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs lg:text-sm">
              <Typography variant="small" color="gray" className="whitespace-nowrap">
                Stock: {producto.cantidad}
              </Typography>

              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium whitespace-nowrap"
              >
                ${Number(producto.precio).toFixed(2)}
              </Typography>

              {/* Oculto en mobile para no desbordar */}
              <Chip
                size="sm"
                value={producto.categoria_nombre}
                color="blue-gray"
                className="hidden sm:inline-flex"
              />
            </div>
          </div>

          <PlusCircle className="h-5 w-5 text-deep-orange-500 shrink-0" />
        </div>
      );
    })}
  </div>
)}
              </div>
            </CardBody>
          </Card>

          {/* Lista de Productos en la Venta Mejorada */}
<Card className="shadow-sm border border-gray-200">
  <CardBody className="p-3 lg:p-6">
    <Typography
      variant="h6"
      color="blue-gray"
      className="mb-3 lg:mb-4 flex items-center gap-2 uppercase font-semibold text-base lg:text-lg"
    >
      <ShoppingCart className="h-5 w-5 mb-0.5" />
      Productos en el carrito ({productosVenta.length})
    </Typography>

    {productosVenta.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10 lg:py-12 text-center">
        <ShoppingCart className="h-14 w-14 text-gray-300 mb-3 lg:h-16 lg:w-16 lg:mb-4" />
        <Typography variant="h6" color="blue-gray" className="text-base lg:text-lg">
          No hay productos agregados
        </Typography>
        <Typography variant="small" color="gray" className="mt-1">
          Busca y agrega productos para comenzar la venta.
          <br className="hidden sm:block" />
          Usa las pestañas para filtrar por categoría.
        </Typography>
      </div>
    ) : (
      <div className="space-y-3 lg:space-y-4">
        {productosVenta.map((producto, index) => {
  const precioUnit = Number(producto.precio);
  const totalItem = (precioUnit * producto.cantidadSeleccionada).toFixed(2);

  return (
    <div
      key={producto.id}
      className="rounded-lg border border-gray-200 p-3 lg:p-4 hover:shadow-sm transition-shadow"
    >
      {/* fila 1: avatar + nombre + precio c/u */}
      <div className="flex gap-3">
        <Typography variant="small" color="gray" className="w-5 lg:w-6 text-center shrink-0">
          {index + 1}.
        </Typography>

        <Avatar
          src={mostrarImagen(producto.imagen_url)}
          alt={producto.nombre}
          variant="rounded"
          className="border border-gray-200 !w-12 !h-12 lg:!w-16 lg:!h-16 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-medium truncate"
              title={producto.nombre}
            >
              {producto.nombre}
            </Typography>

            <Typography
              variant="small"
              color="blue-gray"
              className="font-semibold whitespace-nowrap"
            >
              ${precioUnit.toFixed(2)} <span className="text-gray-500">c/u</span>
            </Typography>
          </div>

          {/* badges (solo si existen) */}
          <div className="mt-1 flex items-center gap-2">
            {producto.popular && <Star className="h-4 w-4 text-yellow-500" />}
            {producto.descuento > 0 && (
              <Chip size="sm" value={`-${producto.descuento}%`} color="red" />
            )}
          </div>
        </div>
      </div>

      {/* fila 2: stepper + total */}
      <div className="mt-3 flex items-center justify-between">
        {/* stepper tipo píldora */}
        <div className="inline-flex items-center rounded-full border border-gray-300 overflow-hidden">
          <button
            type="button"
            onClick={() =>
              actualizarCantidad(producto.id, producto.cantidadSeleccionada - 1)
            }
            className="px-3 py-1.5 active:scale-95"
            aria-label="Disminuir"
          >
            –
          </button>
          <span className="w-10 text-center font-medium select-none">
            {producto.cantidadSeleccionada}
          </span>
          <button
            type="button"
            onClick={() =>
              actualizarCantidad(producto.id, producto.cantidadSeleccionada + 1)
            }
            className="px-3 py-1.5 active:scale-95"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>

        <Typography
          variant="small"
          color="blue-gray"
          className="font-extrabold text-right text-base lg:text-lg"
        >
          ${totalItem}
        </Typography>
      </div>

      {/* fila 3: acciones secundarias (solo borrar) */}
      <div className="mt-2 flex justify-end">
        <IconButton
          variant="text"
          color="red"
          size="sm"
          onClick={() => eliminarProducto(producto.id)}
          className="rounded-full"
          aria-label="Quitar del carrito"
        >
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
})}
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
                    data-scan-ignore="true"
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
                    data-scan-ignore="true"
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
                    disabled={productosVenta.length === 0 || crearVenta.isPending}
                    onClick={handleCreateVenta}
                    size="lg"
                    >
                    <Calculator className="h-5 w-5" />
                    {crearVenta.isPending ? 'Procesando...' : 'Crear venta'}
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
