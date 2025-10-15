import React, { useContext, useEffect, useMemo, useState } from "react";
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
  Spinner
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
  updatePasswordUser,
} from "../../../services/authServices";
import { fechaHora, formatearFechaHora } from "../../../helpers/formatoFecha";
import { useNotificacion } from "../../../hooks/useNotificacion";
import { usePerfilRecentActivity, usePerfilSessions, usePerfilStatsUsage, usePerfilUserInfo } from "../../../hooks/usePerfil";
import { usePerfilMutation } from "../../../hooks/usePerfilMutations";

const PerfilUsuario = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  });

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Fetchs
  const {data: userInfo} =  usePerfilUserInfo();
  const user = userInfo ?? [];
  const {data: session} =  usePerfilSessions();
  const sessions = session?.sessions ?? [];
  const filtrosActivity = useMemo(() => ({ limite: 5 }), []);
  const {data: userActivity} =  usePerfilRecentActivity(filtrosActivity);
  const actividadReciente = userActivity ?? [];
  const {data: userStats} =  usePerfilStatsUsage();
  const stats = userStats ?? [];

  // MUTATION
  const {editUser, cerrarSession} = usePerfilMutation();

  useEffect(() => {
    if (userInfo) {
      setUserData({
        nombre: userInfo?.nombre ?? '',
        apellido: userInfo?.apellido ?? '',
        telefono: userInfo?.telefono ?? '',
        direccion: userInfo?.direccion ?? '',
        email: userInfo?.email ?? '',
      });
    }
  }, [userInfo]);

  // ALERTA HOOK
  const { componenteAlerta, mostrarNotificacion } = useNotificacion();

  const handleCloseSession = async (id) => {
    try {
      const close = await cerrarSession.mutateAsync(id);
      if (close) {
        mostrarNotificacion('success', 'Sesión cerrada correctamente.');
        logout(navigate, setUser);
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message);
    }
  };

  const tabsData = [
    { label: "Perfil", value: "perfil", icon: User },
    { label: "Seguridad", value: "seguridad", icon: Shield },
    { label: "Actividad", value: "actividad", icon: Activity },
  ];

  const validarFormulario = () => {
    if (!userData.nombre) { mostrarNotificacion("error", "Por favor ingresa el nombre."); return; }
    if (!userData.apellido) { mostrarNotificacion("error", "Por favor ingresa el apellido."); return; }
    if (!userData.telefono) { mostrarNotificacion("error", "Por favor ingresa un número de teléfono."); return; }
    if (!userData.direccion) { mostrarNotificacion("error", "Por favor ingresa la dirección."); return; }
    return true;
  };

  const validarPassword = () => {
    const tieneLetraYNumero = /[A-Za-z]/.test(nuevaPassword) && /\d/.test(nuevaPassword);
    if (!password) { mostrarNotificacion("error", "Por favor ingresa la contraseña."); return false; }
    if (!nuevaPassword) { mostrarNotificacion("error", "Por favor ingresa la nueva contraseña."); return false; }
    if (!confirmarPassword) { mostrarNotificacion("error", "Por favor ingresa la contraseña de confirmación."); return false; }
    if (nuevaPassword.trim() !== confirmarPassword.trim()) { mostrarNotificacion("error", "Las contraseñas no coinciden."); return; }
    if (nuevaPassword.trim().length < 8) { mostrarNotificacion("error", "La contraseña debe tener más de 8 caracteres."); return false; }
    if (/\s/.test(nuevaPassword)) { mostrarNotificacion("error", "La contraseña no puede contener espacios."); return false; }
    if (!tieneLetraYNumero) { mostrarNotificacion("error", "Usa al menos una letra y un número."); return false; }
    return true;
  };

  const limpiarInputsPassword = () => {
    setPassword("");
    setConfirmarPassword("");
    setNuevaPassword("");
    return true;
  };

  const handleSaveProfile = async () => {
    try {
      if (!validarFormulario()) return;
      const payload = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        direccion: userData.direccion,
      };
      const nuevoUser = await editUser.mutateAsync(payload);
      if (nuevoUser) {
        mostrarNotificacion("success", "Datos actualizados correctamente.");
        setEditMode(false);
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', error.message || 'Error al actualizar el perfil.');
    }
  };

  const handleSavePassword = async () => {
    if (!validarPassword()) return;
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

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* ALERTA */}
      {componenteAlerta}

      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <Typography variant="h4" color="blue-gray" className="mb-1 lg:mb-2 uppercase text-xl lg:text-3xl">
          Mi Perfil
        </Typography>
        <Typography color="gray" className="text-sm lg:text-lg">
          Gestiona tu información personal, configuraciones y seguridad
        </Typography>
      </div>

      {/* Tabs */}
      <Card className="shadow-sm border border-gray-200">
        <CardBody className="p-0">
          <Tabs value={activeTab} onChange={setActiveTab}>
            {/* mobile: scroll horizontal si no entra */}
            <TabsHeader className="bg-gray-100 overflow-x-auto whitespace-nowrap">
              <div className="flex gap-2 w-max lg:w-full lg:justify-start">
                {tabsData.map(({ label, value, icon: Icon }) => (
                  <Tab key={value} value={value} className="px-3 lg:px-4">
                    <span className="flex flex-row justify-center items-center gap-2 text-sm lg:text-[18px]">
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 mb-[2px]" />
                      {label}
                    </span>
                  </Tab>
                ))}
              </div>
            </TabsHeader>

            <TabsBody className="p-4 lg:p-6">
              {/* Pestaña Perfil */}
              <TabPanel value="perfil" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                  {/* Información Personal */}
                  <div className="lg:col-span-2">
                    <Card className="shadow-sm">
                      <CardBody className="p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-6">
                          <Typography variant="h6" color="blue-gray" className="text-base lg:text-lg">
                            Información Personal
                          </Typography>
                          <Button
                            size="sm"
                            variant={editMode ? "filled" : "outlined"}
                            disabled={editMode && editUser.isPending}
                            onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                            className="flex items-center gap-2 w-full sm:w-auto"
                          >
                            {editMode ? (
                              <>
                                {editUser.isPending ? <Spinner className="h-4 w-4" /> : <Save size={16} />}
                                {editUser.isPending ? "Guardando..." : "Guardar"}
                              </>
                            ) : (
                              <>
                                <Edit3 size={16} />
                                Editar
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
                              Nombre
                            </Typography>
                            <Input
                              value={userData?.nombre}
                              onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
                              disabled={!editMode}
                              color="gray"
                              icon={<User size={16} />}
                              className="!bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
                              Apellido
                            </Typography>
                            <Input
                              value={userData?.apellido}
                              onChange={(e) => setUserData({ ...userData, apellido: e.target.value })}
                              disabled={!editMode}
                              color="gray"
                              icon={<User size={16} />}
                              className="!bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
                              Email
                            </Typography>
                            <Input
                              value={userData?.email}
                              disabled
                              readOnly
                              color="gray"
                              icon={<Mail size={16} />}
                              className="!bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
                              Teléfono
                            </Typography>
                            <Input
                              value={userData?.telefono}
                              onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
                              disabled={!editMode}
                              color="gray"
                              icon={<Phone size={16} />}
                              className="!bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
                              Dirección
                            </Typography>
                            <Input
                              value={userData?.direccion}
                              color="gray"
                              onChange={(e) => setUserData({ ...userData, direccion: e.target.value })}
                              disabled={!editMode}
                              icon={<MapPin size={16} />}
                              className="!bg-white !text-gray-900 !border-gray-300 focus:!ring-0 focus:!border-gray-300 focus:!bg-white disabled:!bg-gray-100 disabled:!text-gray-600 disabled:!border-gray-200"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Avatar y Datos del Sistema */}
                  <div className="space-y-4 lg:space-y-6">
                    {/* Avatar */}
                    <Card className="shadow-sm">
                      <CardBody className="p-4 lg:p-6 text-center">
                        <div className="relative inline-block mb-3 lg:mb-4">
                          <Avatar
                            src={`https://ui-avatars.com/api/background=0D8ABC&color=fff?name=${userData.nombre}+${userData.apellido}`}
                            alt="Avatar"
                            size="xl"
                            className="border-4 border-white shadow-lg lg:!w-[96px] lg:!h-[96px]"
                          />
                        </div>
                        <Typography variant="h6" color="blue-gray" className="mb-0.5 lg:mb-1 text-base lg:text-lg">
                          {userData.nombre} {userData.apellido}
                        </Typography>
                        <Typography color="gray" className="mb-2 lg:mb-3 text-sm lg:text-base">
                          {userData.rol === "admin" ? "Administrador" : "Cliente"}
                        </Typography>
                        <Chip value="Activo" color="green" className="w-fit mx-auto" />
                      </CardBody>
                    </Card>

                    {/* Información del Sistema */}
                    <Card className="shadow-sm">
                      <CardBody className="p-4 lg:p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-3 lg:mb-4 text-base lg:text-lg">
                          Información del Sistema
                        </Typography>
                        <div className="space-y-2.5 lg:space-y-3 text-sm">
                          <div className="flex justify-between gap-3">
                            <Typography color="gray">Cargo:</Typography>
                            <Typography color="blue-gray" className="font-medium">
                              {userData.rol === "admin" ? "Administrador" : "Cliente"}
                            </Typography>
                          </div>
                          <div className="flex justify-between gap-3">
                            <Typography color="gray">Departamento:</Typography>
                            <Typography color="blue-gray" className="font-medium">Sistemas</Typography>
                          </div>
                          <div className="flex justify-between gap-3">
                            <Typography color="gray">Fecha de Ingreso:</Typography>
                            <Typography color="blue-gray" className="font-medium">
                              {formatearFechaHora(userData?.fecha_creacion)}
                            </Typography>
                          </div>
                          <div className="flex justify-between gap-3">
                            <Typography color="gray">Último Acceso:</Typography>
                            <Typography color="blue-gray" className="font-medium">
                              {fechaHora(userData?.ultimo_ingreso)}
                            </Typography>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </TabPanel>

              {/* Pestaña Seguridad */}
              <TabPanel value="seguridad" className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Cambiar Contraseña */}
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-4 lg:mb-6">
                        <Lock size={20} />
                        <Typography variant="h6" color="blue-gray" className="text-base lg:text-lg">
                          Cambiar Contraseña
                        </Typography>
                      </div>
                      <div className="space-y-3 lg:space-y-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
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
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
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
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-1 lg:mb-2 font-medium">
                            Confirmar Nueva Contraseña
                          </Typography>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmarPassword}
                              onChange={(e) => setConfirmarPassword(e.target.value)}
                              placeholder="Confirma tu nueva contraseña"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <Button color="blue" className="w-full" onClick={handleSavePassword}>
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Autenticación de Dos Factores */}
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-4 lg:mb-6">
                        <Shield size={20} />
                        <Typography variant="h6" color="blue-gray" className="text-base lg:text-lg">
                          Autenticación de Dos Factores
                        </Typography>
                      </div>
                      <div className="space-y-3 lg:space-y-4">
                        <Alert color="amber" className="flex items-center gap-2">
                          <AlertTriangle size={16} />
                          <Typography className="text-sm">
                            La autenticación de dos factores está desactivada
                          </Typography>
                        </Alert>
                        <Typography color="gray" className="text-sm">
                          Agrega una capa extra de seguridad a tu cuenta activando la autenticación de dos factores.
                        </Typography>
                        <Button color="green" variant="outlined" className="w-full">
                          Activar 2FA
                        </Button>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Sesiones Activas */}
                  <Card className="shadow-sm lg:col-span-2">
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-4 lg:mb-6">
                        <Monitor size={20} />
                        <Typography variant="h6" color="blue-gray" className="text-base lg:text-lg">
                          Sesiones Activas
                        </Typography>
                      </div>
                      <div className="space-y-3 lg:space-y-4">
                        {sessions.map((sesion, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 lg:p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                {sesion.device_type.includes("Móvil") ? (
                                  <Smartphone size={20} className="text-blue-600" />
                                ) : (
                                  <Monitor size={20} className="text-blue-600" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Typography color="blue-gray" className="font-medium truncate">
                                  {sesion.dispositivo}
                                </Typography>
                                <Typography color="gray" className="text-xs sm:text-sm truncate">
                                  {sesion.ubicacion} • {sesion.ip}
                                </Typography>
                                <Typography color="gray" className="text-xs">
                                  {sesion.ultimaActividad}
                                </Typography>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {index === 0 && <Chip value="Actual" color="green" size="sm" />}
                              <Button
                                size="sm"
                                color="red"
                                variant="outlined"
                                onClick={() => handleCloseSession(sesion.id)}
                                disabled={cerrarSession.isPending}
                                className="w-full sm:w-auto"
                              >
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                  {/* Estadísticas de Uso */}
                  <Card className="shadow-sm">
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-4 lg:mb-6">
                        <Activity size={20} />
                        <Typography variant="h6" color="blue-gray" className="text-base lg:text-lg">
                          Estadísticas de Uso
                        </Typography>
                      </div>
                      <div className="space-y-3 lg:space-y-4">
                        <div>
                          <div className="flex justify-between mb-1.5 lg:mb-2">
                            <Typography color="gray" className="text-sm">
                              Sesiones esta semana
                            </Typography>
                            <Typography color="blue-gray" className="text-sm font-medium">
                              {stats?.sessions}
                            </Typography>
                          </div>
                          <Progress value={stats?.progress?.sessions} color="blue" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1.5 lg:mb-2">
                            <Typography color="gray" className="text-sm">
                              Tiempo promedio
                            </Typography>
                            <Typography color="blue-gray" className="text-sm font-medium">
                              {stats?.avgHours}
                            </Typography>
                          </div>
                          <Progress value={stats?.progress?.time} color="green" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1.5 lg:mb-2">
                            <Typography color="gray" className="text-sm">
                              Acciones realizadas
                            </Typography>
                            <Typography color="blue-gray" className="text-sm font-medium">
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
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex items-center gap-2 mb-4 lg:mb-6">
                        <Clock size={20} />
                        <Typography variant="h6" color="blue-gray" className="text-base lg:text-lg">
                          Actividad Reciente
                        </Typography>
                      </div>
                      <div className="space-y-2.5 lg:space-y-3">
                        {actividadReciente.map((actividad, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`p-2 rounded-lg ${
                                  actividad.estado === "Exitoso" ? "bg-green-50" : "bg-red-50"
                                }`}
                              >
                                {actividad.estado === "Exitoso" ? (
                                  <CheckCircle size={16} className="text-green-600" />
                                ) : (
                                  <XCircle size={16} className="text-red-600" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Typography color="blue-gray" className="font-medium text-sm truncate">
                                  {actividad.accion}
                                </Typography>
                                <Typography color="gray" className="text-xs truncate">
                                  {formatearFechaHora(actividad.fecha)} • {actividad.dispositivo}
                                </Typography>
                              </div>
                            </div>
                            <Chip
                              value={actividad.estado}
                              color={actividad.estado === "Exitoso" ? "green" : "red"}
                              size="sm"
                              className="shrink-0"
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
