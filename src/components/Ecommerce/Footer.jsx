"use client"

import { NavLink } from "react-router-dom"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export const FooterEcommerce = () => {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: "Categorías",
      links: [
        { label: "Electrónica", href: "/categoria/electronica" },
        { label: "Ropa", href: "/categoria/ropa" },
        { label: "Hogar", href: "/categoria/hogar" },
        { label: "Deportes", href: "/categoria/deportes" },
      ],
    },
    {
      title: "Ayuda",
      links: [
        { label: "Centro de Ayuda", href: "/ayuda" },
        { label: "Envíos", href: "/envios" },
        { label: "Devoluciones", href: "/devoluciones" },
        { label: "Garantía", href: "/garantia" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Sobre Nosotros", href: "/sobre-nosotros" },
        { label: "Carreras", href: "/carreras" },
        { label: "Blog", href: "/blog" },
        { label: "Prensa", href: "/prensa" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Términos de Servicio", href: "/terminos" },
        { label: "Política de Privacidad", href: "/privacidad" },
        { label: "Cookies", href: "/cookies" },
        { label: "Contacto", href: "/contacto" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-gray-900 text-gray-100 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/imagenes/logoapplenegro.png" className="h-8 w-8 invert" alt="Logo iClub" />
              <div>
                <h3 className="text-white text-lg font-bold">iClub</h3>
                <p className="text-xs text-gray-400">Tienda</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Tu tienda de confianza para encontrar los mejores productos con la mejor calidad.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-gray-200 transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-gray-200 transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>soporte@iclub.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Calle Principal 123, Ciudad, País</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Suscríbete a nuestro Newsletter</h3>
              <p className="text-sm text-gray-400">Recibe ofertas exclusivas y novedades directamente en tu correo.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              />
              <button className="px-6 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap">
                Suscribir
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">&copy; {currentYear} iClub. Todos los derechos reservados.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
