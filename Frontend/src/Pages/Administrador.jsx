import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../Styles/Administrador.css";
import { useAuth } from "../auth/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, NavLink, Outlet, Link } from "react-router-dom";
import {
  FaUser,
  FaBook,
  FaCalendar,
  FaGlobe,
  FaUserAlt,
  FaRegStickyNote,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";

const Administrador = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
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
    <div className="admin-layout">
      <header className="header-principal">
        <div className="header-content">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <Link to="/">
              <img src={logo} alt="Logo" className="header-logo" />
            </Link>
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

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
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
            {user?.role === "Admin" && (
              <li>
                <NavLink
                  to="/Administrador/Usuario"
                  className={({ isActive }) =>
                    `navbar_items ${isActive ? "estado-activo" : ""}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaUser className="nav-icon" /> Usuarios
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/Administrador/Curso"
                className={({ isActive }) =>
                  `navbar_items ${isActive ? "estado-activo" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaBook className="nav-icon" /> Cursos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Administrador/Eventos"
                className={({ isActive }) =>
                  `navbar_items ${isActive ? "estado-activo" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaCalendar className="nav-icon" /> Eventos
              </NavLink>
            </li>

              
            {user?.role === "Admin" && (
              <li>
                <NavLink
                  to="/Administrador/Contenido"
                  className={({ isActive }) =>
                    `navbar_items ${isActive ? "estado-activo" : ""}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaGlobe className="nav-icon" /> Contenido Web
                </NavLink>
              </li>)
            }

            <li>
              <NavLink
                to="/Administrador/Notas"
                className={({ isActive }) =>
                  `navbar_items ${isActive ? "estado-activo" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaRegStickyNote className="nav-icon" /> Notas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Administrador/VerificarFotos"
                className={({ isActive }) =>
                  `navbar_items ${isActive ? "estado-activo" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaRegStickyNote className="nav-icon" /> Documentos
              </NavLink>
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