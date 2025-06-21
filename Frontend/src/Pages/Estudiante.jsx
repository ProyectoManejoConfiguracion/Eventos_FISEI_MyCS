import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import {
  FaUserAlt,
  FaBookOpen,
  FaGraduationCap,
  FaCalendarCheck,
  FaCertificate,
  FaCog,
  FaRegClock,
  FaChevronDown,
} from "react-icons/fa";
import "../Styles/Estudiante.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { MdWavingHand, MdExitToApp } from "react-icons/md";
import { BACK_URL } from "../../config";
import ModalConstruccion from "../Components/modals/Construccion";

const Estudiante = () => {
  const { user, logout } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setMenuOpen(false);
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

  const handleBack = () => {
    navigate("/");
  };

  const handleConfig = () => {
    setMenuOpen(false);
    navigate("/Estudiante/Configuracion");
  };

  const badgeEstado = (categoria) => {
    switch (categoria) {
      case "CURSO":
        return "badge-amarillo";
      case "SEMINARIOS":
        return "badge-verde";
      default:
        return "badge-gris";
    }
  };

  const Loader = () => (
    <div className="loader2-container">
      <div className="loader2"></div>
      <span>Cargando cursos...</span>
    </div>
  );
  const fotoUrl = user?.FOT_PER
    ? `${BACK_URL}/${user.FOT_PER.replace(/\\/g, "/")}`
    : user?.photo ||
      "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(`${user?.name || ""} ${user?.lastname || ""}`);

  useEffect(() => {
    setLoading(true);
    fetch(`${BACK_URL}/api/cursos/${user?.id}`)
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch(() => setCursos([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu-container")) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="estudiante-container">
      <header className="estudiante-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <div>
            <h1 className="dashboard-title">Bienvenido al Aula Virtual</h1>
            <p className="welcome-text">
              <MdWavingHand /> Hola, {user?.name} {user?.lastname}
            </p>
          </div>
        </div>
        <div className="header-right">
          <button
            className="back-btn"
            onClick={handleBack}
            style={{ marginRight: "10px" }}
          >
            <MdExitToApp size={16} color="white" />
            Regresar
          </button>
          <div className="profile-menu-container">
            <div
              className="profile-avatar"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <img src={fotoUrl} alt="Perfil" className="avatar-img" />

              <FaChevronDown className="chevron-icon" />
            </div>
            {menuOpen && (
              <div className="profile-dropdown">
                <button onClick={handleConfig}>
                  <FaCog style={{ marginRight: 8 }} />
                  Configuración
                </button>
                <button onClick={handleLogout}>
                  <FaUserAlt style={{ marginRight: 8 }} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {location.pathname !== "/Estudiante/Configuracion" && (
        <main className="main-content-est">
          <Outlet />
          <div className="cursos-page">
            <h1 className="cursos-title">Mis Cursos y Eventos</h1>
            {loading ? (
              <Loader />
            ) : cursos.length === 0 ? (
              <div className="sin-cursos-msg">
                No tienes cursos por el momento
              </div>
            ) : (
              <div className="cursos-grid">
                {cursos.map((item, idx) => (
                  <div className="curso-card" key={item.curso.id || idx}>
                    <div className="curso-header">
                      <h2 className="curso-nombre">{item.curso.nombre}</h2>
                      <span
                        className={`curso-estado ${badgeEstado(
                          item.curso.categoria
                        )}`}
                      >
                        {item.curso.categoria}
                      </span>
                    </div>

                    <div className="curso-instructor">
                      <FaBookOpen className="curso-icon" />
                      <span>{item.curso.area}</span>
                    </div>

                    <div className="curso-progreso">
                      <label>
                        Horas: <b>{item.curso.horas}</b>
                      </label>
                      <div className="curso-barra">
                        <div
                          className="curso-barra-inner"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="curso-info">
                      <FaRegClock /> <span>Fecha: {item.curso.fecha}</span>
                    </div>

                    <div className="curso-actions">
                      <button
                        className="btn-curso"
                        onClick={() => setShowModal(true)}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ModalConstruccion
              show={showModal}
              onClose={() => setShowModal(false)}
            />
          </div>
        </main>
      )}
      {location.pathname === "/Estudiante/Configuracion" && <Outlet />}
    </div>
  );
};

export default Estudiante;
