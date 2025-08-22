import React from "react";
import logo from "../assets/logoiclub.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { logout } from "../helpers/logout";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  MinusIcon
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  CircleStackIcon
} from "@heroicons/react/24/outline";

export function Sidebar() {
  const [open, setOpen] = React.useState(0);
  const [subOpen, setSubOpen] = React.useState(0);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Card className="min-h-screen w-full max-w-[20rem]  shadow-xl shadow-blue-gray-900/5 bg-white font-worksans">
      <div className="h-[80px] w-full overflow-hidden">
        <img
          src={logo}
          alt="brand"
          className="w-full h-full object-cover mx-auto"
        />
      </div>

      <div className="p-2">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search"
        />
      </div>
      <List>
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Dashboard
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Estadisticas
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Reportes
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Projectos
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 2 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <ShoppingBagIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                E-Commerce
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              {/* SUBMENU PRODUCTOS */}
              <Accordion 
              open={subOpen === 4}>
                <ListItem className="p-0" selected={subOpen === 4}>
                  <AccordionHeader
                    onClick={() => setSubOpen(subOpen === 4 ? 0 : 4)}
                    className="border-b-0 px-3 py-2"
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3}
                      className={`h-3 w-5 transition-transform duration-300 ${
      subOpen === 4 ? "rotate-90" : ""
    }`}        />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      Productos
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1 pl-9">
                  <List className="p-0">
                    <ListItem onClick={() => navigate("/admin/productos/nuevo")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                      </ListItemPrefix>
                      Nuevo producto
                    </ListItem>
                    <ListItem onClick={() => navigate("/admin/productos")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                      </ListItemPrefix>
                      Ver productos
                    </ListItem>
                    <ListItem onClick={() => navigate("/admin/productos/publicar")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                      </ListItemPrefix>
                      Publicar productos
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
              {/* SUBMENU VENTAS */}
              <Accordion 
              open={subOpen === 3}>
                <ListItem className="p-0" selected={subOpen === 3}>
                  <AccordionHeader
                    onClick={() => setSubOpen(subOpen === 3 ? 0 : 3)}
                    className="border-b-0 px-3 py-2"
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3}
                      className={`h-3 w-5 transition-transform duration-300 ${
      subOpen === 3 ? "rotate-90" : ""
    }`}        />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      Ventas
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1 pl-9">
                  <List className="p-0">
                    <ListItem onClick={() => navigate("/admin/ventas/registrar-venta")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                      </ListItemPrefix>
                      Registrar venta
                    </ListItem>
                    <ListItem onClick={() => navigate("/admin/ventas/historial-ventas")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                      </ListItemPrefix>
                      Ver ventas
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Ordenes
              </ListItem>
              {/* SUBMENU CLIENTES */}
              <Accordion 
              open={subOpen === 5}>
                <ListItem className="p-0" selected={subOpen === 5}>
                  <AccordionHeader
                    onClick={() => setSubOpen(subOpen === 5 ? 0 : 5)}
                    className="border-b-0 px-3 py-2"
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3}
                      className={`h-3 w-5 transition-transform duration-300 ${
      subOpen === 5 ? "rotate-90" : ""
    }`}        />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      Clientes
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1 pl-9">
                  <List className="p-0">
                    <ListItem onClick={() => navigate("/admin/clientes/registrar-cliente")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                      </ListItemPrefix>
                      Registrar cliente
                    </ListItem>
                    <ListItem onClick={() => navigate("/admin/clientes")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                      </ListItemPrefix>
                      Ver clientes
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
            </List>
          </AccordionBody>
        </Accordion>
        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Perfil
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <ListItem onClick={() => logout(navigate, setUser)}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}
