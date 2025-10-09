"use client"
import { useNavigate } from "react-router-dom"
import { bajaCliente, editarClienteService } from "../../../services/clienteServices"
import { useNotificacion } from "../../../hooks/useNotificacion.jsx"
import { useCallback, useEffect, useMemo, useState } from "react"
import { formatearFecha, formatearFechaHora } from "../../../helpers/formatoFecha.js"
import { provinciasConCiudades } from "../../../helpers/provinciasCiudades.js"
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
  Tabs,
  TabsHeader,
  Textarea,
  Tab,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Progress,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react"
import {
  Search,
  Filter,
  Eye,
  Edit,
  UserPlus,
  Users,
  Star,
  Globe,
  Store,
  Mail,
  Phone,
  MoreVertical,
  Download,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Activity,
  List,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  User,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { enviarEmailText } from "../../../helpers/enviarEmail.js"
import { useClienteEstadisticas, useClientesCompras } from "../../../hooks/useClientes.jsx"
import { useDebouncedValue } from "../../../hooks/useDebouncedValue.jsx"
import { useClienteMutation } from "../../../hooks/useClientesMutation.jsx"
import ClientesRow from "../../../components/Clientes/ClientesRow.jsx"

const getChipColor = (estado) => {
  if (estado === true) return "green"
  if (estado === false) return "red"
  return "blue-gray"
}

export const Clientes = () => {
  // Estados
  const [activeTab, setActiveTab] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [openDetalles, setOpenDetalles] = useState(false)
  const [openEditar, setOpenEditar] = useState(false)
  const [openEmail, setOpenEmail] = useState(false)
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("")
  const [asuntoEmail, setAsuntoEmail] = useState("")
  const [mensajeEmail, setMensajeEmail] = useState("")
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("")
  const [formularioEditar, setFormularioEditar] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    tipo_cliente: "regular",
    direccion: "",
    provincia: "",
    ciudad: "",
    pais: "",
    codigo_postal: "",
    notas: "",
    es_vip: false,
  })


  // Notificaciones
  const { componenteAlerta, mostrarNotificacion } = useNotificacion();
  // Modales
  const handleOpen = useCallback(() => {
  setOpenDetalles(prev => !prev);
  }, []);
  const handleOpenEditar = useCallback(() => setOpenEditar(prev => !prev), []);
  const openEmailFor = useCallback((usuario) => {
  setClienteSeleccionado(usuario);
  setOpenEmail(true);
}, []);
const toggleEmail = useCallback(() => {
  setOpenEmail(prev => !prev);
}, []);
  const navigate = useNavigate()
  const clientesPerPage = 25;


  // USECLIENTE MUTATION PARA MODIFICAR
  const { editarCliente, suspenderCliente } = useClienteMutation();

  // TRAER DESDE REACT QUERY LOS CLIENTES
  const limite = clientesPerPage;
  const offset = (currentPage - 1) * clientesPerPage;
  const searchDebounced = useDebouncedValue(busqueda, 500);
  const filtro = useMemo(() => {
    const f = {};
     f.limite = limite;
     f.offset = offset;
    if (searchDebounced) f.search = searchDebounced;
    if (activeTab != 'todos') f.origen = activeTab;
    if (filtroEstado != '') f.activo = filtroEstado;
    if (filtroTipo != '') f.tipo_cliente = filtroTipo;
    return f;
  }, [limite, offset, searchDebounced, activeTab, filtroEstado, filtroTipo])
  const { data, isLoading } = useClientesCompras(filtro);
  const clientes = useMemo(() => data?.items ?? [], [data]);
  

  // TRAER DESDE REACT QUERY LAS ESTADISTICAS DE CLIENTES
  const filtroCategoria = useMemo(() => ({
    scope: 'gestion'
  }), [])
  const { data: dataEst } = useClienteEstadisticas(filtroCategoria);

  // RESETEAR PÁGINA CUANDO CAMBIEN LOS FILTROS
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, busqueda, filtroTipo, filtroEstado]);

  // PAGINACION
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limite));
  const start = total === 0 ? 0 : (currentPage - 1) * limite + 1;
  const end = Math.min(currentPage * limite, total);
  const showEmpty = !isLoading && total === 0;
  

  const detalleClientes = useCallback((cliente) => {
    setClienteSeleccionado(cliente)
    handleOpen()
  }, [handleOpen]);

  const cambiarEstado = useCallback( async (cliente) => {
    try {
      const nuevoEstado = !cliente.estado
      const payload = {
        id: cliente.id,
        email: cliente.email,
        estado: nuevoEstado,
      }
      const client = await suspenderCliente.mutateAsync(payload);
      if (cliente.estado) {
        mostrarNotificacion("success", "Cliente suspendido con éxito")
      } else {
        mostrarNotificacion("success", "Cliente reactivado con éxito")
      }
      return client;
    } catch (error) {
      console.error(error)
      mostrarNotificacion('error', error.message || 'Error al cambiar el estado del cliente');
    }
  }, [suspenderCliente, mostrarNotificacion])

  const comenzarEdicion = useCallback((cliente) => {
    const provinciaEncontrada = Object.keys(provinciasConCiudades).find((prov) =>
      provinciasConCiudades[prov].includes(cliente.ciudad),
    )
    setProvinciaSeleccionada(provinciaEncontrada || "")
    setCiudadSeleccionada(cliente.ciudad)
    setFormularioEditar({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      tipo_cliente: cliente.tipo_cliente,
      direccion: cliente.direccion,
      provincia: cliente.provincia,
      ciudad: provinciasConCiudades[provinciaEncontrada]?.includes(cliente.ciudad) ? cliente.ciudad : "",
      pais: cliente.pais,
      codigo_postal: cliente.codigo_postal,
      notas: cliente.notas,
      es_vip: cliente.es_vip,
    })
    setClienteSeleccionado(cliente)
    setOpenEditar(true);
  }, [])

  const validarFormulario = () => {
    if (!formularioEditar.nombre.trim()) {
      mostrarNotificacion("error", "El nombre es obligatorio")
      return false
    }
    if (!formularioEditar.apellido.trim()) {
      mostrarNotificacion("error", "El apellido es obligatorio")
      return false
    }
    if (!formularioEditar.telefono.trim()) {
      mostrarNotificacion("error", "El telefono es obligatorio")
      return false
    }
    if (!formularioEditar.tipo_cliente.trim()) {
      mostrarNotificacion("error", "El tipo de cliente es obligatorio")
      return false
    }
    if (!formularioEditar.direccion.trim()) {
      mostrarNotificacion("error", "La dirección es obligatoria")
      return false
    }
    if (!formularioEditar.pais.trim()) {
      mostrarNotificacion("error", "El país es obligatorio")
      return false
    }
    if (!formularioEditar.ciudad.trim()) {
      mostrarNotificacion("error", "La ciudad es obligatoria")
      return false
    }
    if (!formularioEditar.codigo_postal.trim()) {
      mostrarNotificacion("error", "El código postal es obligatorio")
      return false
    }
    if (!formularioEditar.provincia) {
      mostrarNotificacion("error", "Debes seleccionar una provincia")
      return false
    }
    return true
  }

  const guardarEdicion = async () => {
    try {
      if (!validarFormulario()) return
      const payload = {
        id: clienteSeleccionado.id,
        ...formularioEditar,
      }

      const clienteNuevo = await editarCliente.mutateAsync(payload);
      mostrarNotificacion("success", "Cliente actualizado con éxito")
      handleOpenEditar();
      setFormularioEditar({
        nombre: "",
        apellido: "",
        telefono: "",
        tipo_cliente: "",
        direccion: "",
        ciudad: "",
        pais: "Argentina",
        codigo_postal: "",
        notas: "",
        es_vip: false,
      })
    } catch (error) {
      console.error(error)
      mostrarNotificacion("error", error.message || "Error al modificar el cliente")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormularioEditar((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormularioEditar((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCloseModal = () => {
    setOpenDetalles(false)
    setClienteSeleccionado(null)
  }

  const enviarMail = async(email, asunto, mensaje) => {
    if (!mensaje.trim()){
      mostrarNotificacion('error', 'Debes introducir un mensaje.');
      return;
    }
    try {
      const emailEnviado = await enviarEmailText({
        email: email,
        asunto: asunto,
        mensaje: mensaje
      });
      if (emailEnviado){
        mostrarNotificacion('success', 'Email envíado correctamente');
        setAsuntoEmail("");
        setMensajeEmail("");
        setClienteSeleccionado(null);
        setOpenEmail(false);
      } else{
        mostrarNotificacion('error', 'Error al envíar el email');
      }
    } catch (error) {
      console.error(error);
    }
  }


  // Estadísticas
  const totalUsuarios = dataEst?.total_usuarios ?? 0;
  const usuariosEcommerce = dataEst?.usuarios_ecommerce ?? 0;
  const usuariosManuales = dataEst?.usuarios_manuales ?? 0;
  const usuariosActivos = dataEst?.usuarios_activos ?? 0;
  const usuariosVip = dataEst?.usuarios_vip ?? 0;
  const porcEcommerce = dataEst?.porcentaje_ecommerce ?? 0;
  const porcUserActivo = dataEst?.porcentaje_user_activos ?? 0;

  // const totalGastado = estadisticasClientes.total_gastado;
  const promedioGasto = dataEst?.gasto_promedio ?? 0;




  return (
    <div className="text-black flex flex-col w-full py-6 px-8 font-worksans">
      {/* Header */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Clientes del Sistema</h1>
            <p className="text-gray-600 mt-1">
              Gestiona todos los clientes registrados tanto del e-commerce como agregados manualmente.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case" size="md">
              <Download className="h-5 w-5" />
              EXPORTAR LISTA
            </Button>
            <Button
              variant="filled"
              color="deep-orange"
              className="flex items-center gap-2 normal-case shadow-md"
              size="md"
              onClick={() => navigate("/admin/clientes/registrar-cliente")}
            >
              <UserPlus className="h-5 w-5" />
              NUEVO CLIENTE
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
                  Total Usuarios
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {totalUsuarios}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray">
                  Online: {usuariosEcommerce} | Manual: {usuariosManuales}
                </Typography>
              </div>
              <Progress value={porcEcommerce} color="blue" />
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Usuarios Activos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {usuariosActivos}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="green" className="font-medium">
                {porcUserActivo}% del total
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Usuarios VIP
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {usuariosVip}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <Typography variant="small" color="yellow" className="font-medium">
                Clientes premium
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Gasto Promedio
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  ${promedioGasto}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <Shield className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <Typography variant="small" color="deep-orange" className="font-medium">
                Por usuario registrado
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
                label="Buscar clientes"
                placeholder="Busca por nombre, apellido, email, telefono, ciudad"
                icon={<Search className="h-5 w-5" />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div>
              <Select label="Estado" value={filtroEstado} onChange={(value) => setFiltroEstado(value)}>
                <Option value="">Todos los estados</Option>
                <Option value="true">Activo</Option>
                <Option value="false">Inactivo</Option>
              </Select>
            </div>
            <div>
              <Select label="Tipo de Cliente" value={filtroTipo} onChange={(value) => setFiltroTipo(value)}>
                <Option value="">Todos los tipos</Option>
                <Option value="regular">Regular</Option>
                <Option value="mayorista">Mayorista</Option>
              </Select>
            </div>
            <div>
              <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case w-full">
                <Filter className="h-4 w-4" />
                Filtros Avanzados
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs y Lista de Usuarios */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab}>
          <TabsHeader className="p-2">
            <Tab value="todos" onClick={() => setActiveTab('todos')}>
              <div className="flex flex-row items-center justify-center gap-2">
                <List className="h-4 w-4" />
                <span>Todos ({totalUsuarios})</span>
              </div>
            </Tab>
            <Tab value="online" onClick={() => setActiveTab('online')}>
              <div className="flex flex-row items-center justify-center gap-2">
                <Globe className="h-4 w-4" />
                <span>E-commerce ({usuariosEcommerce})</span>
              </div>
            </Tab>
            <Tab value="manual" onClick={() => setActiveTab('manual')}>
              <div className="flex flex-row items-center justify-center gap-2">
                <Store className="h-4 w-4" />
                <span>Manual ({usuariosManuales})</span>
              </div>
            </Tab>
          </TabsHeader>

          <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Usuario
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Contacto
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Origen
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Estado
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Compras
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Última Actividad
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Acciones
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((usuarios) => (
                      <ClientesRow
                      key={usuarios.id}
                      usuario={usuarios}
                      onDetalle={detalleClientes}
                      onEdit={comenzarEdicion}
                      onToggleEstado={cambiarEstado}
                      onAbrirEmail={openEmailFor}
                       />
                    ))}
                  </tbody>
                </table>
              </div>
            {!showEmpty ? (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Mostrando {start} a {end} de {total} clientes
                </Typography>
                <div className="flex gap-2">
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPage === 1 || isLoading}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <User className="h-12 w-12 text-gray-400 mb-3" />
                <Typography variant="h6" color="blue-gray">
                  No se encontraron clientes
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Intenta con otra búsqueda o agrega nuevos clientes.
                </Typography>
              </div>
            )}
          </div>
        </Tabs>
      </Card>

      {/* Modal de Detalles del Cliente MEJORADO */}
      <Dialog open={openDetalles} handler={handleCloseModal} size="lg" className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-4xl">
          <DialogHeader className="flex items-center justify-between p-6 border-b border-gray-200">
            <Typography variant="h4" color="blue-gray">
              Detalles del Cliente
            </Typography>
            <IconButton variant="text" color="blue-gray" onClick={handleCloseModal}>
              <X className="h-5 w-5" />
            </IconButton>
          </DialogHeader>

          <DialogBody className="p-6">
            {clienteSeleccionado && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar y información básica */}
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <Avatar
                      src={`https://ui-avatars.com/api/background=0D8ABC&color=fff?name=${clienteSeleccionado.nombre}+${clienteSeleccionado.apellido}`}
                      alt={`${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`}
                      size="xxl"
                      className="border-4 border-gray-200 mb-4"
                    />
                    <Typography variant="h3" color="blue-gray" className="mb-2">
                      {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                    </Typography>
                    <div className="flex items-center gap-2 mb-4">
                      <Chip
                        value={clienteSeleccionado.estado === true ? "Activo" : "Inactivo"}
                        color={getChipColor(clienteSeleccionado.estado)}
                        size="lg"
                        variant="ghost"
                        className="rounded-full"
                      />
                      {clienteSeleccionado.vip && (
                        <Chip
                          value="VIP"
                          color="yellow"
                          size="lg"
                          variant="ghost"
                          className="rounded-full"
                          icon={<Crown className="h-4 w-4" />}
                        />
                      )}
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <Card className="p-4 bg-gray-50">
                    <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información de Contacto
                    </Typography>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="blue-gray">
                          {clienteSeleccionado.email}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="blue-gray">
                          {clienteSeleccionado.telefono}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="blue-gray">
                          {clienteSeleccionado.direccion}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="blue-gray">
                          {clienteSeleccionado.ciudad}, {clienteSeleccionado.provincia}, {clienteSeleccionado.pais}
                        </Typography>
                      </div>
                      {clienteSeleccionado.codigo_postal && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <Typography variant="small" color="blue-gray">
                            CP: {clienteSeleccionado.codigo_postal}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Estadísticas y actividad */}
                <div className="space-y-4">
                  {/* Cards de estadísticas */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="h-5 w-5 text-green-500" />
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Total Compras
                        </Typography>
                      </div>
                      <Typography variant="h4" color="green">
                        {clienteSeleccionado.cantidad_compras}
                      </Typography>
                    </Card>

                    <Card className="p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-blue-500" />
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Total Gastado
                        </Typography>
                      </div>
                      <Typography variant="h4" color="blue">
                        ${Number(clienteSeleccionado.total_gastado).toFixed(2)}
                      </Typography>
                    </Card>

                    <Card className="p-4 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-purple-500" />
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Tipo Cliente
                        </Typography>
                      </div>
                      <Typography variant="h6" color="purple" className="capitalize">
                        {clienteSeleccionado.tipo_cliente}
                      </Typography>
                    </Card>

                    <Card className="p-4 bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-orange-500" />
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Origen
                        </Typography>
                      </div>
                      <Typography variant="h6" color="orange" className="capitalize">
                        {clienteSeleccionado.origen === "ecommerce" ? "E-commerce" : "Manual"}
                      </Typography>
                    </Card>
                  </div>

                  {/* Información de fechas */}
                  <Card className="p-4 bg-gray-50">
                    <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Actividad Temporal
                    </Typography>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="gray">
                          <strong>Fecha de registro:</strong> {formatearFecha(clienteSeleccionado.fecha_creacion)}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="gray">
                          <strong>Última compra:</strong> {formatearFechaHora(clienteSeleccionado.fecha_ultima_compra)}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <Typography variant="small" color="gray">
                          <strong>ID del cliente:</strong> {clienteSeleccionado.id}
                        </Typography>
                      </div>
                    </div>
                  </Card>

                  {/* Notas si existen */}
                  {clienteSeleccionado.notas && (
                    <Card className="p-4 bg-yellow-50">
                      <Typography variant="h6" color="blue-gray" className="mb-2">
                        Notas
                      </Typography>
                      <Typography variant="small" color="gray">
                        {clienteSeleccionado.notas}
                      </Typography>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter className="flex gap-2 p-6 border-t border-gray-200">
            <Button variant="outlined" color="blue-gray" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button
              variant="filled"
              color="blue"
              className="flex items-center gap-2"
              onClick={() => {
                handleCloseModal()
                comenzarEdicion(clienteSeleccionado)
              }}
            >
              <Edit className="h-4 w-4" />
              Editar Cliente
            </Button>
          </DialogFooter>
        </Card>
      </Dialog>

      {/* Alerta - Notificaciones*/}
      {componenteAlerta}

      {/* Modal para editar un cliente */}
      <Dialog size="xl" open={openEditar} handler={handleOpenEditar} className="max-h-[90vh] w-full max-w-4xl p-4">
        {/* HEADER */}
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Editar Cliente
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Modificá los datos necesarios y guardá los cambios.
          </Typography>
          <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={handleOpenEditar}>
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
              <Input name="nombre" value={formularioEditar.nombre} onChange={handleChange} placeholder="ej. Victoria" />
            </div>

            {/* APELLIDO */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Apellido
              </Typography>
              <Input
                name="apellido"
                value={formularioEditar.apellido}
                onChange={handleChange}
                placeholder="ej. Martinez"
              />
            </div>

            {/* TELÉFONO */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Teléfono Celular
              </Typography>
              <Input
                name="telefono"
                value={formularioEditar.telefono}
                onChange={handleChange}
                placeholder="ej. 3834245477"
              />
            </div>

            {/* PAÍS */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                País
              </Typography>
              <Select value={formularioEditar.pais} onChange={(val) => handleSelectChange("pais", val)}>
                <Option value="Argentina">Argentina</Option>
              </Select>
            </div>

            {/* PROVINCIA */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Provincia
              </Typography>
              <Select
                value={provinciaSeleccionada}
                onChange={(val) => {
                  setProvinciaSeleccionada(val)
                  handleSelectChange("provincia", val)
                }}
              >
                {Object.keys(provinciasConCiudades).map((prov) => (
                  <Option key={prov} value={prov}>
                    {prov}
                  </Option>
                ))}
              </Select>
            </div>

            {/* CIUDAD */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Ciudad
              </Typography>
              {provinciaSeleccionada && (
                <Select
                key={provinciaSeleccionada}
                value={formularioEditar.ciudad} 
                onChange={(val) => handleSelectChange("ciudad", val)}>
                  {provinciasConCiudades[provinciaSeleccionada].map((ciudad) => (
                    <Option key={ciudad} value={ciudad}>
                      {ciudad}
                    </Option>
                  ))}
                </Select>
              )}
            </div>

            {/* DIRECCIÓN */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Dirección
              </Typography>
              <Input
                name="direccion"
                value={formularioEditar.direccion}
                onChange={handleChange}
                placeholder="ej. Av Illia 142"
              />
            </div>

            {/* TIPO DE CLIENTE */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Tipo de cliente
              </Typography>
              <Select value={formularioEditar.tipo_cliente} onChange={(val) => handleSelectChange("tipo_cliente", val)}>
                <Option value="regular">Regular</Option>
                <Option value="mayorista">Mayorista</Option>
              </Select>
            </div>

            {/* CÓDIGO POSTAL */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Código Postal
              </Typography>
              <Input
                name="codigo_postal"
                value={formularioEditar.codigo_postal}
                onChange={handleChange}
                placeholder="ej. 4700"
              />
            </div>

            {/* ¿ES VIP? */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                ¿Es VIP?
              </Typography>
              <Select
                value={formularioEditar.es_vip ? "true" : "false"}
                onChange={(val) => handleSelectChange("es_vip", val === "true")}
              >
                <Option value="true">Sí</Option>
                <Option value="false">No</Option>
              </Select>
            </div>

            {/* NOTAS (OCUPA DOS COLUMNAS) */}
            <div className="md:col-span-2">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Notas (opcional)
              </Typography>
              <Textarea
                name="notas"
                value={formularioEditar.notas}
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

      {/* MODAL PARA ENVIAR MENSAJES */}
      <Dialog open={openEmail} size="xs" handler={toggleEmail}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            {" "}
            <Typography className="mb-1 text-lg" color="gray">
              Nuevo mensaje para {clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpen}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>
          <Typography className="mb-4 -mt-7 font-normal" color="gray" variant="h6">
            Escribe el mensaje y luego haz clic en el botón.
          </Typography>
          <div className="grid gap-6">
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Asunto
            </Typography>
            <Input
            label="Asunto"
            value={asuntoEmail}
            onChange={(e) => setAsuntoEmail(e.target.value)} />
            <Textarea
            label="Mensaje"
            onChange={(e) => setMensajeEmail(e.target.value)} />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={toggleEmail}>
            Cancelar
          </Button>
          <Button variant="gradient" color="gray" onClick={()=> enviarMail(clienteSeleccionado?.email, asuntoEmail, mensajeEmail)}>
            Enviar mensaje
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
