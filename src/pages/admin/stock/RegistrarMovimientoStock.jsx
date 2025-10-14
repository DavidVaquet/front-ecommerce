"use client"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useSearchParams } from 'react-router'
import {
  Plus,
  Save,
  X,
  Search,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  RotateCcw,
  Calculator,
  FileText,
  User,
} from "lucide-react"
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Chip,
  Alert,
} from "@material-tailwind/react"
import { useNotificacion } from "../../../hooks/useNotificacion"
import { formatearEntero } from "../../../helpers/numeros";
import { formatearFechaHora } from "../../../helpers/formatoFecha"
import { useProductoId, useProductos } from "../../../hooks/useProductos"
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { isBarcodeLike } from "../../../utils/barcode";
import { getProductoPorBarcode } from "../../../services/productServices";
import { useMovimientoStock } from "../../../hooks/useMovimientosStock";
import { useStockMutation } from "../../../hooks/useStockMutation";

const RegistrarMovimientoStock = () => {
  
  const [searchParams] = useSearchParams();
  const productoIdParam = searchParams.get("productoId");
  const tipoParam = searchParams.get("tipo");

  const productoId = useMemo(() => {
    const n = Number(productoIdParam);
    return Number.isSafeInteger(n) && n > 0 ? n : null;
  }, [productoIdParam]);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [errors, setErrors] = useState({});
  const [scannerEnabled] = useState(true);
  const [formData, setFormData] = useState({
    tipo: tipoParam ?? "",
    producto: "",
    cantidad: "",
    motivo: "",
    documento: "",
    cliente: "",
    costo: "",
    precio: "",
    stock_objetivo: ""
  })
  
  // ALERTA HOOK
  const { mostrarNotificacion, componenteAlerta } = useNotificacion();

  // STOCK MOVEMENT MUTATION
  const { crearMovimientoStock } = useStockMutation();
    
  // TRAER LOS PRODUCTOS DESDE REACT QUERY
  const searchDebounced = useDebouncedValue(busquedaProducto, 500);
  const filtros = useMemo(() => ({
    search: searchDebounced
  }), [searchDebounced])
  const { data, refetch } = useProductos(filtros);
  const productos = data?.rows ?? [];
  // TRAER PRODUCTOS LIMITE Y BAJO STOCK
  const filtrosLimite = useMemo(() => ({
    limit: 5,
    stockBajo: 10
    
  }), [])
  const { data: productosLim } = useProductos(filtrosLimite);
  const productosLimite = productosLim?.rows ?? [];


  // TRAER LOS MOVIMIENTOS RECIENTES DESDE REACT QUERY
  const filtroMov = useMemo(() => ({
    limite: 3
  }), []);
  const { data: mov } = useMovimientoStock(filtroMov);
  const movRecientes = mov?.items ?? [];

  // TRAER PRODUCTO ID DESDE REACT QUERY
  const { data: productoIndividual } = useProductoId(productoId ?? null);

  // SELECCIONAR PRODUCTO QUE VIENE DESDE QUERY STRING
  useEffect(() => {
    if (productoIndividual) {
      seleccionarProducto(productoIndividual);
    }
  }, [productoIndividual])


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const seleccionarProducto = useCallback((producto) => {
    setProductoSeleccionado(producto)
    setFormData((prev) => ({
      ...prev,
      producto: producto.id,
      precio: producto.precio,
      costo: producto.precio_costo ?? '',
    }))
    setMostrarBusqueda(false)
    setBusquedaProducto("")
  }, []);

  const calcularStockResultante = () => {
    if (!productoSeleccionado || !formData.cantidad) return null

    const cantidad = Number.parseInt(formData.cantidad)
    const stockActual = productoSeleccionado.cantidad

    switch (formData.tipo) {
      case "entrada":
        return stockActual + cantidad
      case "devolucion_cliente":
        return stockActual + cantidad
      case "salida":
        return stockActual - cantidad
      case "ajuste":
        return stockActual + cantidad
      default:
        return stockActual
    }
  }

  const validarFormulario = () => {
    const newErrors = {}

    if (!formData.tipo) newErrors.tipo = "Selecciona un tipo de movimiento"
    if (!productoSeleccionado) newErrors.producto = "Selecciona un producto"
    if (!formData.motivo) newErrors.motivo = "Ingresa el motivo del movimiento"


    if (formData.tipo === 'ajuste'){
      const delta = Number(formData.stock_objetivo);
      if (!Number.isInteger(delta)){
        newErrors.stock_objetivo = "Ingresa un entero mayor a 0.";
      }
    } else {
      if (!formData.cantidad) newErrors.cantidad = "Ingresa la cantidad"
    }

    // Validar stock suficiente para salidas
    if ((formData.tipo === "salida") && productoSeleccionado) {
      const cantidad = Number.parseInt(formData.cantidad)
      if (cantidad > productoSeleccionado.cantidad) {
        newErrors.cantidad = "Stock insuficiente"
      }
      if (!formData.costo) {
        newErrors.costo = 'Ingresa el costo unitario'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const toServerPayload = () => {

    const base = {
      movement_type: formData.tipo,
      product_id: Number(productoSeleccionado.id),
      motivo: formData.motivo,
      document: formData.documento,
      costo_unitario: Number(formData.costo),
      precio_venta: Number(formData.precio),
      cliente: formData.cliente
    };

    if (formData.tipo === 'ajuste') {
      const objetivo = formData.stock_objetivo;
      const motiv = formData.motivo;
      return { ...base, stock_objetivo: Number(objetivo), motivo: motiv ?? 'Ajuste'};
    };

    return { ...base, cantidad: Number(formData.cantidad)};

  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (validarFormulario()) {
        
        const payload = toServerPayload();

        const nuevoMovimientoStock = await crearMovimientoStock.mutateAsync(payload);

        if (nuevoMovimientoStock){

          
          mostrarNotificacion('success', 'Movimiento registrado.');
          
          setFormData({
            tipo: "",
            producto: "",
            cantidad: "",
            motivo: "",
            documento: "",
            cliente: "",
            costo: "",
            precio: "",
            stock_objetivo: ""
          })
          setProductoSeleccionado(null)
        };
      
      }
      
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', 'Error al registrar el movimiento.')
    }
  }

  
  const tiposMovimiento = [
    {
      codigo: "entrada",
      label: "Entrada",
      icon: ArrowUpCircle,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-600",
    },
    {
      codigo: "salida",
      label: "Salida",
      icon: ArrowDownCircle,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-600",
    },
    {
      codigo: "ajuste",
      label: "Ajuste",
      icon: RefreshCw,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
    },
    {
      codigo: "devolucion_cliente",
      label: "Devolución",
      icon: RotateCcw,
      color: "orange",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      textColor: "text-orange-600",
    },
  ];

  const disabled = formData.tipo === 'ajuste' ? !formData.tipo || !productoSeleccionado || !formData.stock_objetivo : !formData.tipo || !productoSeleccionado || !formData.cantidad;
  
  const tipoSeleccionado = tiposMovimiento.find((t) => t.codigo === formData.tipo)
  const stockResultante = calcularStockResultante();

  const handleScanOrSearch = useCallback(async (codigoOpcional) => {
    const raw = (typeof codigoOpcional === 'string' ? codigoOpcional : busquedaProducto);
    const input = (raw || '').trim();
    if (!input) return;
  
    if (isBarcodeLike(input)) {
      try {
        const producto = await getProductoPorBarcode(input);
        if (producto) {
          seleccionarProducto(producto);
          mostrarNotificacion("success", `Agregado por código: ${producto.nombre}`);
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
  
    const { data: fresh } = await refetch();
    const first = fresh?.rows?.[0];
    if (first) {
      seleccionarProducto(first);
      mostrarNotificacion("success", `Agregado: ${first.nombre}`);
      setBusquedaProducto("");
    } else {
      mostrarNotificacion("error", "No se encontraron productos con ese nombre");
    }
  }, [seleccionarProducto, busquedaProducto, mostrarNotificacion, refetch]);

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
  
  return (
    
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                {/* COMPONENTE PARA LA ALERTA */}
                      {componenteAlerta}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Typography variant="h4" color="blue-gray" className="flex items-center gap-2 mb-2 uppercase">
                  <Plus className="w-7 h-7 text-blue-600" />
                  Registrar Movimiento de Stock
                </Typography>
                <Typography color="gray" className="font-normal">
                  Registra entradas, salidas, ajustes y transferencias de inventario
                </Typography>
              </div>
              <Button color="gray" className="flex items-center justify-center text-sm" size="md" onClick={() => window.history.back()}>
                <X className="w-5 h-5 mr-1" />
                Cancelar
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario Principal - 2/3 del ancho */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Tipo de Movimiento */}
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                      Tipo de Movimiento
                    </Typography>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {tiposMovimiento.map((tipo) => {
                        const Icon = tipo.icon
                        const isSelected = formData.tipo === tipo.codigo
                        return (
                          <div
                            key={tipo.codigo}
                            onClick={() => handleInputChange("tipo", tipo.codigo)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              isSelected
                                ? `${tipo.borderColor} ${tipo.bgColor}`
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="text-center">
                              <Icon
                                className={`w-8 h-8 mx-auto mb-2 ${isSelected ? tipo.textColor : "text-gray-400"}`}
                              />
                              <Typography
                                variant="small"
                                className={`font-medium ${isSelected ? tipo.textColor : "text-gray-600"}`}
                              >
                                {tipo.label}
                              </Typography>
                            </div>
                          </div>
                        )
                      })} 
                    </div>
                    {errors.tipo && (
                      <Typography variant="small" color="red" className="mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.tipo}
                      </Typography>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                      Selección de Producto
                    </Typography>

                    {!productoSeleccionado ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            label="Buscar producto por nombre o código de barra"
                            value={busquedaProducto}
                            data-scan-ignore="true"
                            onChange={(e) => {
                              setBusquedaProducto(e.target.value)
                              setMostrarBusqueda(e.target.value.length > 0)
                            }}
                            icon={<Search className="w-4 h-4" />}
                          />

                          {mostrarBusqueda && busquedaProducto && (
                            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {productos.length > 0 ? (
                                productos.map((producto) => (
                                  <div
                                    key={producto.id}
                                    onClick={() => seleccionarProducto(producto)}
                                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                          {producto.nombre}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="mt-1">
                                          Barcode: {producto.barcode} • {producto.categoria_nombre}
                                        </Typography>
                                      </div>
                                      <Chip
                                        value={`Stock: ${producto.cantidad}`}
                                        color={
                                          producto.cantidad > 10
                                            ? "green"
                                            : producto.cantidad > 0
                                              ? "orange"
                                              : "red"
                                        }
                                        size="sm"
                                      />
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center">
                                  <Typography variant="small" color="gray">
                                    No se encontraron productos
                                  </Typography>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <Typography variant="h6" color="blue-gray" className="mb-1">
                              {productoSeleccionado.nombre}
                            </Typography>
                            <Typography variant="small" color="gray" className="mb-3">
                              Barcode: {productoSeleccionado?.barcode} • {productoSeleccionado.categoria_nombre}
                            </Typography>
                            <div className="flex flex-wrap gap-2">
                              <Chip
                                value={`Stock actual: ${productoSeleccionado.cantidad}`}
                                color="blue"
                                size="sm"
                              />
                              {stockResultante !== null && (
                                <Chip
                                  value={`Stock resultante: ${stockResultante}`}
                                  color={stockResultante >= 0 ? "green" : "red"}
                                  size="sm"
                                />
                              )}
                            </div>
                          </div>
                          <Button
                            variant="text"
                            size="sm"
                            onClick={() => {
                              setProductoSeleccionado(null)
                              setFormData((prev) => ({ ...prev, producto: "", costo: "", precio: "" }))
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {errors.producto && (
                      <Typography variant="small" color="red" className="mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.producto}
                      </Typography>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                      Detalles del Movimiento
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                      {formData.tipo != 'ajuste' && (
                      <div>
                        <Input
                          label="Cantidad"
                          type="number"
                          value={formData.cantidad}
                          onChange={(e) => handleInputChange("cantidad", e.target.value)}
                          data-scan-ignore="true"
                          error={!!errors.cantidad}
                        />
                        {errors.cantidad && (
                          <Typography variant="small" color="red" className="mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cantidad}
                          </Typography>
                        )}
                      </div>
                      )}

                      {formData.tipo === 'ajuste' && (
                      <div>
                        <Input
                          label="Stock final deseado"
                          type="number"
                          value={formData.stock_objetivo}
                          onChange={(e) => handleInputChange("stock_objetivo", e.target.value)}
                          data-scan-ignore="true"
                          error={!!errors.stock_objetivo}
                        />
                        {errors.stock_objetivo && (
                          <Typography variant="small" color="red" className="mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.stock_objetivo}
                          </Typography>
                        )}
                      </div>
                      )}

                      <div>
                        <Input
                          label="Número de documento"
                          value={formData.documento}
                          onChange={(e) => handleInputChange("documento", e.target.value)}
                          data-scan-ignore="true"
                          icon={<FileText className="w-4 h-4" />}
                        />
                      </div>



                      {formData.tipo === "devolucion_cliente" && (
                        <div className="md:col-span-2">
                          <Input
                            label="Cliente"
                            value={formData.cliente}
                            onChange={(e) => handleInputChange("cliente", e.target.value)}
                            data-scan-ignore="true"
                            error={!!errors.cliente}
                            icon={<User className="w-4 h-4" />}
                          />
                          {errors.cliente && (
                            <Typography variant="small" color="red" className="mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.cliente}
                            </Typography>
                          )}
                        </div>
                          
                      )}

                      {formData.tipo === "salida" && (
                        <div className="md:col-span-2">
                          <Input
                            label="Costo unitario"
                            value={formData.costo}
                            onChange={(e) => handleInputChange("costo", e.target.value)}
                            data-scan-ignore="true"
                            error={!!errors.costo}
                            icon={<Calculator className="w-4 h-4" />}
                          />
                          {errors.costo && (
                            <Typography variant="small" color="red" className="mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.costo}
                            </Typography>
                          )}
                        </div>
                          
                      )}

                    </div>

                    {(formData.tipo === "entrada" || formData.tipo === "ajuste") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <Input
                            label="Costo unitario"
                            type="number"
                            value={formData.costo}
                            onChange={(e) => handleInputChange("costo", e.target.value)}
                            data-scan-ignore="true"
                            icon={<Calculator className="w-4 h-4" />}
                          />
                        </div>
                        <div>
                          <Input
                            label="Precio de venta"
                            type="number"
                            value={formData.precio}
                            onChange={(e) => handleInputChange("precio", e.target.value)}
                            data-scan-ignore="true"
                            icon={<Calculator className="w-4 h-4" />}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Textarea
                          label="Motivo del movimiento"
                          value={formData.motivo}
                          onChange={(e) => handleInputChange("motivo", e.target.value)}
                          data-scan-ignore="true"
                          error={!!errors.motivo}
                          rows={3}
                        />
                        {errors.motivo && (
                          <Typography variant="small" color="red" className="mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.motivo}
                          </Typography>
                        )}
                      </div>
                    </div>

                    
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <Button
                        variant="outlined"
                        size="lg"
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="flex items-center justify-center gap-2 bg-blue-600"
                        disabled={disabled}
                      >
                        <Save className="w-4 h-4" />
                        Registrar Movimiento
                      </Button>
                    </div>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Resumen del Movimiento */}
            {formData.tipo && productoSeleccionado && formData.cantidad && (
              <Card className="shadow-sm">
                <CardBody className="p-6">
                  <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Resumen del Movimiento
                  </Typography>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Typography color="gray" variant="small">
                          Tipo:
                        </Typography>
                        <div className="flex items-center gap-2">
                          {tipoSeleccionado && (
                            <tipoSeleccionado.icon className={`w-4 h-4 ${tipoSeleccionado.textColor}`} />
                          )}
                          <Typography color="blue-gray" className="font-medium uppercase">
                            {formData.tipo === 'devolucion_cliente' ? 'Devolución del cliente' : formData.tipo}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography color="gray" variant="small">
                          Producto:
                        </Typography>
                        <Typography color="blue-gray" className="font-medium text-right text-sm max-w-32">
                          {productoSeleccionado.nombre}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-center">
                        <Typography color="gray" variant="small">
                          Cantidad:
                        </Typography>
                        <Typography
                          className={`font-medium ${
                            ["entrada", "devolucion"].includes(formData.tipo)
                              ? "text-green-600"
                              : ["salida", "transferencia"].includes(formData.tipo)
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          {["entrada", "devolucion"].includes(formData.tipo)
                            ? "+"
                            : ["salida", "transferencia"].includes(formData.tipo)
                              ? "-"
                              : ""}
                          {formData.cantidad}
                        </Typography>
                      </div>

                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <Typography color="gray" variant="small">
                            Stock actual:
                          </Typography>
                          <Typography color="blue-gray" className="font-medium">
                            {productoSeleccionado.cantidad}
                          </Typography>
                        </div>

                        <div className="flex justify-between items-center">
                          <Typography color="gray" variant="small" className="font-medium">
                            Stock resultante:
                          </Typography>
                          <Typography
                            className={`font-bold ${stockResultante >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {stockResultante}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {stockResultante < 0 && (
                      <Alert color="red" className="mt-3">
                        <AlertCircle className="w-4 h-4" />
                        <Typography variant="small">Advertencia: El stock resultante será negativo</Typography>
                      </Alert>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Movimientos Recientes */}
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Movimientos Recientes
                </Typography>

                <div className="space-y-3">
                  {movRecientes.map((mov, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {mov.producto_nombre}
                        </Typography>
                        <Typography variant="small" color="gray">
                          {formatearFechaHora(mov.fecha_creacion)}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Chip
                          value={mov.tipo}
                          color={mov.tipo === "Entrada" ? "green" : mov.tipo === "Salida" ? "red" : mov.tipo === 'Ajuste' ? 'orange' : 'blue'}
                          size="sm"
                        />
                        <Typography
                          variant="small"
                          className={`font-medium mt-1 ${mov.direction > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {mov.direction > 0 ? "+" : "-"}
                          {formatearEntero(mov.cantidad_movimiento)}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Alertas de Stock */}
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Alertas de Stock
                </Typography>
                {productosLimite.map((prod, index) => (
                <div key={index} className="space-y-3 mb-[6px]">
                  <Alert color={prod.cantidad <= 0 ? 'red' : prod.cantidad < 10 ? 'orange' : 'green'} className="py-2">
                    <Typography variant="small">
                      <strong>{prod.nombre}:</strong> {prod.cantidad <= 0 ? 'Sin Stock' : prod.cantidad < 10 ? 'Stock Critico' : 'Stock Regular'} ({prod.cantidad} unidades)
                    </Typography>
                  </Alert>
                </div>

                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrarMovimientoStock
