"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardBody,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Progress,
} from "@material-tailwind/react"
import {
  PlusCircle,
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Datos de ejemplo
const PRODUCTOS = [
  {
    id: 1,
    nombre: "Zapatillas deportivas premium",
    imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
    precio: 89.99,
    categoria: "Calzado",
    stock: 45,
    estado: "Activo",
    ventas: 128,
  },
  {
    id: 2,
    nombre: "Camiseta de algodón orgánico",
    imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
    precio: 24.99,
    categoria: "Ropa",
    stock: 120,
    estado: "Activo",
    ventas: 89,
  },
  {
    id: 3,
    nombre: "Reloj inteligente Serie 5",
    imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
    precio: 199.99,
    categoria: "Electrónica",
    stock: 18,
    estado: "Activo",
    ventas: 67,
  },
  {
    id: 4,
    nombre: "Auriculares inalámbricos",
    imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
    precio: 129.99,
    categoria: "Electrónica",
    stock: 0,
    estado: "Sin stock",
    ventas: 203,
  },
  {
    id: 5,
    nombre: "Mochila resistente al agua",
    imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
    precio: 59.99,
    categoria: "Accesorios",
    stock: 35,
    estado: "Activo",
    ventas: 42,
  },
  {
    id: 6,
    nombre: "Botella térmica 500ml",
    imagen: "https://v0.dev/placeholder.svg?height=200&width=200",
    precio: 19.99,
    categoria: "Hogar",
    stock: 8,
    estado: "Bajo stock",
    ventas: 76,
  },
]

export const Productos = () => {

  const [activeTab, setActiveTab] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Estadísticas
  const totalProductos = PRODUCTOS.length
  const productosActivos = PRODUCTOS.filter((p) => p.estado === "Activo").length
  const productosSinStock = PRODUCTOS.filter((p) => p.estado === "Sin stock").length
  const productosBajoStock = PRODUCTOS.filter((p) => p.estado === "Bajo stock").length

  // Filtrar productos según la pestaña activa
  const filteredProducts = PRODUCTOS.filter((producto) => {
    if (activeTab === "todos") return true
    if (activeTab === "activos") return producto.estado === "Activo"
    if (activeTab === "sin-stock") return producto.estado === "Sin stock"
    if (activeTab === "bajo-stock") return producto.estado === "Bajo stock"
    return true
  }).filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginación
  const productsPerPage = 5
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  const getChipColor = (estado) => {
    switch (estado) {
      case "Activo":
        return "green"
      case "Sin stock":
        return "red"
      case "Bajo stock":
        return "amber"
      default:
        return "blue-gray"
    }
  }

  return (

    <div className="text-black flex flex-col w-full py-3 px-8 font-worksans">

      {/* Título y Botón */}
      <div className="flex w-full flex-col mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold uppercase tracking-tight">Gestión de Productos</h1>
            <p className="text-gray-600 mt-1">Controlá tus productos activos, precios y stock desde un solo lugar.</p>
          </div>
          <Button variant="gradient" color='deep-orange' className="flex items-center gap-2">
                <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
                >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
                </svg>
            NUEVO PRODUCTO
            </Button>
        </div>
      </div>

      {/* Cards informativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card Total Productos */}
        <Card className="shadow-sm border border-gray-200">
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
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
                <Package className="h-6 w-6 text-deep-orange-500" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <Typography variant="small" color="green" className="font-medium">
                +12% este mes
              </Typography>
            </div>
          </CardBody>
        </Card>

        {/* Card Productos Activos */}
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Productos Activos
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosActivos}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {Math.round((productosActivos / totalProductos) * 100)}% del total
                </Typography>
              </div>
              <Progress value={(productosActivos / totalProductos) * 100} color="green" />
            </div>
          </CardBody>
        </Card>

        {/* Card Sin Stock */}
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Sin Stock
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosSinStock}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {Math.round((productosSinStock / totalProductos) * 100)}% del total
                </Typography>
              </div>
              <Progress value={(productosSinStock / totalProductos) * 100} color="red" />
            </div>
          </CardBody>
        </Card>

        {/* Card Bajo Stock */}
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Bajo Stock
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {productosBajoStock}
                </Typography>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {Math.round((productosBajoStock / totalProductos) * 100)}% del total
                </Typography>
              </div>
              <Progress value={(productosBajoStock / totalProductos) * 100} color="amber" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8 shadow-sm border border-gray-200">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-72">
              <Input
                label="Buscar productos"
                icon={<Search className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Button variant="outlined" color="blue-gray" className="flex items-center gap-2 normal-case">
                    Ordenar por
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem>Nombre (A-Z)</MenuItem>
                  <MenuItem>Nombre (Z-A)</MenuItem>
                  <MenuItem>Precio (menor a mayor)</MenuItem>
                  <MenuItem>Precio (mayor a menor)</MenuItem>
                  <MenuItem>Stock (menor a mayor)</MenuItem>
                  <MenuItem>Stock (mayor a menor)</MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs y Tabla de Productos */}
      <Card className="shadow-sm border border-gray-200">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader className="p-2">
            <Tab value="todos" className="text-sm font-medium">
              Todos ({totalProductos})
            </Tab>
            <Tab value="activos" className="text-sm font-medium">
              Activos ({productosActivos})
            </Tab>
            <Tab value="sin-stock" className="text-sm font-medium">
              Sin Stock ({productosSinStock})
            </Tab>
            <Tab value="bajo-stock" className="text-sm font-medium">
              Bajo Stock ({productosBajoStock})
            </Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value={activeTab} className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Producto
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Categoría
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Precio
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Stock
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Estado
                        </Typography>
                      </th>
                      <th className="border-b border-gray-200 bg-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                          Ventas
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
                    {currentProducts.map((producto, index) => (
                      <tr key={producto.id} className="hover:bg-gray-50">
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={producto.imagen}
                              alt={producto.nombre}
                              size="md"
                              variant="rounded"
                              className="border border-gray-200 p-1"
                            />
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {producto.nombre}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Typography variant="small" color="blue-gray">
                            {producto.categoria}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            ${producto.precio.toFixed(2)}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Typography variant="small" color="blue-gray">
                            {producto.stock}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <Chip
                            value={producto.estado}
                            color={getChipColor(producto.estado)}
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                          />
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <Typography variant="small" color="blue-gray">
                              {producto.ventas}
                            </Typography>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="flex gap-2">
                            <IconButton variant="text" color="blue-gray" size="sm">
                              <Eye className="h-4 w-4" />
                            </IconButton>
                            <IconButton variant="text" color="blue" size="sm">
                              <Edit className="h-4 w-4" />
                            </IconButton>
                            <IconButton variant="text" color="red" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {filteredProducts.length > 0 ? (
                <div className="flex items-center justify-between p-4 border-t border-gray-200">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    Mostrando {(currentPage - 1) * productsPerPage + 1} a{" "}
                    {Math.min(currentPage * productsPerPage, filteredProducts.length)} de {filteredProducts.length}{" "}
                    productos
                  </Typography>
                  <div className="flex gap-2">
                    <IconButton
                      variant="outlined"
                      color="blue-gray"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      color="blue-gray"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <Package className="h-12 w-12 text-gray-400 mb-3" />
                  <Typography variant="h6" color="blue-gray">
                    No se encontraron productos
                  </Typography>
                  <Typography variant="small" color="gray" className="mt-1">
                    Intenta con otra búsqueda o agrega nuevos productos.
                  </Typography>
                </div>
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
    </div>
  )
}
