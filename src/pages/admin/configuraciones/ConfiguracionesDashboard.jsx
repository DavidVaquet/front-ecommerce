import { useCallback, useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  Typography,
  Dialog,
  IconButton,
  DialogBody,
  DialogHeader,
  DialogFooter,
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
  Select,
  Option,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Settings,
  Building2,
  Package,
  ShoppingCart,
  Users,
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
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getSettingsCompany,
  patchSettingsCompany,
  patchSettingsInventory,
  patchSettingsVentas,
} from "../../../services/settingServices";
import { useNotificacion } from "../../../hooks/useNotificacion";
import { useUserSystem } from "../../../hooks/useUsuariosSistema";
import { useUserSystemMutation } from "../../../hooks/useUserSystemMutation";

const ConfiguracionesDashboard = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showPassord, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
    activo: true,
    apellido: "",
  });
  const [formUser, setFormUser] = useState({
    nombre: "",
    apellido: "",
    rol: "",
    activo: "",
  });

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileRef = useRef(null);
  const MySwal = withReactContent(Swal);
  const limitUser = 5;
  const limite = limitUser;
  const offset = (currentPage - 1) * limite;
  const topRef = useRef(null);

  // QUERY usuarios
  const { data, isFetching, isLoading } = useUserSystem({
    excludeRole: "cliente",
    limite,
    offset,
  });
  const usuarios = data?.users?.items ?? [];

  // MUTATIONS
  const { registerUsuario, eliminarUsuario, editarUsuario } =
    useUserSystemMutation();

  // PAGINACIÓN
  const total = data?.users?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limite));
  const start = total === 0 ? 0 : (currentPage - 1) * limite + 1;
  const end = Math.min(currentPage * limite, total);
  const showEmpty = !isLoading && total === 0;
  function goToPage(newPage, setCurrent, ref, max) {
    const safe = Math.max(1, Math.min(newPage, max));
    setCurrent(safe);
    requestAnimationFrame(() => {
      if (ref?.current) {
        let parent = ref.current.parentElement;
        while (parent) {
          const oy = getComputedStyle(parent).overflowY;
          if (oy === "auto" || oy === "scroll") parent.scrollTo({ top: 0, behavior: "smooth" });
          parent = parent.parentElement;
        }
        const y = ref.current.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  }

  const { componenteAlerta, mostrarNotificacion } = useNotificacion();

  const handleOpen = () => setOpen(!open);
  const handleOpenEdit = () => setOpenEdit(!openEdit);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const comp = await getSettingsCompany();
        setConfigGeneral(comp);
        setConfigInventario({
          stockMinimo: comp.default_min_stock ?? 0,
          alertaBajoStock: comp.low_stock_alert ?? false,
          alertaSinStock: comp.out_of_stock_alert ?? false,
          mostrarCostos: comp.show_costs ?? false,
          permitirStockNegativo: comp.allow_negative_stock ?? false,
          categoriaDefecto: comp.default_category_id ?? null,
        });
        setConfigVentas({
          iva: comp.iva_default,
          descuentoMaximo: comp.max_discount,
          metodoPagoDefecto: comp.payment_method_default,
          fx_rate_usd_ars: comp.fx_rate_usd_ar,
          proximoNumeroFactura: 1001,
          facturacionAutomatica: true,
          numeracionAutomatica: true,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchCompany();
  }, []);

  // ====== Estados de configuración
  const [configGeneral, setConfigGeneral] = useState({
    org_id: "",
    name: "",
    direction: "",
    telefono: "",
    email_empresa: "",
    website: "",
    tax_id: "",
    logo_url: "",
    logoFile: null,
    monedaPrincipal: "",
    timezone: "",
    date_format: "",
  });

  const [preview, setPreview] = useState(configGeneral.logo_url || "");
  const onPick = () => fileRef.current?.click();
  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ["image/png", "image/jpeg"];
    if (!allowed.includes(f.type)) {
      mostrarNotificacion("error", "Formato no soportado. Usá PNG o JPG.");
      e.target.value = "";
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      mostrarNotificacion("error", "El archivo supera 2MB.");
      e.target.value = "";
      return;
    }
    setConfigGeneral((p) => ({ ...p, logoFile: f }));
    setPreview(URL.createObjectURL(f));
  };

  const guardarConfigGeneral = async (orgId) => {
    const { logo_url, ...payload } = configGeneral;
    try {
      const config = await patchSettingsCompany(orgId, payload);
      if (config) {
        mostrarNotificacion("success", "Configuración general guardada");
        setConfigGeneral((prev) => ({ ...prev, ...config.data }));
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion("error", error.message);
    }
  };

  const [configInventario, setConfigInventario] = useState({
    stockMinimo: 0,
    alertaBajoStock: true,
    alertaSinStock: true,
    actualizacionAutomatica: true,
    mostrarCostos: true,
    categoriaDefecto: "general",
  });

  const guardarConfigInventario = async (orgId) => {
    try {
      const config = await patchSettingsInventory(orgId, { ...configInventario });
      if (config) {
        mostrarNotificacion("success", "Configuración del inventario guardada");
        setConfigInventario((prev) => ({ ...prev, ...config.data }));
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion("error", error.message);
    }
  };

  const [configVentas, setConfigVentas] = useState({
    iva: 0,
    descuentoMaximo: 0,
    facturacionAutomatica: true,
    numeracionAutomatica: true,
    proximoNumeroFactura: 1001,
    metodoPagoDefecto: "efectivo",
    fx_rate_usd_ars: 0,
  });

  const guardarConfigVentas = async (orgId) => {
    try {
      const config = await patchSettingsVentas(orgId, { ...configVentas });
      if (config) {
        mostrarNotificacion("success", "Configuración de ventas guardada");
        setConfigInventario((prev) => ({ ...prev, ...config.data }));
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion("error", error.message);
    }
  };

  const [configAvanzada, setConfigAvanzada] = useState({
    modoDebug: false,
    logLevel: "info",
    cacheEnabled: true,
    apiRateLimit: 1000,
    webhookUrl: "",
    apiKey: "",
    integracionContable: false,
    sincronizacionAutomatica: false,
  });

  const tabsData = [
    { label: "General", value: "general", icon: Building2 },
    { label: "Inventario", value: "inventario", icon: Package },
    { label: "Ventas", value: "ventas", icon: ShoppingCart },
    { label: "Usuarios", value: "usuarios", icon: Users },
    { label: "Avanzado", value: "avanzado", icon: Settings },
  ];

  const resetearConfiguracion = (seccion) =>
    mostrarNotificacion("success", `Configuración de ${seccion} restablecida`);

  const guardarConfiguracion = (seccion) =>
    mostrarNotificacion("success", `Configuración de ${seccion} guardada exitosamente`);

  const validarFormularioUser = () => {
    const nombre = user.nombre.trim();
    if (!nombre) return mostrarNotificacion("error", "Debes ingresar un nombre");
    const password = user.password.trim();
    if (!password) return mostrarNotificacion("error", "La contraseña es obligatoria");
    if (password.length < 6) return mostrarNotificacion("error", "Mínimo 6 caracteres");
    const email = user.email.trim();
    if (!email) return mostrarNotificacion("error", "Ingresá un correo electrónico");
    if (!user.rol) return mostrarNotificacion("error", "Debes seleccionar un rol");
    const apellido = user.apellido.trim();
    if (!apellido) return mostrarNotificacion("error", "Debes ingresar un apellido");
    return true;
  };

  const validarFormularioUserEdit = () => {
    const nombre = (formUser.nombre ?? "").trim();
    if (!nombre) return mostrarNotificacion("error", "Debes ingresar un nombre");
    if (!formUser.rol) return mostrarNotificacion("error", "Debes seleccionar un rol");
    const apellido = (formUser.apellido ?? "").trim();
    if (!apellido) return mostrarNotificacion("error", "Debes ingresar un apellido");
    if (!formUser.activo) return mostrarNotificacion("error", "Debes seleccionar un estado");
    return true;
  };

  const resetFields = () =>
    setUser({ nombre: "", password: "", email: "", rol: "", apellido: "" });

  const resetFieldUserEdit = () =>
    setFormUser({ nombre: "", apellido: "", rol: "", activo: "" });

  const registrarUsuario = async () => {
    try {
      if (!validarFormularioUser()) return;
      const usuario = await registerUsuario.mutateAsync(user);
      if (usuario?.ok) {
        mostrarNotificacion("success", "Usuario registrado con éxito");
        setOpen(false);
        resetFields();
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion("error", error.message || "Error al crear el usuario");
    }
  };

  const colorChipUser = (rol) => {
    switch (rol) {
      case "admin":
        return "purple";
      case "vendedor":
        return "green";
      case "supervisor":
        return "blue";
      default:
        return "yellow";
    }
  };

  const comenzarEdicion = (u) => {
    if (!u) return;
    setUsuarioSeleccionado(u);
    setFormUser({
      nombre: u?.nombre,
      apellido: u?.apellido,
      rol: u?.rol,
      activo: u?.activo == null ? "" : u.activo ? "activo" : "inactivo",
    });
    setOpenEdit(true);
  };

  const guardarEdicionUser = async () => {
    try {
      if (!validarFormularioUserEdit()) return;
      const payload = {
        id: usuarioSeleccionado.id,
        nombre: formUser.nombre,
        apellido: formUser.apellido,
        rol: formUser.rol,
        activo: formUser.activo,
      };
      const usuarioEdit = await editarUsuario.mutateAsync(payload);
      if (usuarioEdit?.ok) {
        mostrarNotificacion("success", "Usuario modificado éxitosamente");
        resetFieldUserEdit();
        setUsuarioSeleccionado(null);
        setOpenEdit(false);
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion("error", error.message || "No se pudo modificar");
    }
  };

  const handleDelete = async (u) => {
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
        const id = Number(u?.id);
        await eliminarUsuario.mutateAsync(id);
        if (eliminarUsuario?.ok) {
          mostrarNotificacion("success", "Usuario eliminado correctamente.");
        }
      } catch (error) {
        console.error(error);
        mostrarNotificacion("error", error.message || "No se pudo eliminar");
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {componenteAlerta}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <Typography variant="h4" color="blue-gray" className="text-lg lg:text-2xl mb-2 uppercase">
            Configuraciones del Sistema
          </Typography>
          <Typography color="gray" className="text-sm lg:text-lg">
            Gestiona todas las configuraciones de tu dashboard administrativo
          </Typography>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 flex-col sm:flex-row">
          <Button
            size="sm"
            variant="outlined"
            onClick={() => mostrarNotificacion("success", "Configuración importada exitosamente")}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Upload size={16} />
            Importar configuración
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="shadow-sm">
        <CardBody className="p-0">
          <Tabs value={activeTab} onChange={setActiveTab}>
            {/* Mobile: scroll horizontal; Desktop: normal */}
            <TabsHeader className="bg-gray-50 !p-0 overflow-x-auto lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-2 w-max lg:w-full lg:justify-start">
                {tabsData.map(({ label, value, icon: Icon }) => (
                  <Tab key={value} value={value} className="px-3 lg:px-4">
                    <span className="flex items-center gap-2 text-sm lg:text-lg">
                      <Icon className="w-5 h-5 lg:w-4 lg:h-4" />
                      {label}
                    </span>
                  </Tab>
                ))}
              </div>
            </TabsHeader>

            <TabsBody className="p-6">
              {/* GENERAL */}
              <TabPanel value="general" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Empresa */}
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Building2 size={20} />
                        <Typography variant="h6" color="blue-gray" className="uppercase">
                          Información de la Empresa
                        </Typography>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Nombre de la Empresa
                          </Typography>
                          <Input
                            value={configGeneral.name}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, name: e.target.value })}
                            icon={<Building2 size={16} />}
                          />
                        </div>

                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Dirección
                          </Typography>
                          <Input
                            value={configGeneral.direction}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, direction: e.target.value })}
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
                              value={configGeneral.email_empresa}
                              onChange={(e) => setConfigGeneral({ ...configGeneral, email_empresa: e.target.value })}
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
                              value={configGeneral.website}
                              onChange={(e) => setConfigGeneral({ ...configGeneral, website: e.target.value })}
                              icon={<Globe size={16} />}
                            />
                          </div>

                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                              CUIT/RUT
                            </Typography>
                            <Input
                              value={configGeneral.tax_id}
                              onChange={(e) => setConfigGeneral({ ...configGeneral, tax_id: e.target.value })}
                              icon={<FileText size={16} />}
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Regionales */}
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Globe size={20} />
                        <Typography variant="h6" color="blue-gray" className="uppercase">
                          Configuraciones Regionales
                        </Typography>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Zona Horaria
                          </Typography>
                          <select
                            value={configGeneral.timezone}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, timezone: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                          </select>
                        </div>

                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Formato de Fecha
                          </Typography>
                          <select
                            value={configGeneral.date_format}
                            onChange={(e) => setConfigGeneral({ ...configGeneral, date_format: e.target.value })}
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

                          <div className="flex items-center gap-4 mb-3">
                            <div className="h-24 w-28 lg:h-36 lg:w-44 border rounded flex items-center justify-center overflow-hidden bg-white">
                              {preview ? (
                                <img src={configGeneral.logo_url} alt="Logo" className="h-full w-full object-contain" />
                              ) : (
                                <span className="text-xs text-gray-500 px-2 text-center">Sin logo</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outlined"
                                className="flex items-center gap-2"
                                onClick={onPick}
                              >
                                <Upload size={16} />
                                Subir Logo
                              </Button>
                              <Typography color="gray" className="text-sm">
                                Formato: PNG, JPG (máx. 2MB)
                              </Typography>

                              <input
                                type="file"
                                ref={fileRef}
                                accept="image/png, image/jpeg"
                                className="hidden"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Acciones */}
                  <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("general")}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfigGeneral(configGeneral.org_id)}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* INVENTARIO */}
              <TabPanel value="inventario" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
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
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Settings size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Configuraciones de Productos
                        </Typography>
                      </div>

                      <div className="space-y-4">
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

                  <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("inventario")}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfigInventario(configGeneral.org_id)}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* VENTAS */}
              <TabPanel value="ventas" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
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
                              setConfigVentas({
                                ...configVentas,
                                descuentoMaximo: Number.parseFloat(e.target.value),
                              })
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
                            onChange={(e) =>
                              setConfigVentas({ ...configVentas, metodoPagoDefecto: e.target.value })
                            }
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
                            Tipo de cambio dólar (ARS)
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.fx_rate_usd_ars}
                            onChange={(e) =>
                              setConfigVentas({ ...configVentas, fx_rate_usd_ars: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
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
                      </div>
                    </CardBody>
                  </Card>

                  <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("ventas")}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfigVentas(configGeneral.org_id)}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </TabPanel>
                  {/* ——— USUARIOS (solo este TabPanel) ——— */}
<TabPanel value="usuarios" className="p-0">
  <span ref={topRef}></span>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* ——— Lista de usuarios ——— */}
    <Card className="shadow-sm">
  <CardBody>
    {/* header */}
    <div className="lg:flex lg:flex-row flex-col items-center justify-between mb-4">
      <div className="flex items-center gap-2 mb-2 lg:mb-0">
        <Users size={18} />
        <Typography variant="h6" color="blue-gray" className="uppercase whitespace-nowrap">
          Usuarios del sistema
        </Typography>
      </div>

      {/* botón crea usuario */}
      <div className="flex">
      <Button
        size="sm"
        color="blue"
        className="flex items-center gap-2 w-full text-center justify-center"
        onClick={handleOpen}
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Nuevo usuario</span>
        <span className="sm:hidden">Nuevo</span>
      </Button>

      </div>
    </div>

    {/* lista */}
    <div className="divide-y divide-gray-200">
      {usuarios.map((u) => (
        <div
          key={u.id}
          className="
            py-4
            flex flex-col gap-3
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          {/* bloque izquierda: avatar + datos */}
          <div className="flex items-start gap-3 lg:min-w-0">
            <div className="shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-semibold">
                {u.nombre?.[0]?.toUpperCase() ?? "U"}
              </div>
            </div>

            <div className="min-w-0">
              {/* nombre */}
              <Typography
                color="blue-gray"
                className="font-medium leading-tight truncate max-w-[240px] sm:max-w-none"
              >
                {u.nombre}
              </Typography>

              {/* chips */}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Chip value={u.rol?.toUpperCase()} color={colorChipUser(u.rol)} size="sm" />
                <Chip value={u.activo ? "ACTIVO" : "INACTIVO"} color={u.activo ? "green" : "red"} size="sm" />
              </div>

              {/* email */}
              <Typography color="gray" className="text-sm mt-1 truncate max-w-[260px] sm:max-w-full">
                {u.email}
              </Typography>
            </div>
          </div>

          {/* acciones */}
          <div
            className="
              flex items-stretch gap-2
              lg:items-center
              lg:gap-3
              lg:shrink-0
            "
          >
            {/* en mobile botones full width, uno bajo el otro */}
            <div className="flex w-full gap-2 lg:w-auto">
              <Button
                size="sm"
                variant="outlined"
                className="flex-1 lg:flex-none min-w-[110px]"
                onClick={() => comenzarEdicion(u)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Edit3 size={14} />
                  Editar
                </div>
              </Button>

              <Button
                size="sm"
                variant="outlined"
                className="flex-1 lg:flex-none min-w-[110px]"
                onClick={() => handleDelete(u)}
              >
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <Trash2 size={14} />
                  <span className="text-red-600">Eliminar</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* paginación */}
    {!showEmpty ? (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Mostrando {start} a {end} de {total} usuarios del sistema
        </Typography>

        <div className="flex gap-2 self-end sm:self-auto">
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
      <div className="flex flex-col items-center justify-center py-10">
        <Users className="h-12 w-12 text-gray-400 mb-3" />
        <Typography variant="h6" color="blue-gray">
          No se encontraron usuarios
        </Typography>
        <Typography variant="small" color="gray" className="mt-1">
          Agregá nuevos usuarios con rol diferente a “cliente”.
        </Typography>
      </div>
    )}
  </CardBody>
</Card>


    {/* ——— Roles y Permisos ——— */}
    <Card className="shadow-sm">
      <CardBody>
        <div className="flex items-center gap-2 mb-6">
          <Shield size={20} />
          <Typography variant="h6" color="blue-gray">
            Roles y Permisos
          </Typography>
        </div>

        <div className="space-y-4">
          {/* Admin */}
          <div className="rounded-lg border border-gray-200 p-4 bg-white">
            <Typography color="blue-gray" className="font-medium mb-3">
              Administrador
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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

          {/* Vendedor */}
          <div className="rounded-lg border border-gray-200 p-4 bg-white">
            <Typography color="blue-gray" className="font-medium mb-3">
              Vendedor
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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

          {/* Supervisor */}
          <div className="rounded-lg border border-gray-200 p-4 bg-white">
            <Typography color="blue-gray" className="font-medium mb-3">
              Supervisor
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
                <Typography color="gray">Config. limitadas</Typography>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>

    {/* Botones inferiores */}
    <div className="lg:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
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





              {/* AVANZADO */}
              <TabPanel value="avanzado" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
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

                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
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

                  <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      variant="outlined"
                      color="red"
                      onClick={() => resetearConfiguracion("avanzado")}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfiguracion("avanzado")}
                      className="flex items-center gap-2 w-full sm:w-auto"
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

      {/* MODAL: Nuevo usuario */}
      <Dialog size="sm" open={open} handler={handleOpen} className="p-3 sm:p-4">
        <DialogHeader className="relative m-0 block">
          <Typography color="blue-gray" className="text-lg font-semibold lg:text-2xl uppercase">
            Registrar nuevo usuario
          </Typography>
          <Typography className="mt-1 font-normal lg:text-base text-sm text-gray-600">
            Complete el formulario para agregar un nuevo usuario al sistema.
          </Typography>
          <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={handleOpen}>
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div className="flex gap-4">
            <div className="w-full">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Nombre:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Luis"
                value={user.nombre}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) => setUser((prev) => ({ ...prev, nombre: e.target.value }))}
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div className="w-full">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Apellido:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Cardozo"
                value={user.apellido}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) => setUser((prev) => ({ ...prev, apellido: e.target.value }))}
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
          </div>

          <div className="relative">
            <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
              Contraseña:
            </Typography>
            <Input
              color="gray"
              size="lg"
              type={showPassord ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={user.password}
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
              containerProps={{ className: "!min-w-full" }}
              labelProps={{ className: "hidden" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-1 top-7 my-auto grid h-9 w-9 place-items-center rounded-md focus:outline-none"
            >
              {showPassord ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex gap-3 lg:gap-4 w-full">
            <div className="w-1/2 min-w-0">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Email:
              </Typography>
              <Input
                color="gray"
                size="auto"
                placeholder="ejemplo@gmail.com"
                type="email"
                value={user.email}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                containerProps={{ className: "min-w-0 w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div className="w-1/2 min-w-0">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Rol
              </Typography>
              <Select 
              value={user.rol} 
              onChange={(v) => setUser((prev) => ({ ...prev, rol: v ?? "" }))}
              containerProps={{ className: "min-w-0 w-full" }}
              menuProps={{ className: "min-w-0 w-full max-w-full" }}
              >
                <Option value="admin">Admin</Option>
                <Option value="supervisor">Supervisor</Option>
                <Option value="vendedor">Vendedor</Option>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" color="blue" onClick={RegistrarUsuario}>
            CREAR USUARIO
          </Button>
        </DialogFooter>
      </Dialog>

      {/* MODAL: Editar usuario */}
      <Dialog size="sm" open={openEdit} handler={handleOpenEdit} className="p-3 sm:p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray" className="uppercase">
            Editar usuario
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Complete el formulario para editar un usuario del sistema.
          </Typography>
          <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={() => setOpenEdit(false)}>
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div className="flex gap-4">
            <div className="w-full">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Nombre:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Luis"
                value={formUser.nombre}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) => setFormUser((prev) => ({ ...prev, nombre: e.target.value }))}
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div className="w-full min-w-0">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Apellido:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Cardozo"
                value={formUser.apellido}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) => setFormUser((prev) => ({ ...prev, apellido: e.target.value }))}
                containerProps={{ className: "!min-w-full" }}
                labelProps={{ className: "hidden" }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full min-w-0">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Estado
              </Typography>
              <Select
                value={formUser.activo ?? ""}
                onChange={(value) => setFormUser((prev) => ({ ...prev, activo: value }))}
                containerProps={{ className: "min-w-0 w-full" }}
                menuProps={{ className: "min-w-0 w-full max-w-full" }}
              >
                <Option value="activo">Activo</Option>
                <Option value="inactivo">Inactivo</Option>
              </Select>
            </div>
            <div className="w-full min-w-0">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                Rol
              </Typography>
              <Select 
              value={formUser.rol} 
              onChange={(v) => setFormUser((prev) => ({ ...prev, rol: v ?? "" }))}
              containerProps={{ className: "min-w-0 w-full" }}
              menuProps={{ className: "min-w-0 w-full max-w-full" }}
              >
        
                <Option value="admin">Admin</Option>
                <Option value="supervisor">Supervisor</Option>
                <Option value="vendedor">Vendedor</Option>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" color="blue" onClick={guardarEdicionUser}>
            GUARDAR CAMBIOS
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );

  function RegistrarUsuario() {
    registrarUsuario();
  }
};

export default ConfiguracionesDashboard;
