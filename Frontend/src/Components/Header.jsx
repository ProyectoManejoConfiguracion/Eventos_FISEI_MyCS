import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "../Styles/Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import Login from "../Components/modals/Login";
import { useAuth } from "../auth/AuthContext";
import Swal from "sweetalert2";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isEstudiante =
  ["estudiante", "invitado"].includes((user?.role || "").toLowerCase());
const isDashboard = location.pathname.startsWith("/Estudiante");

  // Cerrar menú móvil cuando cambie la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Cerrar menú móvil cuando se haga clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.header')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevenir scroll cuando el menú móvil esté abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    // Cerrar menú móvil si está abierto
    setIsMobileMenuOpen(false);
    
    // Si está en dashboard, el mensaje ya lo muestra el componente Estudiante
    if (isDashboard) {
      logout();
      navigate("/");
      return;
    }
    // Si está fuera del dashboard, muestra confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      logout();
      await Swal.fire({
        title: "Sesión cerrada",
        text: "Has cerrado sesión exitosamente.",
        icon: "success",
      });
      navigate("/");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    // Cerrar menú móvil cuando se haga clic en un enlace de navegación
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" onClick={handleNavClick}>
          <img src={logo} className="logo" alt="Logo" />
        </Link>

        {/* Botón hamburguesa para móviles */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header__nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="header__nav-list">
            <li>
              <Link 
                className="header__nav-item" 
                to="/"
                onClick={handleNavClick}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link 
                className="header__nav-item" 
                to="/Eventos"
                onClick={handleNavClick}
              >
                Eventos
              </Link>
            </li>
            <li>
              <Link 
                className="header__nav-item" 
                to="/Nosotros"
                onClick={handleNavClick}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link 
                className="header__nav-item" 
                to="/Contactos"
                onClick={handleNavClick}
              >
                Contactos
              </Link>
            </li>
            {/* Opciones dinámicas para estudiante */}
            {isEstudiante && !isDashboard && (
              <li>
                <Link 
                  className="header__nav-item" 
                  to="/Estudiante"
                  onClick={handleNavClick}
                >
                  Dashboard
                </Link>
              </li>
            )}
            {isEstudiante && isDashboard && (
              <li>
                <Link 
                  className="header__nav-item" 
                  to="/"
                  onClick={handleNavClick}
                >
                  Regresar
                </Link>
              </li>
            )}
            
            {/* Botones de autenticación dentro del menú móvil */}
            <li className="mobile-auth-buttons">
              {user ? (
                <button className="btn_cerrar" onClick={handleLogout}>
                  <FaUserAlt size={16} color="white" /> 
                  <span>Cerrar Sesión</span>
                </button>
              ) : (
                <button 
                  className="btn_Loging" 
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FaUserAlt size={16} color="white" /> 
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </li>
          </ul>
        </nav>

        {/* Botones de autenticación para desktop */}
        <div className="desktop-auth-buttons">
          {user ? (
            <button className="btn_cerrar" onClick={handleLogout}>
              <FaUserAlt size={20} color="white" /> 
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <button className="btn_Loging" onClick={() => setIsModalOpen(true)}>
              <FaUserAlt size={20} color="white" /> 
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal de Login */}
      {!user && (
        <Login isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
      )}

      {/* Overlay para cerrar menú móvil */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
