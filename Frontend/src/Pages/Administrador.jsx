import React from "react";
import logo from "../assets/logo.png";
import "../Styles/Administrador.css";
import { useAuth } from "../auth/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, Link, Outlet } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBook,
  FaCalendar,
  FaGlobe,
  FaCog,
  FaUserAlt,
  FaRegStickyNote,
} from "react-icons/fa";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";

const Administrador = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Queres cerrar sesión?",
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
    <div className="admin-layout">
      <header className="header-principal">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="Logo" className="header-logo" />
            <p className="panel-text">Panel de Control</p>
          </div>
          <div className="header-right">
            <button className="btn_Logout" onClick={handleLogout}>
              <FaUserAlt size={16} color="white" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <FaUserAlt className="avatar-icon" />
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{user?.name || "Usuario"}</h3>
            <p className="profile-role">{user?.role || ""}</p>
          </div>
        </div>
        <nav className="sidebar-navbar">
          <ul className="sidebar-navbar_item">
            <li >
              <Link to="/Administrador/VistaGeneral" className="navbar_items">
                <FaHome className="nav-icon" /> Vista General
              </Link>
            </li>
            <li>
              <Link to="/Administrador/Usuariogit " className="navbar_items">
                <FaUser className="nav-icon" /> Usuarios
              </Link>
            </li>
            
            <li>
              <Link to="/Administrador/Curso" className="navbar_items">
                 <FaBook className="nav-icon" /> Cursos
              </Link>
             
            </li>
            <li>
              <Link to="/Administrador/Eventos_admin" className="navbar_items">
                  <FaCalendar className="nav-icon" /> Eventos
              </Link>
             
            </li>
            <li >
              <Link to="/Administrador/Contenido" className="navbar_items">
                 <FaGlobe className="nav-icon" /> Contenido Web
              </Link>
              
            </li>
            <li >
              <Link to="/Administrador/Notas" className="navbar_items">
                 <FaRegStickyNote className="nav-icon" /> Notas
              </Link>
              
            </li>
            <li >
               <Link to="/Administrador/Tarifas" className="navbar_items">
                 <PiCurrencyDollarSimpleFill className="nav-icon" /> Tarifas
              </Link>
              
            </li>
            <li >
               <Link to="/Administrador/Tarifas" className="navbar_items">
                 <FaCog className="nav-icon" /> Configuración
              </Link>
              
            </li>
          </ul>
        </nav>
      </aside>
       <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Administrador;