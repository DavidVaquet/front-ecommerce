"use client"

import { useEffect, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useCategoriasEcommerceNavbar } from "../../hooks/useCategorias"
import { Search, ShoppingCart, User, Menu, X, ChevronRight } from "lucide-react"

export const NavbarEcommerce = ({ organizacion }) => {
  const [openCategorySlug, setOpenCategorySlug] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryRef, setCategoryRef] = useState(null)
  const location = useLocation()

  useEffect(() => {
    setOpenCategorySlug(null)
    setMobileMenuOpen(false)
  }, [location.pathname])

  const { data, isLoading } = useCategoriasEcommerceNavbar()
  const categorias = useMemo(() => data?.items ?? [], [data]);

  const currentCategory = useMemo(
    () => categorias.find((c) => c.slug === openCategorySlug) || null,
    [categorias, openCategorySlug],
  )

  const handleCategoryHover = (slug) => {
    setOpenCategorySlug(slug)
  }

  const handleCategoryLeave = () => {
    setOpenCategorySlug(null)
  }

  const toggleCategory = (slug) => {
    setOpenCategorySlug((prev) => (prev === slug ? null : slug))
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[auto,1fr,auto] items-center h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
              <img src="/imagenes/logoapplenegro.png" className="h-9 w-9" alt="Logo iClub" />
              <div className="hidden sm:block">
                <h1 className="text-gray-900 text-lg font-bold">iClub</h1>
                <p className="text-xs text-gray-500 -mt-1">Tienda</p>
              </div>
            </NavLink>

            <div className="hidden md:block w-full justify-self-center">
              <div className="relative mx-auto max-w-xl w-full">
                <input
                  type="text"
                  placeholder="Buscar productos, marcas y más..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-12 pr-4 bg-gray-50 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              {/* Búsqueda móvil */}
              <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Carrito */}
              <NavLink
                to="/carrito"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">Carrito</span>
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  3
                </span>
              </NavLink>

              {/* Usuario */}
              <NavLink
                to="/cuenta"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Cuenta</span>
              </NavLink>

              {/* Menú Móvil - Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
            className="flex items-center justify-center gap-0.5 py-2 px-4 sm:px-6 lg:px-8 overflow-visible"
            onMouseLeave={handleCategoryLeave} 
            >
              {categorias.map((c) => (
                <div
                  key={c.id}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(c.slug)}
                  // onMouseLeave={handleCategoryLeave} 
                >
                  <NavLink
                    to={`/categoria/${c.slug}`}
                    className={({ isActive }) =>
                      `
                        flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap
                        transition-all duration-200
                        ${isActive ? "bg-black text-white" : "text-gray-700 hover:text-black hover:bg-gray-50"}
                      `
                    }
                  >
                    {c.nombre}
                    {c.subcategorias.length > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                  </NavLink>

                  {openCategorySlug === c.slug && c.subcategorias.length > 0 && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-max"
                      style={{
                        animation: "slideDown 0.2s ease-out",
                      }}
                    >
                      <div className="grid grid-cols-2 gap-2 py-1">
                        {c.subcategorias.map((sub) => (
                          <NavLink
                            key={sub.id}
                            to={`/categoria/${c.slug}/${sub.slug}`}
                            className={({ isActive }) =>
                              `
                                block px-2 py-2.5 text-sm transition-colors whitespace-nowrap
                                ${
                                  isActive
                                    ? "bg-black text-white font-medium"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                }
                              `
                            }
                          >
                            {sub.nombre}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              {/* Header del Drawer */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-gray-900 text-lg font-bold">Menú</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Búsqueda Móvil */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Acciones Móviles */}
              <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-gray-200">
                <NavLink
                  to="/cuenta"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Mi Cuenta</span>
                </NavLink>
                <NavLink
                  to="/carrito"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Carrito (3)</span>
                </NavLink>
              </div>

              {/* Categorías Móviles */}
              <div className="space-y-1">
                <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2">Categorías</h3>
                {categorias.map((c) => (
                  <div key={c.id}>
                    <button
                      onClick={() => toggleCategory(c.slug)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-lg
                        transition-colors font-medium transition-all
                        ${openCategorySlug === c.slug ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"}
                      `}
                    >
                      <span>{c.nombre}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${openCategorySlug === c.slug ? "rotate-45" : ""}`}
                      />
                    </button>

                    {/* Subcategorías */}
                    {openCategorySlug === c.slug && c.subcategorias.length > 0 && (
                      <div className="mt-1 ml-4 space-y-1">
                        {c.subcategorias.map((sub) => (
                          <NavLink
                            key={sub.id}
                            to={`/categoria/${c.slug}/${sub.slug}`}
                            className={({ isActive }) =>
                              `
                                block px-4 py-2.5 rounded-lg text-sm transition-colors
                                ${
                                  isActive
                                    ? "bg-black text-white font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                                }
                              `
                            }
                          >
                            {sub.nombre}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
