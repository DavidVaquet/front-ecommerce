import { useCallback, useEffect, useState, useRef, useMemo } from "react";
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
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  getSettingsCompany,
  patchSettingsCompany,
  patchSettingsInventory,
  patchSettingsVentas,
} from "../../../services/settingServices";
import {
  obtenerUsers,
  register,
  editUser,
  eliminarUser,
} from "../../../services/authServices";
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
  const [triggerUsuarios, setTriggerUsuarios] = useState(0);
  const fileRef = useRef(null);
  const MySwal = withReactContent(Swal);
  const limitUser = 5;
  const limite = limitUser;
  const offset = (currentPage - 1) * limite;
  const topRef = useRef(null);


  // TRAER USUARIOS DESDE REACT QUERY
  const { data, isFetching, isLoading, isError, refetch} = useUserSystem({
    excludeRole: 'cliente',
    limite,
    offset
  });
  const usuarios = data?.users?.items ?? [];

  // MUTATION DE USUARIOS DEL SISTEMA
  const { registerUsuario, eliminarUsuario, editarUsuario } = useUserSystemMutation(); 

  // PAGINACION USUARIOS
  const total = data?.users?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limite));
  const start = total === 0 ? 0 : (currentPage - 1) * limite + 1;
  const end = Math.min(currentPage * limite, total);
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


  const { componenteAlerta, mostrarNotificacion } = useNotificacion();

  const handleOpen = () => setOpen(!open);
  const handleOpenEdit = () => setOpenEdit(!openEdit);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const comp = await getSettingsCompany();
        // console.log(comp);
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
      fx_rate_usd_ars: comp.fx_rate_usd_ar
      })
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompany();
  }, []);

  // Estados para la información de la empresa
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

  // PREVIEW PARA VER LA IMAGEN
  const [preview, setPreview] = useState(configGeneral.logo_url || "");
  // console.log(preview);
  // PICK DE LA IMAGEN Y ONCHANGE
  const onPick = () => fileRef.current?.click();

  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['image/png', 'image/jpeg'];
    if (!allowed.includes(f.type)) {
      mostrarNotificacion('error', 'Formato no soportado. Usá PNG o JPG.');
      e.target.value = '';
      return;
    }

    if (f.size > 2 * 1024 * 1024) {
      mostrarNotificacion('error', 'El archivo supera 5MB.');
      e.target.value = '';
      return;
    }
    
    setConfigGeneral(prev => ({...prev, logoFile: f}));
    setPreview(URL.createObjectURL(f));
  }

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


  const guardarConfigInventario = async (orgId) => {
    const { ...payload } = configInventario;
    try {
      const config = await patchSettingsInventory(orgId, payload);
      if (config) {
        mostrarNotificacion('success', 'Configuración del inventario guardada');
        setConfigInventario((prev) => ({ ...prev, ...config.data }));
      }
      
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message);
    }
    
  }
  const guardarConfigVentas = async (orgId) => {
    const { ...payload } = configVentas;
    try {
      const config = await patchSettingsVentas(orgId, payload);
      if (config) {
        mostrarNotificacion('success', 'Configuración de ventas guardada');
        setConfigInventario((prev) => ({ ...prev, ...config.data }));
      }
      
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message);
    }
    
  }

  const validarFormularioUser = () => {
    const nombre = user.nombre.trim();
    if (!nombre) {
      mostrarNotificacion("error", "Debes ingresar un nombre");
      return false;
    }
    const password = user.password.trim();
    if (!password) {
      mostrarNotificacion("error", "La contraseña es obligatoria");
      return false;
    }
    if (password < 6) {
      mostrarNotificacion(
        "error",
        "La contraseña debe tener al menos 6 caracteres"
      );
      return false;
    }
    const email = user.email.trim();
    if (!email) {
      mostrarNotificacion("error", "Ingresá un correo electrónico");
      return false;
    }
    if (!user.rol) {
      mostrarNotificacion("error", "Debes seleccionar un rol");
      return false;
    }
    const apellido = user.apellido.trim();
    if (!apellido) {
      mostrarNotificacion("error", "Debes ingresar un apellido");
      return false;
    }
    return true;
  };
  const validarFormularioUserEdit = () => {
    const nombre = formUser.nombre.trim() ?? '';
    if (!nombre) {
      mostrarNotificacion("error", "Debes ingresar un nombre");
      return false;
    }

    if (!formUser.rol) {
      mostrarNotificacion("error", "Debes seleccionar un rol");
      return false;
    }

    const apellido = formUser.apellido.trim() ?? '';
    if (!apellido) {
      mostrarNotificacion("error", "Debes ingresar un apellido");
      return false;
    }

    if (!formUser.activo) {
      mostrarNotificacion("error", "Debes seleccionar un estado");
      return false;
    }

    return true;
  };

  const resetFields = () => {
    setUser({
      nombre: "",
      password: "",
      email: "",
      rol: "",
    });
  };

  const resetFieldUserEdit = () => {
    setFormUser({
      nombre: "",
      apellido: "",
      rol: "",
      activo: "",
    });
  };

  const registrarUsuario = async () => {
    try {
      if (!validarFormularioUser()) return false;
      const usuario = await registerUsuario.mutateAsync(user);

      if (usuario?.ok) {
        mostrarNotificacion("success", "Usuario registrado con éxito");
        setOpen((v) => !v);
        resetFields();
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion("error", error.message || "Ocurrió un error al crear el usuario");
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

  const comenzarEdicion = (usuario) => {
    if (!usuario) return;
    setUsuarioSeleccionado(usuario);
    setFormUser({
      nombre: usuario?.nombre,
      apellido: usuario?.apellido,
      rol: usuario?.rol,
      activo:
        usuario?.activo == null ? "" : usuario.activo ? "activo" : "inactivo",
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
        setUsuarioSeleccionado(null)
        setOpenEdit(false);

      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion(
        "error",
        error.message || "Ocurrió un error al modificar el usuario"
      );
    }
  };

  const handleDelete = async (usuario) => {
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
        const id = Number(usuario?.id);
        await eliminarUsuario.mutateAsync(id);
        if (eliminarUsuario?.ok) {
          mostrarNotificacion("success", "Usuario eliminado correctamente.");
          return true;
                  }
      } catch (error) {
        console.error(error);
        mostrarNotificacion("error", error.message || "No se pudo eliminar");
      }
    });
  };

  const [configInventario, setConfigInventario] = useState({
    stockMinimo: 0,
    alertaBajoStock: true,
    alertaSinStock: true,
    actualizacionAutomatica: true,
    mostrarCostos: true,
    categoriaDefecto: "general",
  });

  // console.log(configInventario);
  const [configVentas, setConfigVentas] = useState({
    iva: 0,
    descuentoMaximo: 0,
    facturacionAutomatica: true,
    numeracionAutomatica: true,
    proximoNumeroFactura: 1001,
    metodoPagoDefecto: "efectivo",
    fx_rate_usd_ars: 0
  });

  // const [configNotificaciones, setConfigNotificaciones] = useState({
  //   emailVentas: true,
  //   emailInventario: true,
  //   emailReportes: true,
  //   pushNotifications: false,
  //   smsAlertas: false,
  //   frecuenciaReportes: "semanal",
  //   horaEnvioReportes: "09:00",
  // });

  const [configSeguridad, setConfigSeguridad] = useState({
    sesionExpira: 480, // minutos
    intentosLogin: 5,
    bloqueoTemporal: 30, // minutos
    requiere2FA: false,
    logActividad: true,
    backupAutomatico: true,
    frecuenciaBackup: "diario",
    retencionBackup: 30, // días
  });

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

  const guardarConfiguracion = (seccion) => {
    // Aquí iría la lógica para guardar en la base de datos
    console.log(`Guardando configuración de ${seccion}`);
    mostrarNotificacion(
      "success",
      `Configuración de ${seccion} guardada exitosamente`
    );
  };

  const resetearConfiguracion = (seccion) => {
    // Aquí iría la lógica para resetear a valores por defecto
    console.log(`Reseteando configuración de ${seccion}`);
    mostrarNotificacion("success", `Configuración de ${seccion} restablecida`);
  };

  const exportarConfiguracion = () => {
    // Aquí iría la lógica para exportar configuraciones
    const config = {
      general: configGeneral,
      inventario: configInventario,
      ventas: configVentas,
      seguridad: configSeguridad,
      avanzada: configAvanzada,
    };
    console.log("Exportando configuración:", config);
    mostrarNotificacion("success", "Configuración exportada exitosamente");
  };

  const importarConfiguracion = () => {
    // Aquí iría la lógica para importar configuraciones
    console.log("Importando configuración");
    mostrarNotificacion("success", "Configuración importada exitosamente");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Alerta flotante */}
      {componenteAlerta}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <Typography variant="h4" color="blue-gray" className="mb-2 uppercase">
            Configuraciones del Sistema
          </Typography>
          <Typography color="gray" className="text-lg">
            Gestiona todas las configuraciones de tu dashboard administrativo
          </Typography>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button
            size="sm"
            variant="outlined"
            onClick={importarConfiguracion}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            Importar configuración
          </Button>
          {/* <Button
            size="sm"
            variant="outlined"
            onClick={exportarConfiguracion}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Exportar
          </Button> */}
          {/* <Button size="sm" color="blue" className="flex items-center gap-2">
            <Save size={16} />
            Guardar Todo
          </Button> */}
        </div>
      </div>

      {/* Tabs */}
      <Card className="shadow-sm">
        <CardBody className="p-0">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsHeader className="bg-gray-50">
              {tabsData.map(({ label, value, icon: Icon }) => (
                <Tab key={value} value={value}>
                  <div className="flex items-center gap-2 text-lg">
                    <Icon size={16} />
                    {label}
                  </div>
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
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="uppercase"
                        >
                          Información de la Empresa
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Nombre de la Empresa
                          </Typography>
                          <Input
                            value={configGeneral.name}
                            onChange={(e) =>
                              setConfigGeneral({
                                ...configGeneral,
                                name: e.target.value,
                              })
                            }
                            icon={<Building2 size={16} />}
                          />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Dirección
                          </Typography>
                          <Input
                            value={configGeneral.direction}
                            onChange={(e) =>
                              setConfigGeneral({
                                ...configGeneral,
                                direction: e.target.value,
                              })
                            }
                            icon={<MapPin size={16} />}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Teléfono
                            </Typography>
                            <Input
                              value={configGeneral.telefono}
                              onChange={(e) =>
                                setConfigGeneral({
                                  ...configGeneral,
                                  telefono: e.target.value,
                                })
                              }
                              icon={<Phone size={16} />}
                            />
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Email
                            </Typography>
                            <Input
                              value={configGeneral.email_empresa}
                              onChange={(e) =>
                                setConfigGeneral({
                                  ...configGeneral,
                                  email_empresa: e.target.value,
                                })
                              }
                              icon={<Mail size={16} />}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Sitio Web
                            </Typography>
                            <Input
                              value={configGeneral.website}
                              onChange={(e) =>
                                setConfigGeneral({
                                  ...configGeneral,
                                  website: e.target.value,
                                })
                              }
                              icon={<Globe size={16} />}
                            />
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              CUIT/RUT
                            </Typography>
                            <Input
                              value={configGeneral.tax_id}
                              onChange={(e) =>
                                setConfigGeneral({
                                  ...configGeneral,
                                  tax_id: e.target.value,
                                })
                              }
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
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="uppercase"
                        >
                          Configuraciones Regionales
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        {/* <div>
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
                        </div>  */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Zona Horaria
                          </Typography>
                          <select
                            value={configGeneral.timezone}
                            onChange={(e) =>
                              setConfigGeneral({
                                ...configGeneral,
                                timezone: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="America/Argentina/Buenos_Aires">
                              Buenos Aires (GMT-3)
                            </option>
                          </select>
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Formato de Fecha
                          </Typography>
                          <select
                            value={configGeneral.date_format}
                            onChange={(e) =>
                              setConfigGeneral({
                                ...configGeneral,
                                date_format: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Logo de la Empresa
                          </Typography>
                          {/* Preview actual o seleccionado */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="h-36 w-44 border rounded flex items-center justify-center overflow-hidden bg-white">
                            {preview ? (
                              <img src={configGeneral.logo_url} alt="Logo" className="h-full w-full" />
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
                            onChange={onChange} />
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
                      onClick={() => resetearConfiguracion("general")}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Restablecer
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => guardarConfigGeneral(configGeneral.org_id)}
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
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Stock Mínimo por Defecto
                          </Typography>
                          <Input
                            type="number"
                            value={configInventario.stockMinimo}
                            onChange={(e) =>
                              setConfigInventario({
                                ...configInventario,
                                stockMinimo: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
                              Alerta de Bajo Stock
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Notificar cuando el stock esté por debajo del
                              mínimo
                            </Typography>
                          </div>
                          <Switch
                            checked={configInventario.alertaBajoStock}
                            onChange={() =>
                              setConfigInventario({
                                ...configInventario,
                                alertaBajoStock:
                                  !configInventario.alertaBajoStock,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                                alertaSinStock:
                                  !configInventario.alertaSinStock,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                                actualizacionAutomatica:
                                  !configInventario.actualizacionAutomatica,
                              })
                            }
                          />
                        </div>
                        {/* <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                                permitirStockNegativo:
                                  !configInventario.permitirStockNegativo,
                              })
                            }
                          />
                        </div> */}
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
                        {/* <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Unidad de Medida por Defecto
                          </Typography>
                          <select
                            value={configInventario.unidadMedidaDefecto}
                            onChange={(e) =>
                              setConfigInventario({
                                ...configInventario,
                                unidadMedidaDefecto: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="unidad">Unidad</option>
                            <option value="kg">Kilogramo</option>
                            <option value="litro">Litro</option>
                            <option value="metro">Metro</option>
                            <option value="caja">Caja</option>
                          </select>
                        </div> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Categoría por Defecto
                          </Typography>
                          <select
                            value={configInventario.categoriaDefecto}
                            onChange={(e) =>
                              setConfigInventario({
                                ...configInventario,
                                categoriaDefecto: e.target.value,
                              })
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
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                      onClick={() => guardarConfigInventario(configGeneral.org_id)}
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
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            IVA por Defecto (%)
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.iva}
                            onChange={(e) =>
                              setConfigVentas({
                                ...configVentas,
                                iva: Number.parseFloat(e.target.value),
                              })
                            }
                            icon={<Percent size={16} />}
                          />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Descuento Máximo (%)
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.descuentoMaximo}
                            onChange={(e) =>
                              setConfigVentas({
                                ...configVentas,
                                descuentoMaximo: Number.parseFloat(
                                  e.target.value
                                ),
                              })
                            }
                            icon={<Percent size={16} />}
                          />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Método de Pago por Defecto
                          </Typography>
                          <select
                            value={configVentas.metodoPagoDefecto}
                            onChange={(e) =>
                              setConfigVentas({
                                ...configVentas,
                                metodoPagoDefecto: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta_debito">
                              Tarjeta de Débito
                            </option>
                            <option value="tarjeta_credito">
                              Tarjeta de Crédito
                            </option>
                            <option value="transferencia">Transferencia</option>
                          </select>
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Tipo de cambio dólar (ARS)
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.fx_rate_usd_ars}
                            onChange={(e) =>
                              setConfigVentas({
                                ...configVentas,
                                validezPresupuesto: Number.parseInt(
                                  e.target.value
                                ),
                              })
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
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Próximo Número de Factura
                          </Typography>
                          <Input
                            type="number"
                            value={configVentas.proximoNumeroFactura}
                            onChange={(e) =>
                              setConfigVentas({
                                ...configVentas,
                                proximoNumeroFactura: Number.parseInt(
                                  e.target.value
                                ),
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                                facturacionAutomatica:
                                  !configVentas.facturacionAutomatica,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                                numeracionAutomatica:
                                  !configVentas.numeracionAutomatica,
                              })
                            }
                          />
                        </div>
                        {/* <div className="flex justify-between items-center">
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
                        </div> */}
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
                      onClick={() => guardarConfigVentas(configGeneral.org_id)}
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
                <span ref={topRef}></span>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gestión de Usuarios */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Users size={20} />
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="uppercase"
                          >
                            Usuarios del Sistema
                          </Typography>
                        </div>
                        <Button
                          size="sm"
                          color="blue"
                          className="flex items-center gap-2"
                          onClick={handleOpen}
                        >
                          <Plus size={16} />
                          Nuevo Usuario
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {/* Lista de usuarios simulada */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          {usuarios.map((u) => (
                            <div
                              key={u.id}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users size={16} className="text-blue-600" />
                                </div>
                                <div>
                                  <Typography
                                    color="blue-gray"
                                    className="font-medium"
                                  >
                                    {u.nombre}
                                  </Typography>
                                  <Typography color="gray" className="text-sm">
                                    {u.email}
                                  </Typography>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Chip
                                  value={u.rol}
                                  color={colorChipUser(u.rol)}
                                  size="sm"
                                />
                                <Button
                                  size="sm"
                                  variant="outlined"
                                  className="p-2"
                                  onClick={() => comenzarEdicion(u)}
                                >
                                  <Edit3 size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outlined"
                                  className="p-2"
                                  onClick={() => handleDelete(u)}
                                >
                                  <Trash2 color="red" size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          {!showEmpty ? (
                        <div className="flex items-center justify-between p-4 border-t border-gray-200">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            Mostrando {start} a {end} de {total} usuarios del sistema
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
                          <Users className="h-12 w-12 text-gray-400 mb-3" />
                          <Typography variant="h6" color="blue-gray">
                            No se encontraron usuarios
                          </Typography>
                          <Typography variant="small" color="gray" className="mt-1">
                            Intenta agregando nuevos usuarios con rol diferente a 'cliente'.
                          </Typography>
                        </div>
                      )}
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
                          <Typography
                            color="blue-gray"
                            className="font-medium mb-3"
                          >
                            Administrador
                          </Typography>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">
                                Gestión completa
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">
                                Configuraciones
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">Reportes</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">Usuarios</Typography>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <Typography
                            color="blue-gray"
                            className="font-medium mb-3"
                          >
                            Vendedor
                          </Typography>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">Ventas</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">Clientes</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle
                                size={14}
                                className="text-red-600"
                              />
                              <Typography color="gray">
                                Inventario (solo lectura)
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle
                                size={14}
                                className="text-red-600"
                              />
                              <Typography color="gray">
                                Reportes limitados
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <Typography
                            color="blue-gray"
                            className="font-medium mb-3"
                          >
                            Supervisor
                          </Typography>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">Ventas</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">Inventario</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <Typography color="gray">Reportes</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle
                                size={14}
                                className="text-red-600"
                              />
                              <Typography color="gray">
                                Configuraciones limitadas
                              </Typography>
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
              {/* <TabPanel value="notificaciones" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
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
                  </Card> */}

              {/* <Card className="shadow-sm">
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
              </TabPanel> */}

              {/* Pestaña Seguridad */}
              {/* <TabPanel value="seguridad" className="p-0"> */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  </Card> */}

              {/* Configuraciones de Backup */}
              {/* <Card className="shadow-sm">
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
              {/* <div className="lg:col-span-2 flex justify-end gap-3">
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
                </div> */}
              {/* </TabPanel>  */}

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
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
                              Modo Debug
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Activar logs detallados para desarrollo
                            </Typography>
                          </div>
                          <Switch
                            checked={configAvanzada.modoDebug}
                            onChange={() =>
                              setConfigAvanzada({
                                ...configAvanzada,
                                modoDebug: !configAvanzada.modoDebug,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Nivel de Logs
                          </Typography>
                          <select
                            value={configAvanzada.logLevel}
                            onChange={(e) =>
                              setConfigAvanzada({
                                ...configAvanzada,
                                logLevel: e.target.value,
                              })
                            }
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
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
                              Cache Habilitado
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Usar cache para mejorar el rendimiento
                            </Typography>
                          </div>
                          <Switch
                            checked={configAvanzada.cacheEnabled}
                            onChange={() =>
                              setConfigAvanzada({
                                ...configAvanzada,
                                cacheEnabled: !configAvanzada.cacheEnabled,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Límite de Rate API (req/hora)
                          </Typography>
                          <Input
                            type="number"
                            value={configAvanzada.apiRateLimit}
                            onChange={(e) =>
                              setConfigAvanzada({
                                ...configAvanzada,
                                apiRateLimit: Number.parseInt(e.target.value),
                              })
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
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Webhook URL
                          </Typography>
                          <Input
                            value={configAvanzada.webhookUrl}
                            onChange={(e) =>
                              setConfigAvanzada({
                                ...configAvanzada,
                                webhookUrl: e.target.value,
                              })
                            }
                            placeholder="https://tu-webhook.com/endpoint"
                            icon={<Webhook size={16} />}
                          />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            API Key
                          </Typography>
                          <div className="relative">
                            <Input
                              type="password"
                              value={configAvanzada.apiKey}
                              onChange={(e) =>
                                setConfigAvanzada({
                                  ...configAvanzada,
                                  apiKey: e.target.value,
                                })
                              }
                              placeholder="Tu API Key"
                              icon={<Key size={16} />}
                            />
                            <Button
                              size="sm"
                              className="absolute right-1 top-1"
                              variant="outlined"
                            >
                              Generar
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                                integracionContable:
                                  !configAvanzada.integracionContable,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                                sincronizacionAutomatica:
                                  !configAvanzada.sincronizacionAutomatica,
                              })
                            }
                          />
                        </div>
                        <Alert color="red">
                          <Typography className="text-sm">
                            ⚠️ Las configuraciones avanzadas pueden afectar el
                            funcionamiento del sistema. Modifica solo si sabes
                            lo que estás haciendo.
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

      {/* MODAL PARA CREAR UN USUARIO */}
      <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray" className="uppercase">
            Registrar nuevo usuario
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Complete el formulario para agregar un nuevo usuario al sistema.
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
          <div className="flex gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Nombre:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Luis"
                name="name"
                value={user.nombre}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, nombre: e.target.value }))
                }
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Apellido:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Cardozo"
                name="name"
                value={user.apellido}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, apellido: e.target.value }))
                }
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Contraseña:
              </Typography>
              <Input
                color="gray"
                size="lg"
                type={showPassord ? "text" : "password"}
                placeholder="Minímo 6 caracteres"
                name="password"
                value={user.password}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, password: e.target.value }))
                }
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-1 top-7 my-auto grid h-9 w-9 place-items-center rounded-md  focus:outline-none"
              >
                {showPassord ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Email:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="ejemplo@gmail.com"
                name="email"
                type="email"
                value={user.email}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, email: e.target.value }))
                }
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Rol
              </Typography>
              <Select
                value={user.rol}
                onChange={(value) =>
                  setUser((prev) => ({ ...prev, rol: value ?? "" }))
                }
              >
                <Option value="" disabled>
                  Seleccioná un rol
                </Option>
                <Option value="admin">Administrador</Option>
                <Option value="supervisor">Supervisor</Option>
                <Option value="vendedor">Vendedor</Option>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" color="blue" onClick={registrarUsuario}>
            CREAR USUARIO
          </Button>
        </DialogFooter>
      </Dialog>
      {/* MODAL PARA EDITAR UN USUARIO */}
      <Dialog
        size="sm"
        open={openEdit}
        handler={handleOpenEdit}
        className="p-4"
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray" className="uppercase">
            Editar usuario
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Complete el formulario para editar un usuario del sistema.
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={() => setOpenEdit(false)}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div className="flex gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Nombre:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Luis"
                name="name"
                value={formUser.nombre}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) =>
                  setFormUser((prev) => ({ ...prev, nombre: e.target.value }))
                }
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Apellido:
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="Ej: Cardozo"
                name="name"
                value={formUser.apellido}
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                onChange={(e) =>
                  setFormUser((prev) => ({ ...prev, apellido: e.target.value }))
                }
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Estado
              </Typography>
              <Select
                value={formUser.activo ?? ""}
                onChange={(value) =>
                  setFormUser((prev) => ({
                    ...prev,
                    activo: value,
                  }))
                }
              >
                <Option value="" disabled>Seleccioná un estado:</Option>
                <Option value="activo">Activo</Option>
                <Option value="inactivo">Inactivo</Option>
              </Select>
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Rol
              </Typography>
              <Select
                value={formUser.rol}
                onChange={(value) =>
                  setFormUser((prev) => ({ ...prev, rol: value ?? "" }))
                }
              >
                <Option value="" disabled>
                  Seleccioná un rol
                </Option>
                <Option value="admin">Administrador</Option>
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
};

export default ConfiguracionesDashboard;
