"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Youtube, Facebook, Instagram } from "lucide-react"

export function Footer() {
  const footerSections = [
    {
      title: "Категории",
      links: [
        { name: "Смартфоны", href: "/smartphones" },
        { name: "Ноутбуки", href: "/laptops" },
        { name: "Планшеты", href: "/tablets" },
        { name: "Аксессуары", href: "/accessories" },
      ],
    },
    {
      title: "Покупателям",
      links: [
        { name: "Доставка", href: "/delivery" },
        { name: "Оплата", href: "/payment" },
        { name: "Гарантия", href: "/warranty" },
        { name: "Возврат", href: "/returns" },
      ],
    },
    {
      title: "О компании",
      links: [
        { name: "О нас", href: "/about" },
        { name: "Новости", href: "/news" },
        { name: "Карьера", href: "/careers" },
        { name: "Контакты", href: "/contacts" },
      ],
    },
  ]

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-6">
              
              <h3 className="text-2xl font-bold">
                AU<span className="text-orange-500">TEK</span>
              </h3>
            </div>

            <p className="text-slate-400 mb-6 leading-relaxed">
              Ваш надежный партнер в мире современных технологий. Качественная техника по доступным ценам.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-slate-300">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-slate-300">info@autek.ru</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-1" />
                <span className="text-slate-300">г. Москва, ул. Тверская, д. 1</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-slate-300">Пн-Пт: 9:00-21:00</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-orange-500 transition-colors duration-300">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Media & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-slate-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 mr-4">Мы в соцсетях:</span>
              {[
                { icon: Youtube, color: "hover:text-red-500", href: "#" },
                { icon: Facebook, color: "hover:text-blue-500", href: "#" },
                { icon: Instagram, color: "hover:text-pink-500", href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 ${social.color} transition-colors duration-300`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-slate-400 text-sm">© 2025 AUTEK. Все права защищены.</div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
