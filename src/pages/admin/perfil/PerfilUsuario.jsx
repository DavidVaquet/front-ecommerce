import React, { useContext, useEffect, useState } from "react";
import { logout } from "../../../helpers/logout";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Switch,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Avatar,
  Chip,
  Progress,
  Alert,
} from "@material-tailwind/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  Edit3,
  Activity,
  Clock,
  Smartphone,
  Monitor,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  getUserInfo,
  editUserInfo,
  updatePasswordUser,
  getSessions,
  closeSession,
  recentActivity,
  statsUsage,
} from "../../../services/authServices";
import { fechaHora, formatearFechaHora } from "../../../helpers/formatoFecha";
import { useNotificacion } from "../../../hooks/useNotificacion";
const PerfilUsuario = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [stats, setStats] = useState([]);
  const [password, setPassword] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Fetch para traer los usuarios
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo();
      // console.log(user);
      setUserData(user);
    };
    fetchUser();
  }, []);

  // Fetch para traer las sesiones
  useEffect(() => {
    const fetchSessiones = async () => {
      const session = await getSessions();
      // console.log(session);
      setSessions(session.sessions);
    }
    fetchSessiones();
  }, [])

  // Fetch para traer las actividades recientes
  useEffect(() => {
    const fetchActividad = async () => {
      const actividad = await recentActivity({limite: 5});
      // console.log(actividad);
      setActividadReciente(actividad);
    }
    fetchActividad();
  }, [])
  useEffect(() => {
    const fetchEstadisticas = async () => {
      const statss = await statsUsage();
      // console.log(statss);
      setStats(statss);
      
    }
    fetchEstadisticas();
  }, [])
  

  // ALERTA HOOK
  const { componenteAlerta, mostrarNotificacion } = useNotificacion();

  const handleCloseSession = async (id) => {
    try {
      const close = await closeSession(id);
      if (close) {
        mostrarNotificacion('success', 'Sesión cerrada correctamente.');
        setSessions(prev => prev.filter(s => s.id !== id));
        logout(navigate, setUser);
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message);
    }
  }

  const tabsData = [
    { label: "Perfil", value: "perfil", icon: User },
    { label: "Seguridad", value: "seguridad", icon: Shield },
    { label: "Actividad", value: "actividad", icon: Activity },
  ];
  

  const validarFormulario = () => {
    if (!userData.nombre) {
      mostrarNotificacion("error", "Por favor ingresa el nombre.");
      return;
    }
    if (!userData.apellido) {
      mostrarNotificacion("error", "Por favor ingresa el apellido.");
      return;
    }
    if (!userData.telefono) {
      mostrarNotificacion("error", "Por favor ingresa un número de teléfono.");
      return;
    }
    if (!userData.direccion) {
      mostrarNotificacion("error", "Por favor ingresa la dirección.");
      return;
    }
    return true;
  };

  const validarPassword = () => {
    const tieneLetraYNumero =
      /[A-Za-z]/.test(nuevaPassword) && /\d/.test(nuevaPassword);

    if (!password) {
      mostrarNotificacion("error", "Por favor ingresa la contraseña.");
      return false;
    }
    if (!nuevaPassword) {
      mostrarNotificacion("error", "Por favor ingresa la nueva contraseña.");
      return false;
    }
    if (!confirmarPassword) {
      mostrarNotificacion(
        "error",
        "Por favor ingresa la contraseña de confirmación."
      );
      return false;
    }

    if (nuevaPassword.trim() !== confirmarPassword.trim()) {
      mostrarNotificacion("error", "Las contraseñas no coinciden.");
      return;
    }

    if (nuevaPassword.trim().length < 8) {
      mostrarNotificacion(
        "error",
        "La contraseña debe tener más de 8 caracteres."
      );
      return false;
    }

    if (/\s/.test(nuevaPassword)) {
      mostrarNotificacion("error", "La contraseña no puede contener espacios.");
      return false;
    }

    if (!tieneLetraYNumero) {
      mostrarNotificacion("error", "Usa al menos una letra y un número.");
      return false;
    }

    return true;
  };

  const limpiarInputsPassword = () => {
       setPassword("");
       setConfirmarPassword("");
       setNuevaPassword("");
       return true;
    
  }

  const handleSaveProfile = async () => {
    try {
      if (!validarFormulario()) return;
      const nuevoUser = await editUserInfo({
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        direccion: userData.direccion,
      });
      if (nuevoUser) {
        setUserData((prev) => ({ ...prev, ...nuevoUser }));
        mostrarNotificacion("success", "Datos actualizados correctamente.");
        setEditMode(false);
      } else {
        mostrarNotificacion("error", "No se pudo actualizar el perfil.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSavePassword = async () => {
    if (!validarPassword) return;

    try {
      const pass = await updatePasswordUser({ password, nuevaPassword });
      if (pass) {
        mostrarNotificacion("success", "Contraseña actualizada con éxito.");
        limpiarInputsPassword();
        return true;
      } 
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message);
    }
  };

  const handleNotificationChange = (key) => {
    setNotificaciones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* COMPONENTE PARA LA ALERTA */}
      {componenteAlerta}
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h4" color="blue-gray" className="mb-2 uppercase">
          Mi Perfil
        </Typography>
        <Typography color="gray" className="text-lg">
          Gestiona tu información personal, configuraciones y seguridad
        </Typography>
      </div>

      {/* Tabs */}
      <Card className="shadow-sm border border-gray-200">
        <CardBody className="p-0">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsHeader className="bg-gray-100">
              {tabsData.map(({ label, value, icon: Icon }) => (
                <Tab key={value} value={value}>
                <span className="flex flex-row justify-center text-[18px] items-center gap-3">
                  <Icon className="w-6 h-6 mb-[2px]" />
                  {label}
                </span>
              </Tab>
              ))}
            </TabsHeader>

            <TabsBody className="p-6">
              {/* Pestaña Perfil */}
              <TabPanel value="perfil" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Información Personal */}
                  <div className="lg:col-span-2">
                    <Card className="shadow-sm">
                      <CardBody>
                        <div className="flex justify-between items-center mb-6">
                          <Typography variant="h6" color="blue-gray">
                            Información Personal
                          </Typography>
                          <Button
                            size="sm"
                            variant={editMode ? "filled" : "outlined"}
                            onClick={() =>
                              editMode ? handleSaveProfile() : setEditMode(true)
                            }
                            className="flex items-center gap-2"
                          >
                            {editMode ? (
                              <Save size={16} />
                            ) : (
                              <Edit3 size={16} />
                            )}
                            {editMode ? "Guardar" : "Editar"}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Nombre
                            </Typography>
                            <Input
                              value={userData.nombre}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  nombre: e.target.value,
                                })
                              }
                              disabled={!editMode}
                              color="gray"
                              icon={<User size={16} />}
                              className=" !bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white
                                        disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Apellido
                            </Typography>
                            <Input
                              value={userData.apellido}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  apellido: e.target.value,
                                })
                              }
                              disabled={!editMode}
                              color="gray"
                              icon={<User size={16} />}
                              className=" !bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white
                                        disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
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
                              value={userData.email}
                              disabled={!editMode}
                              color="gray"
                              readOnly
                              icon={<Mail size={16} />}
                              className=" !bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white
                                        disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Teléfono
                            </Typography>
                            <Input
                              value={userData.telefono}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  telefono: e.target.value,
                                })
                              }
                              disabled={!editMode}
                              color="gray"
                              icon={<Phone size={16} />}
                              className=" !bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white
                                        disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Dirección
                            </Typography>
                            <Input
                              value={userData.direccion}
                              color="gray"
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  direccion: e.target.value,
                                })
                              }
                              disabled={!editMode}
                              icon={<MapPin size={16} />}
                              className=" !bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white
                                        disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Avatar y Datos del Sistema */}
                  <div className="space-y-6">
                    {/* Avatar */}
                    <Card className="shadow-sm">
                      <CardBody className="text-center">
                        <div className="relative inline-block mb-4">
                          <Avatar
                            src={`https://ui-avatars.com/api/background=0D8ABC&color=fff?name=${userData.nombre}+${userData.apellido}`}
                            alt="Avatar"
                            size="xxl"
                            className="border-4 border-white shadow-lg"
                          />
                        </div>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="mb-1"
                        >
                          {userData.nombre} {userData.apellido}
                        </Typography>
                        <Typography color="gray" className="mb-3">
                          {userData.rol === "admin"
                            ? "Administrador"
                            : "Cliente"}
                        </Typography>
                        <Chip
                          value="Activo"
                          color="green"
                          className="w-fit mx-auto"
                        />
                      </CardBody>
                    </Card>

                    {/* Información del Sistema */}
                    <Card className="shadow-sm">
                      <CardBody>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="mb-4"
                        >
                          Información del Sistema
                        </Typography>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Typography color="gray" className="text-sm">
                              Cargo:
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="text-sm font-medium"
                            >
                              {userData.rol === "admin"
                                ? "Administrador"
                                : "Cliente"}
                            </Typography>
                          </div>
                          <div className="flex justify-between">
                            <Typography color="gray" className="text-sm">
                              Departamento:
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="text-sm font-medium"
                            >
                              Sistemas
                            </Typography>
                          </div>
                          <div className="flex justify-between">
                            <Typography color="gray" className="text-sm">
                              Fecha de Ingreso:
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="text-sm font-medium"
                            >
                              {formatearFechaHora(userData.fecha_creacion)}
                            </Typography>
                          </div>
                          <div className="flex justify-between">
                            <Typography color="gray" className="text-sm">
                              Último Acceso:
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="text-sm font-medium"
                            >
                              {fechaHora(userData.ultimo_ingreso)}
                            </Typography>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Configuración
              <TabPanel value="configuracion" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Notificaciones */}
              {/* <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Bell size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Notificaciones
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Notificaciones por Email
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Recibir notificaciones importantes por correo
                            </Typography>
                          </div>
                          <Switch
                            checked={notificaciones.email}
                            onChange={() => handleNotificationChange('email')}
                          />
                        </div>
                         <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Notificaciones Push
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Notificaciones en tiempo real en el navegador
                            </Typography>
                          </div>
                          <Switch
                            checked={notificaciones.push}
                            onChange={() => handleNotificationChange('push')}
                          />
                        </div> */}
              {/* <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              SMS
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Alertas críticas por mensaje de texto
                            </Typography>
                          </div>
                          <Switch
                            checked={notificaciones.sms}
                            onChange={() => handleNotificationChange('sms')}
                          />
                        </div> */}
              {/* <div className="flex justify-between items-center">
                          <div>
                            <Typography color="blue-gray" className="font-medium">
                              Reportes Automáticos
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              Recibir reportes programados por email
                            </Typography>
                          </div>
                          <Switch
                            checked={notificaciones.reportes}
                            onChange={() => handleNotificationChange('reportes')}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card> */}

              {/* Preferencias */}
              {/* <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Settings size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Preferencias
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography color="blue-gray" className="mb-2 font-medium">
                            Idioma
                          </Typography>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="pt">Português</option>
                          </select>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="mb-2 font-medium">
                            Zona Horaria
                          </Typography>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="america/argentina/buenos_aires">Buenos Aires (GMT-3)</option>
                            <option value="america/sao_paulo">São Paulo (GMT-3)</option>
                            <option value="america/new_york">New York (GMT-5)</option>
                          </select>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="mb-2 font-medium">
                            Tema
                          </Typography>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                            <option value="auto">Automático</option>
                          </select>
                        </div>
                        
                      </div>
                    </CardBody>
                  </Card> */}
              {/* </div>
              // </TabPanel> */}

              {/* Pestaña Seguridad */}
              <TabPanel value="seguridad" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cambiar Contraseña */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Lock size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Cambiar Contraseña
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Contraseña Actual
                          </Typography>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              onChange={(e) => setPassword(e.target.value)}
                              value={password}
                              placeholder="Ingresa tu contraseña actual"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Nueva Contraseña
                          </Typography>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              value={nuevaPassword}
                              onChange={(e) => setNuevaPassword(e.target.value)}
                              placeholder="Ingresa tu nueva contraseña"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                          >
                            Confirmar Nueva Contraseña
                          </Typography>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmarPassword}
                              onChange={(e) =>
                                setConfirmarPassword(e.target.value)
                              }
                              placeholder="Confirma tu nueva contraseña"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                        <Button
                          color="blue"
                          className="w-full"
                          onClick={() => handleSavePassword()}
                        >
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Autenticación de Dos Factores */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Shield size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Autenticación de Dos Factores
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <Alert
                          color="amber"
                          className="flex items-center gap-2"
                        >
                          <AlertTriangle size={16} />
                          <Typography className="text-sm">
                            La autenticación de dos factores está desactivada
                          </Typography>
                        </Alert>
                        <Typography color="gray" className="text-sm">
                          Agrega una capa extra de seguridad a tu cuenta
                          activando la autenticación de dos factores.
                        </Typography>
                        <Button
                          color="green"
                          variant="outlined"
                          className="w-full"
                        >
                          Activar 2FA
                        </Button>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Sesiones Activas */}
                  <Card className="shadow-sm lg:col-span-2">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Monitor size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Sesiones Activas
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        {sessions.map((sesion, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                {sesion.device_type.includes("Móvil") ? (
                                  <Smartphone
                                    size={20}
                                    className="text-blue-600"
                                  />
                                ) : (
                                  <Monitor
                                    size={20}
                                    className="text-blue-600"
                                  />
                                )}
                              </div>
                              <div>
                                <Typography
                                  color="blue-gray"
                                  className="font-medium"
                                >
                                  {sesion.dispositivo}
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                  {sesion.ubicacion} • {sesion.ip}
                                </Typography>
                                <Typography color="gray" className="text-xs">
                                  {sesion.ultimaActividad}
                                </Typography>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <Chip value="Actual" color="green" size="sm" />
                              )}
                              <Button size="sm" color="red" variant="outlined" onClick={() => handleCloseSession(sesion.id)}>
                                Cerrar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </TabPanel>

              {/* Pestaña Actividad */}
              <TabPanel value="actividad" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Estadísticas de Uso */}
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Activity size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Estadísticas de Uso
                        </Typography>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Typography color="gray" className="text-sm">
                              Sesiones esta semana
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="text-sm font-medium"
                            >
                              {stats?.sessions}
                            </Typography>
                          </div>
                          <Progress value={stats?.progress?.sessions} color="blue" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <Typography color="gray" className="text-sm">
                              Tiempo promedio
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="text-sm font-medium"
                            >
                              {stats?.avgHours}
                            </Typography>
                          </div>
                          <Progress value={stats?.progress?.time} color="green" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <Typography color="gray" className="text-sm">
                              Acciones realizadas
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="text-sm font-medium"
                            >
                              {stats.actions}
                            </Typography>
                          </div>
                          <Progress value={stats?.progress?.actions} color="purple" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Actividad Reciente */}
                  <Card className="shadow-sm lg:col-span-2">
                    <CardBody>
                      <div className="flex items-center gap-2 mb-6">
                        <Clock size={20} />
                        <Typography variant="h6" color="blue-gray">
                          Actividad Reciente
                        </Typography>
                      </div>
                      <div className="space-y-3">
                        {actividadReciente.map((actividad, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  actividad.estado === "Exitoso"
                                    ? "bg-green-50"
                                    : "bg-red-50"
                                }`}
                              >
                                {actividad.estado === "Exitoso" ? (
                                  <CheckCircle
                                    size={16}
                                    className="text-green-600"
                                  />
                                ) : (
                                  <XCircle size={16} className="text-red-600" />
                                )}
                              </div>
                              <div>
                                <Typography
                                  color="blue-gray"
                                  className="font-medium text-sm"
                                >
                                  {actividad.accion}
                                </Typography>
                                <Typography color="gray" className="text-xs">
                                  {formatearFechaHora(actividad.fecha)} • {actividad.dispositivo}
                                </Typography>
                              </div>
                            </div>
                            <Chip
                              value={actividad.estado}
                              color={
                                actividad.estado === "Exitoso" ? "green" : "red"
                              }
                              size="sm"
                            />
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default PerfilUsuario;
