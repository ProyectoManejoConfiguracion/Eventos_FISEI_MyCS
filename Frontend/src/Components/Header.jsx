import React, { useState } from "react";
import logo from "../assets/logo.png";
import { FaUserAlt, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center text-black py-6 px-6 md:px-10 bg-white drop-shadow-md">
      <a href="#">
        <img src={logo} alt="" className="w-90 h-auto ml-[-20] hover:scale-105 transition-all" />
      </a>

      <nav className="hidden xl:flex">
        <ul className="flex items-center gap-20 font-semibold ml-[-190px] text-lg">
          <li className="hover:scale-105 hover:text-[#581517] cursor-pointer  transition">Inicio</li>
          <li className="hover:scale-105 hover:text-[#581517] cursor-pointer  transition">Eventos</li>
          <li className="hover:scale-105 hover:text-[#581517] cursor-pointer  transition">Nosotros</li>
          <li className="hover:scale-105 hover:text-[#581517] cursor-pointer  transition">Contactos</li>
        </ul>
      </nav>

      <button className="hidden xl:flex group items-center gap-2 border border-black px-4 py-2 rounded text-black hover:bg-[#581517] hover:text-white hover:scale-105 transition-all ">
        <FaUserAlt
          className="text-black group-hover:text-white transition duration-200"
          size={18}
        />
        Iniciar Sesión
      </button>

     
      <button
        className="xl:hidden block text-4xl cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

     
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg xl:hidden">
          <nav className="p-6">
            <ul className="flex flex-col gap-4 font-semibold text-lg mb-6">
              <li className="hover:text-[#581517] cursor-pointer">Inicio</li>
              <li className="hover:text-[#581517] cursor-pointer">Eventos</li>
              <li className="hover:text-[#581517] cursor-pointer">Nosotros</li>
              <li className="hover:text-[#581517] cursor-pointer">Contactos</li>
            </ul>
            <button className="group flex items-center gap-2 border border-[#581517] px-4 py-2 rounded text-black hover:bg-[#581517] hover:text-white transition w-full justify-center">
              <FaUserAlt
                className="text-black group-hover:text-white transition duration-200"
                size={18}
              />
              Iniciar Sesión
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;