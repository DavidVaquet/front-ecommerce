"use client"

import { useState } from "react"
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Switch,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Chip,
  Alert,
} from "@material-tailwind/react"
import {
  Settings,
  Building2,
  Package,
  ShoppingCart,
  Users,
  Bell,
  Database,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Percent,
  FileText,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Upload,
  Download,
  Plus,
  Edit3,
  Key,
  Server,
  Zap,
  Webhook,
} from "lucide-react"

const ConfiguracionesDashboard = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [mostrarAlerta, setMostrarAlerta] = useState(false)
  const [mensajeAlerta, setMensajeAlerta] = useState("")
  const [tipoAlerta, setTipoAlerta] = useState("success")

  // Estados para las diferentes configuraciones
  const [configGeneral, setConfigGeneral] = useState({
    nombreEmpresa: "Mi Empresa S.A.",
    direccion: "Av. Corrientes 1234, CABA",
    telefono: "+54 11 1234-5678",
    email: "contacto@miempresa.com",
    sitioWeb: "www.miempresa.com",
    cuit: "20-12345678-9",
    logo: null,
    monedaPrincipal: "ARS",
    zonaHoraria: "America/Argentina/Buenos_Aires",
    formatoFecha: "DD/MM/YYYY",
  })

  const [configInventario, setConfigInventario] = useState({
    stockMinimo: 10,
    alertaBajoStock: true,
    alertaSinStock: true,
    actualizacionAutomatica: true,
    mostrarCostos: true,
    permitirStockNegativo: false,
    unidadMedidaDefecto: "unidad",
    categoriaDefecto: "general",
  })

  const [configVentas, setConfigVentas] = useState({
    iva: 21,
    descuentoMaximo: 50,
    permitirVentaSinStock: false,
    facturacionAutomatica: true,
    numeracionAutomatica: true,
    proximoNumeroFactura: 1001,
    metodoPagoDefecto: "efectivo",
    validezPresupuesto: 30,
  })

  const [configNotificaciones, setConfigNotificaciones] = useState({
    emailVentas: true,
    emailInventario: true,
    emailReportes: true,
    pushNotifications: false,
    smsAlertas: false,
    frecuenciaReportes: "semanal",
    horaEnvioReportes: "09:00",
  })

  const [configSeguridad, setConfigSeguridad] = useState({
    sesionExpira: 480, // minutos
    intentosLogin: 5,
    bloqueoTemporal: 30, // minutos
    requiere2FA: false,
    logActividad: true,
    backupAutomatico: true,
    frecuenciaBackup: "diario",
    retencionBackup: 30, // días
  })

  const [configAvanzada, setConfigAvanzada] = useState({
    modoDebug: false,
    logLevel: "info",
    cacheEnabled: true,
    apiRateLimit: 1000,
    webhookUrl: "",
    apiKey: "",
    integracionContable: false,
    sincronizacionAutomatica: false,
  })

  const tabsData = [
    { label: "General", value: "general", icon: Building2 },
    { label: "Inventario", value: "inventario", icon: Package },
    { label: "Ventas", value: "ventas", icon: ShoppingCart },
    { label: "Usuarios", value: "usuarios", icon: Users },
    { label: "Notificaciones", value: "notificaciones", icon: Bell },
    { label: "Seguridad", value: "seguridad", icon: Shield },
    { label: "Avanzado", value: "avanzado", icon: Settings },
  ]

  const mostrarNotificacion = (tipo, mensaje) => {
    setTipoAlerta(tipo)
    setMensajeAlerta(mensaje)
    setMostrarAlerta(true)
    setTimeout(() => setMostrarAlerta(false), 3000)
  }

  const guardarConfiguracion = (seccion) => {
    // Aquí iría la lógica para guardar en la base de datos
    console.log(`Guardando configuración de ${seccion}`)
    mostrarNotificacion("success", `Configuración de ${seccion} guardada exitosamente`)
  }

  const resetearConfiguracion = (seccion) => {
    // Aquí iría la lógica para resetear a valores por defecto
    console.log(`Reseteando configuración de ${seccion}`)
    mostrarNotificacion("success", `Configuración de ${seccion} restablecida`)
  }

  const exportarConfiguracion = () => {
    // Aquí iría la lógica para exportar configuraciones
    const config = {
      general: configGeneral,
      inventario: configInventario,
      ventas: configVentas,
      notificaciones: configNotificaciones,
      seguridad: configSeguridad,
      avanzada: configAvanzada,
    }
    console.log("Exportando configuración:", config)
    mostrarNotificacion("success", "Configuración exportada exitosamente")
  }

  const importarConfiguracion = () => {
    // Aquí iría la lógica para importar configuraciones
    console.log("Importando configuración")
    mostrarNotificacion("success", "Configuración importada exitosamente")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Alerta flotante */}
      {mostrarAlerta && (
        <div className="fixed top-4 right-4 z-50">
          <Alert color={tipoAlerta === "success" ? "green" : "red"} className="shadow-lg">
            {mensajeAlerta}
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <Typography variant="h4" color="blue-gray" className="mb-2">
            Configuraciones del Sistema
          </Typography>
          <Typography color="gray" className="text-lg">
            Gestiona todas las configuraciones de tu dashboard administrativo
          </Typography>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button size="sm" variant="outlined" onClick={importarConfiguracion} className="flex items-center gap-2">
            <Upload size={16} />
            Importar
          </Button>
          <Button size="sm" variant="outlined" onClick={exportarConfiguracion} className="flex items-center gap-2">
            <Download size={16} />
            Exportar
          </Button>
          <Button size="sm" color="blue" className="flex items-center gap-2">
            <Save size={16} />
            Guardar Todo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="shadow-sm">
        <CardBody className="p-0">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsHeader className="bg-gray-50">
              {tabsData.map(({ label, value, icon: Icon }) => (
                <Tab key={value} value={value} className="flex items-center gap-2">
                  <Icon size={16} />
                  {label}
                </Tab>
              ))}
            </TabsHeader>

            <TabsBody className="p-6">
              {/* Pestaña General */}
              <TabPanel value="general" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información de la Empresa */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Building2 size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Información de la Empresa
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Nombre de la Empresa
                          </Typography>
                          <Input
                            value={configGeneral.nombreEmpresa}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, nombreEmpresa: e.target.value })}
                            icon={<Building2 size={16} />}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Dirección
                          </Typography>
                          <Input
                            value={configGeneral.direccion}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, direccion: e.target.value })}
                            icon={<MapPin size={16} />}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              Teléfono
                            </Typography>
                            <Input
                              value={configGeneral.telefono}
                              onChange={(e) => setConfigGeneral({ ...configGeneral, telefono: e.target.value })}
                              icon={<Phone size={16} />}
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              Email
                            </Typography>
                            <Input
                              value={configGeneral.email}
                              onChange={(e) => setConfigGeneral({ ...configGeneral, email: e.target.value })}
                              icon={<Mail size={16} />}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              Sitio Web
                            </Typography>
                            <Input
                              value={configGeneral.sitioWeb}
                              onChange={(e) => setConfigGeneral({ ...configGeneral, sitioWeb: e.target.value })}
                              icon={<Globe size={16} />}
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              CUIT/RUT
                            </Typography>
                            <Input
                              value={configGeneral.cuit}
                              onChange={(e) => setConfigGeneral({ ...configGeneral, cuit: e.target.value })}
                              icon={<FileText size={16} />}
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Configuraciones Regionales */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Globe size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Configuraciones Regionales
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Moneda Principal
                          </Typography>
                          <select
                            value={configGeneral.monedaPrincipal}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, monedaPrincipal: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="ARS">Peso Argentino (ARS)</option>
                            <option value="USD">Dólar Estadounidense (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="BRL">Real Brasileño (BRL)</option>
                          </select>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Zona Horaria
                          </Typography>
                          <select
                            value={configGeneral.zonaHoraria}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, zonaHoraria: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                            <option value="America/New_York">New York (GMT-5)</option>
                            <option value="Europe/Madrid">Madrid (GMT+1)</option>
                          </select>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Formato de Fecha
                          </Typography>
                          <select
                            value={configGeneral.formatoFecha}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, formatoFecha: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Logo de la Empresa
                          </Typography>
                          <div className="flex items-center gap-3">
                            <Button size="sm" variant="outlined" className="flex items-center gap-2">
                              <Upload size={16} />
                              Subir Logo
                            </Button>
                            <Typography color="gray" className="text-sm">
                              Formato: PNG, JPG (máx. 2MB)
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Botones de Acción */}
                  <div className="lg:col-span-2 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("general")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("general")}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Inventario */}
              <TabPanel value="inventario" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuraciones de Stock */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Package size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Configuraciones de Stock
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Stock Mínimo por Defecto
                          </Typography>
                          <Input
                            type="number"
                            value={configInventario.stockMinimo}
                            onChange={(e) =>
                              setConfigInventario({ ...configInventario, stockMinimo: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Alerta de Bajo Stock
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Notificar cuando el stock esté por debajo del mínimo
                            </Typography>
                          </div>
                          <Switch
                            checked={configInventario.alertaBajoStock}
                            onChange={() =>
                              setConfigInventario({
                                ...configInventario,
                                alertaBajoStock: !configInventario.alertaBajoStock,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Alerta de Sin Stock
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Notificar cuando no haya stock disponible
                            </Typography>
                          </div>
                          <Switch
                            checked={configInventario.alertaSinStock}
                            onChange={() =>
                              setConfigInventario({
                                ...configInventario,
                                alertaSinStock: !configInventario.alertaSinStock,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Actualización Automática
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Actualizar stock automáticamente con las ventas
                            </Typography>
                          </div>
                          <Switch
                            checked={configInventario.actualizacionAutomatica}
                            onChange={() =>
                              setConfigInventario({
                                ...configInventario,
                                actualizacionAutomatica: !configInventario.actualizacionAutomatica,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Permitir Stock Negativo
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Permitir ventas aunque no haya stock suficiente
                            </Typography>
                          </div>
                          <Switch
                            checked={configInventario.permitirStockNegativo}
                            onChange={() =>
                              setConfigInventario({
                                ...configInventario,
                                permitirStockNegativo: !configInventario.permitirStockNegativo,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Configuraciones de Productos */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Settings size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Configuraciones de Productos
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Unidad de Medida por Defecto
                          </Typography>
                          <select
                            value={configInventario.unidadMedidaDefecto}
                            onChange={(e) =>
                              setConfigInventario({ ...configInventario, unidadMedidaDefecto: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="unidad">Unidad</option>
                            <option value="kg">Kilogramo</option>
                            <option value="litro">Litro</option>
                            <option value="metro">Metro</option>
                            <option value="caja">Caja</option>
                          </select>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Categoría por Defecto
                          </Typography>
                          <select
                            value={configInventario.categoriaDefecto}
                            onChange={(e) =>
                              setConfigInventario({ ...configInventario, categoriaDefecto: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="general">General</option>
                            <option value="electronicos">Electrónicos</option>
                            <option value="ropa">Ropa</option>
                            <option value="hogar">Hogar</option>
                            <option value="deportes">Deportes</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Mostrar Costos
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Mostrar precios de costo en el inventario
                            </Typography>
                          </div>
                          <Switch
                            checked={configInventario.mostrarCostos}
                            onChange={() =>
                              setConfigInventario({
                                ...configInventario,
                                mostrarCostos: !configInventario.mostrarCostos,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Botones de Acción */}
                  <div className="lg:col-span-2 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("inventario")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("inventario")}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Ventas */}
              <TabPanel value="ventas" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuraciones de Precios e Impuestos */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <DollarSign size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Precios e Impuestos
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            IVA por Defecto (%)
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.iva}
                            onChange={(e) =>
                              setConfigVentas({ ...configVentas, iva: Number.parseFloat(e.target.value) })
                            }
                            icon={<Percent size={16} />}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Descuento Máximo (%)
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.descuentoMaximo}
                            onChange={(e) =>
                              setConfigVentas({ ...configVentas, descuentoMaximo: Number.parseFloat(e.target.value) })
                            }
                            icon={<Percent size={16} />}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Método de Pago por Defecto
                          </Typography>
                          <select
                            value={configVentas.metodoPagoDefecto}
                            onChange={(e) => setConfigVentas({ ...configVentas, metodoPagoDefecto: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta_debito">Tarjeta de Débito</option>
                            <option value="tarjeta_credito">Tarjeta de Crédito</option>
                            <option value="transferencia">Transferencia</option>
                          </select>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Validez de Presupuestos (días)
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.validezPresupuesto}
                            onChange={(e) =>
                              setConfigVentas({ ...configVentas, validezPresupuesto: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Configuraciones de Facturación */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <FileText size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Facturación
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Próximo Número de Factura
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.proximoNumeroFactura}
                            onChange={(e) =>
                              setConfigVentas({
                                ...configVentas,
                                proximoNumeroFactura: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Facturación Automática
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Generar factura automáticamente al confirmar venta
                            </Typography>
                          </div>
                          <Switch
                            checked={configVentas.facturacionAutomatica}
                            onChange={() =>
                              setConfigVentas({
                                ...configVentas,
                                facturacionAutomatica: !configVentas.facturacionAutomatica,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Numeración Automática
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Asignar números de factura automáticamente
                            </Typography>
                          </div>
                          <Switch
                            checked={configVentas.numeracionAutomatica}
                            onChange={() =>
                              setConfigVentas({
                                ...configVentas,
                                numeracionAutomatica: !configVentas.numeracionAutomatica,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Permitir Venta sin Stock
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Permitir ventas aunque no haya stock disponible
                            </Typography>
                          </div>
                          <Switch
                            checked={configVentas.permitirVentaSinStock}
                            onChange={() =>
                              setConfigVentas({
                                ...configVentas,
                                permitirVentaSinStock: !configVentas.permitirVentaSinStock,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Botones de Acción */}
                  <div className="lg:col-span-2 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("ventas")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("ventas")}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Usuarios */}
              <TabPanel value="usuarios" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gestión de Usuarios */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Users size={20} />
                          <Typography variant="h6" color="blue-gray">
                            Usuarios del Sistema
                          </Typography>
                        </div>
                        <Button size="sm" color="blue" className="flex items-center gap-2">
                          <Plus size={16} />
                          Nuevo Usuario
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {/* Lista de usuarios simulada */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <Typography color="blue-gray" className="font-medium">
                                  Juan Rodríguez
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                  juan@empresa.com
                                </Typography>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Chip value="Administrador" color="blue" size="sm" />
                              <Button size="sm" variant="outlined" className="p-2">
                                <Edit3 size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Users size={16} className="text-green-600" />
                              </div>
                              <div>
                                <Typography color="blue-gray" className="font-medium">
                                  María García
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                  maria@empresa.com
                                </Typography>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Chip value="Vendedor" color="green" size="sm" />
                              <Button size="sm" variant="outlined" className="p-2">
                                <Edit3 size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users size={16} className="text-purple-600" />
                              </div>
                              <div>
                                <Typography color="blue-gray" className="font-medium">
                                  Carlos López
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                  carlos@empresa.com
                                </Typography>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Chip value="Supervisor" color="purple" size="sm" />
                              <Button size="sm" variant="outlined" className="p-2">
                                <Edit3 size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Roles y Permisos */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Shield size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Roles y Permisos
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <Typography color="blue-gray" className="font-medium mb-3">
                            Administrador
                          </Typography>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Gestión completa</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Configuraciones</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Reportes</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Usuarios</Typography>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <Typography color="blue-gray" className="font-medium mb-3">
                            Vendedor
                          </Typography>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Ventas</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Clientes</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={14} className="text-red-600" />
                              <Typography color="gray">Inventario (solo lectura)</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={14} className="text-red-600" />
                              <Typography color="gray">Reportes limitados</Typography>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <Typography color="blue-gray" className="font-medium mb-3">
                            Supervisor
                          </Typography>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Ventas</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Inventario</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600" />
                              <Typography color="gray">Reportes</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={14} className="text-red-600" />
                              <Typography color="gray">Configuraciones limitadas</Typography>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Botones de Acción */}
                  <div className="lg:col-span-2 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("usuarios")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("usuarios")}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Notificaciones */}
              <TabPanel value="notificaciones" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuraciones de Email */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Mail size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Notificaciones por Email
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Notificaciones de Ventas
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Enviar email cuando se realice una venta
                            </Typography>
                          </div>
                          <Switch
                            checked={configNotificaciones.emailVentas}
                            onChange={() =>
                              setConfigNotificaciones({
                                ...configNotificaciones,
                                emailVentas: !configNotificaciones.emailVentas,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Alertas de Inventario
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Notificar sobre stock bajo o productos críticos
                            </Typography>
                          </div>
                          <Switch
                            checked={configNotificaciones.emailInventario}
                            onChange={() =>
                              setConfigNotificaciones({
                                ...configNotificaciones,
                                emailInventario: !configNotificaciones.emailInventario,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Reportes Automáticos
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Enviar reportes programados por email
                            </Typography>
                          </div>
                          <Switch
                            checked={configNotificaciones.emailReportes}
                            onChange={() =>
                              setConfigNotificaciones({
                                ...configNotificaciones,
                                emailReportes: !configNotificaciones.emailReportes,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Frecuencia de Reportes
                          </Typography>
                          <select
                            value={configNotificaciones.frecuenciaReportes}
                            onChange={(e) =>
                              setConfigNotificaciones({ ...configNotificaciones, frecuenciaReportes: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="diario">Diario</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                          </select>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Hora de Envío de Reportes
                          </Typography>
                          <Input
                            type="time"
                            value={configNotificaciones.horaEnvioReportes}
                            onChange={(e) =>
                              setConfigNotificaciones({ ...configNotificaciones, horaEnvioReportes: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Otras Notificaciones */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Bell size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Otras Notificaciones
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Notificaciones Push
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Mostrar notificaciones en el navegador
                            </Typography>
                          </div>
                          <Switch
                            checked={configNotificaciones.pushNotifications}
                            onChange={() =>
                              setConfigNotificaciones({
                                ...configNotificaciones,
                                pushNotifications: !configNotificaciones.pushNotifications,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Alertas por SMS
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Enviar alertas críticas por mensaje de texto
                            </Typography>
                          </div>
                          <Switch
                            checked={configNotificaciones.smsAlertas}
                            onChange={() =>
                              setConfigNotificaciones({
                                ...configNotificaciones,
                                smsAlertas: !configNotificaciones.smsAlertas,
                              })
                            }
                          />
                        </div>
                        <Alert color="blue" className="mt-4">
                          <Typography className="text-sm">
                            Las notificaciones push requieren permisos del navegador. Las alertas por SMS requieren
                            configuración adicional del proveedor.
                          </Typography>
                        </Alert>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Botones de Acción */}
                  <div className="lg:col-span-2 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("notificaciones")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("notificaciones")}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Seguridad */}
              <TabPanel value="seguridad" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuraciones de Sesión */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Shield size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Seguridad de Sesiones
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Tiempo de Expiración de Sesión (minutos)
                          </Typography>
                          <Input
                            type="number"
                            value={configSeguridad.sesionExpira}
                            onChange={(e) =>
                              setConfigSeguridad({ ...configSeguridad, sesionExpira: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Intentos de Login Permitidos
                          </Typography>
                          <Input
                            type="number"
                            value={configSeguridad.intentosLogin}
                            onChange={(e) =>
                              setConfigSeguridad({ ...configSeguridad, intentosLogin: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Tiempo de Bloqueo Temporal (minutos)
                          </Typography>
                          <Input
                            type="number"
                            value={configSeguridad.bloqueoTemporal}
                            onChange={(e) =>
                              setConfigSeguridad({
                                ...configSeguridad,
                                bloqueoTemporal: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Requerir Autenticación 2FA
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Obligar a todos los usuarios a usar 2FA
                            </Typography>
                          </div>
                          <Switch
                            checked={configSeguridad.requiere2FA}
                            onChange={() =>
                              setConfigSeguridad({ ...configSeguridad, requiere2FA: !configSeguridad.requiere2FA })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Registrar Actividad
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Mantener logs de todas las acciones de usuarios
                            </Typography>
                          </div>
                          <Switch
                            checked={configSeguridad.logActividad}
                            onChange={() =>
                              setConfigSeguridad({ ...configSeguridad, logActividad: !configSeguridad.logActividad })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Configuraciones de Backup */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Database size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Copias de Seguridad
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Backup Automático
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Realizar copias de seguridad automáticamente
                            </Typography>
                          </div>
                          <Switch
                            checked={configSeguridad.backupAutomatico}
                            onChange={() =>
                              setConfigSeguridad({
                                ...configSeguridad,
                                backupAutomatico: !configSeguridad.backupAutomatico,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Frecuencia de Backup
                          </Typography>
                          <select
                            value={configSeguridad.frecuenciaBackup}
                            onChange={(e) =>
                              setConfigSeguridad({ ...configSeguridad, frecuenciaBackup: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="diario">Diario</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                          </select>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Retención de Backups (días)
                          </Typography>
                          <Input
                            type="number"
                            value={configSeguridad.retencionBackup}
                            onChange={(e) =>
                              setConfigSeguridad({
                                ...configSeguridad,
                                retencionBackup: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outlined"
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <Download size={16} />
                            Crear Backup
                          </Button>
                          <Button
                            size="sm"
                            variant="outlined"
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <Upload size={16} />
                            Restaurar
                          </Button>
                        </div>
                        <Alert color="amber">
                          <Typography className="text-sm">
                            Los backups se almacenan de forma segura y encriptada. Recomendamos mantener al menos 7 días
                            de retención.
                          </Typography>
                        </Alert>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Botones de Acción */}
                  <div className="lg:col-span-2 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("seguridad")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("seguridad")}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Avanzado */}
              <TabPanel value="avanzado" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuraciones del Sistema */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Server size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Configuraciones del Sistema
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Modo Debug
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Activar logs detallados para desarrollo
                            </Typography>
                          </div>
                          <Switch
                            checked={configAvanzada.modoDebug}
                            onChange={() =>
                              setConfigAvanzada({ ...configAvanzada, modoDebug: !configAvanzada.modoDebug })
                            }
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Nivel de Logs
                          </Typography>
                          <select
                            value={configAvanzada.logLevel}
                            onChange={(e) => setConfigAvanzada({ ...configAvanzada, logLevel: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Cache Habilitado
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Usar cache para mejorar el rendimiento
                            </Typography>
                          </div>
                          <Switch
                            checked={configAvanzada.cacheEnabled}
                            onChange={() =>
                              setConfigAvanzada({ ...configAvanzada, cacheEnabled: !configAvanzada.cacheEnabled })
                            }
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Límite de Rate API (req/hora)
                          </Typography>
                          <Input
                            type="number"
                            value={configAvanzada.apiRateLimit}
                            onChange={(e) =>
                              setConfigAvanzada({ ...configAvanzada, apiRateLimit: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Integraciones */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Zap size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Integraciones y API
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Webhook URL
                          </Typography>
                          <Input
                            value={configAvanzada.webhookUrl}
                            onChange={(e) => setConfigAvanzada({ ...configAvanzada, webhookUrl: e.target.value })}
                            placeholder="https://tu-webhook.com/endpoint"
                            icon={<Webhook size={16} />}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            API Key
                          </Typography>
                          <div className="relative">
                            <Input
                              type="password"
                              value={configAvanzada.apiKey}
                              onChange={(e) => setConfigAvanzada({ ...configAvanzada, apiKey: e.target.value })}
                              placeholder="Tu API Key"
                              icon={<Key size={16} />}
                            />
                            <Button size="sm" className="absolute right-1 top-1" variant="outlined">
                              Generar
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Integración Contable
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Sincronizar con sistema contable externo
                            </Typography>
                          </div>
                          <Switch
                            checked={configAvanzada.integracionContable}
                            onChange={() =>
                              setConfigAvanzada({
                                ...configAvanzada,
                                integracionContable: !configAvanzada.integracionContable,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Sincronización Automática
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Sincronizar datos automáticamente cada hora
                            </Typography>
                          </div>
                          <Switch
                            checked={configAvanzada.sincronizacionAutomatica}
                            onChange={() =>
                              setConfigAvanzada({
                                ...configAvanzada,
                                sincronizacionAutomatica: !configAvanzada.sincronizacionAutomatica,
                              })
                            }
                          />
                        </div>
                        <Alert color="red">
                          <Typography className="text-sm">
                            ⚠️ Las configuraciones avanzadas pueden afectar el funcionamiento del sistema. Modifica solo
                            si sabes lo que estás haciendo.
                          </Typography>
                        </Alert>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Botones de Acción */}
                  <div className="lg:col-span-2 flex justify-end gap-3">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("avanzado")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("avanzado")}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}

export default ConfiguracionesDashboard
