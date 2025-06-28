import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../Styles/Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import Login from "../Components/modals/Login";
import { useAuth } from "../auth/AuthContext";
import Swal from "sweetalert2";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isEstudiante =
  ["estudiante", "invitado"].includes((user?.role || "").toLowerCase());
const isDashboard = location.pathname.startsWith("/Estudiante");

  const handleLogout = async () => {
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

  return (
    <header className="header">
      <div className="header__container">
        <img src={logo} className="logo" alt="Logo" />

        <nav className="header__nav">
          <ul className="header__nav-list">
            <li>
              <Link className="header__nav-item" to="/">
                Inicio
              </Link>
            </li>
            <li>
              <Link className="header__nav-item" to="/Eventos">
                Eventos
              </Link>
            </li>
            <li>
              <Link className="header__nav-item" to="/Nosotros">
                Nosotros
              </Link>
            </li>
            <li>
              <Link className="header__nav-item" to="/Contactos">
                Contactos
              </Link>
            </li>
            {/* Opciones dinámicas para estudiante */}
            {isEstudiante && !isDashboard && (
              <li>
                <Link className="header__nav-item" to="/Estudiante">
                  Dashboard
                </Link>
              </li>
            )}
            {isEstudiante && isDashboard && (
              <li>
                <Link className="header__nav-item" to="/">
                  Regresar
                </Link>
              </li>
            )}
          </ul>
        </nav>
      
        {user ? (
          <button className="btn_cerrar" onClick={handleLogout}>
            <FaUserAlt size={20} color="white" /> Cerrar Sesión
          </button>
        ) : (
          <>
            <button className="btn_Loging" onClick={() => setIsModalOpen(true)}>
              <FaUserAlt size={20} color="white" /> Iniciar Sesión
            </button>
            <Login isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;