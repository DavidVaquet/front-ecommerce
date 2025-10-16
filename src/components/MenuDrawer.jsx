import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { Menu } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import { logout } from "../helpers/logout";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { getSettingsCompany } from "../services/settingServices";

export function MenuDrawer({ titleNombre }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [accordionOpen, setAccordionOpen] = React.useState(0);
  const [subOpen, setSubOpen] = React.useState(0);
  const [companySettings, setCompanySettings] = useState(null);
  const [logoBust, setLogoBust] = useState(Date.now());

  
  const { setUser } = useContext(AuthContext);

  const handleOpen = (value) => {
    setAccordionOpen(accordionOpen === value ? 0 : value);
  };
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const navigate = useNavigate();

  const handleRedirect = (text) => {
        navigate(`${text}`);
        setDrawerOpen(false);

  }

  useEffect(() => {
      async function fetchSettings() {
        try {
          const sett = await getSettingsCompany();
          setCompanySettings(sett);
        } catch (error) {
          console.error("Error obteniendo settings:", error);
        }
      }
      fetchSettings();
    }, []);
  
  
    
  useEffect(() => {
      const onLogoUpdated = async () => {
        console.log("Evento logo-updated recibido");
        setLogoBust(Date.now());
  
      };
      window.addEventListener("logo-updated", onLogoUpdated);
      return () => window.removeEventListener("logo-updated", onLogoUpdated);
    }, []);
  
   
    const base = companySettings?.logo_url || "/logo-placeholder.svg";
    const logoSrc = `${base}${base.includes("?") ? "&" : "?"}v=${logoBust}`;

  return (
    <>
      <IconButton size="sm" variant="outlined" color="black" onClick={openDrawer}>
        <Menu className="h-4 w-4 text-black" />
      </IconButton>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        placement="left"
        className="p-0 !h-[100dvh] !max-h-[100dvh]"
      >
        {/* Layout a alto completo */}
        <div className="flex flex-col h-[100dvh]">
          <div className="flex items-center justify-center p-4 flex-none border-b">
          {/* Contenedor con altura fija y padding lateral */}
          <div className="h-[70px] w-full px-2">
            <img
              key={logoBust}
              src={logoSrc}
              alt="brand"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

          {/* Cuerpo scrollable (ocupa el resto) */}
          <div className="flex-1 overflow-y-auto">
            <List>
              {/* DASHBOARD */}
              <Accordion
                open={accordionOpen === 1}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 1 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0" selected={accordionOpen === 1}>
                  <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
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
                    <ListItem onClick={() => handleRedirect("/admin/estadisticas")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Estadisticas
                    </ListItem>
                    <ListItem onClick={() => handleRedirect("/admin/reportes")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Reportes
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>

              {/* E-COMMERCE */}
              <Accordion
                open={accordionOpen === 2}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 2 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0" selected={accordionOpen === 2}>
                  <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
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
                    <Accordion open={subOpen === 4}>
                      <ListItem className="p-0" selected={subOpen === 4}>
                        <AccordionHeader
                          onClick={() => setSubOpen(subOpen === 4 ? 0 : 4)}
                          className="border-b-0 px-3 py-2"
                        >
                          <ListItemPrefix>
                            <ChevronRightIcon
                              strokeWidth={3}
                              className={`h-3 w-5 transition-transform duration-300 ${subOpen === 4 ? "rotate-90" : ""}`}
                            />
                          </ListItemPrefix>
                          <Typography color="blue-gray" className="mr-auto font-normal">
                            Productos
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1 pl-9">
                        <List className="p-0">
                          <ListItem onClick={() => handleRedirect("/admin/productos/nuevo")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Nuevo producto
                          </ListItem>
                          <ListItem onClick={() => handleRedirect("/admin/productos")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Ver productos
                          </ListItem>
                          <ListItem onClick={() => handleRedirect("/admin/categorias")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Gestión de categorías
                          </ListItem>
                          <ListItem onClick={() => handleRedirect("/admin/productos")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Publicar productos
                          </ListItem>
                        </List>
                      </AccordionBody>
                    </Accordion>

                    {/* SUBMENU VENTAS */}
                    <Accordion open={subOpen === 3}>
                      <ListItem className="p-0" selected={subOpen === 3}>
                        <AccordionHeader
                          onClick={() => setSubOpen(subOpen === 3 ? 0 : 3)}
                          className="border-b-0 px-3 py-2"
                        >
                          <ListItemPrefix>
                            <ChevronRightIcon
                              strokeWidth={3}
                              className={`h-3 w-5 transition-transform duration-300 ${subOpen === 3 ? "rotate-90" : ""}`}
                            />
                          </ListItemPrefix>
                          <Typography color="blue-gray" className="mr-auto font-normal">
                            Ventas
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1 pl-9">
                        <List className="p-0">
                          <ListItem onClick={() => handleRedirect("/admin/ventas/registrar-venta")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Generar venta
                          </ListItem>
                          <ListItem onClick={() => handleRedirect("/admin/ventas/historial-ventas")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Historial de ventas
                          </ListItem>
                        </List>
                      </AccordionBody>
                    </Accordion>

                    {/* SUBMENU STOCK */}
                    <Accordion open={subOpen === 6}>
                      <ListItem className="p-0" selected={subOpen === 6}>
                        <AccordionHeader
                          onClick={() => setSubOpen(subOpen === 6 ? 0 : 6)}
                          className="border-b-0 px-3 py-2"
                        >
                          <ListItemPrefix>
                            <ChevronRightIcon
                              strokeWidth={3}
                              className={`h-3 w-5 transition-transform duration-300 ${subOpen === 6 ? "rotate-90" : ""}`}
                            />
                          </ListItemPrefix>
                          <Typography color="blue-gray" className="mr-auto font-normal">
                            Stock
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1 pl-9">
                        <List className="p-0">
                          <ListItem onClick={() => handleRedirect("/admin/stock/registrar-movimiento-stock")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Generar movimiento
                          </ListItem>
                          <ListItem onClick={() => handleRedirect("/admin/stock/movimientos-stock")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Historial de movimientos
                          </ListItem>
                        </List>
                      </AccordionBody>
                    </Accordion>

                    <ListItem onClick={() => handleRedirect("/admin/ordenes")}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Ordenes
                    </ListItem>

                    {/* SUBMENU CLIENTES */}
                    <Accordion open={subOpen === 5}>
                      <ListItem className="p-0" selected={subOpen === 5}>
                        <AccordionHeader
                          onClick={() => setSubOpen(subOpen === 5 ? 0 : 5)}
                          className="border-b-0 px-3 py-2"
                        >
                          <ListItemPrefix>
                            <ChevronRightIcon
                              strokeWidth={3}
                              className={`h-3 w-5 transition-transform duration-300 ${subOpen === 5 ? "rotate-90" : ""}`}
                            />
                          </ListItemPrefix>
                          <Typography color="blue-gray" className="mr-auto font-normal">
                            Clientes
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1 pl-9">
                        <List className="p-0">
                          <ListItem onClick={() => handleRedirect("/admin/clientes/registrar-cliente")}>
                            <ListItemPrefix>
                              <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                            </ListItemPrefix>
                            Registrar cliente
                          </ListItem>
                          <ListItem onClick={() => handleRedirect("/admin/clientes")}>
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

              <ListItem onClick={() => handleRedirect("/admin/perfil")}>
                <ListItemPrefix>
                  <UserCircleIcon className="h-5 w-5" />
                </ListItemPrefix>
                Perfil
              </ListItem>
              <ListItem onClick={() => handleRedirect("/admin/settings")}>
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
          </div>
        </div>
      </Drawer>
    </>
  );
}
