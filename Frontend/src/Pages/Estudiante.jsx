import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import {
  FaUserAlt,
  FaBookOpen,
  FaCog,
  FaRegClock,
  FaChevronDown,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage,
} from "react-icons/fa";
import "../Styles/Estudiante.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { MdWavingHand, MdExitToApp } from "react-icons/md";
import { BACK_URL } from "../../config";
import ModalDetalles from "../Components/modals/ModalDetalles";

const Estudiante = () => {
  const { user, logout } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
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
    switch (categoria?.toUpperCase()) {
      case "CURSO":
        return "badge-amarillo";
      case "SEMINARIO":
      case "SEMINARIOS":
        return "badge-verde";
      case "TALLER":
        return "badge-azul";
      case "CONFERENCIA":
        return "badge-morado";
      default:
        return "badge-gris";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTipoEvento = (tipEvt) => {
    const tipos = {
      'C': 'Curso',
      'S': 'Seminario',
      'T': 'Taller',
      'CF': 'Conferencia',
      'W': 'Workshop'
    };
    return tipos[tipEvt] || tipEvt || 'Evento';
  };

  const getImageUrl = (evento) => {
    if (evento.FOT_EVT) {
      if (evento.FOT_EVT.startsWith('http')) {
        return evento.FOT_EVT;
      }
      return `${BACK_URL}/${evento.FOT_EVT.replace(/\\/g, "/")}`;
    }
    
    if (evento.imagen) {
      if (evento.imagen.startsWith('http')) {
        return evento.imagen;
      }
      return `${BACK_URL}/${evento.imagen.replace(/\\/g, "/")}`;
    }
    
    if (evento.foto) {
      if (evento.foto.startsWith('http')) {
        return evento.foto;
      }
      return `${BACK_URL}/${evento.foto.replace(/\\/g, "/")}`;
    }
    
    return null;
  };

  const handleImageError = (eventoId) => {
    setImageErrors(prev => new Set([...prev, eventoId]));
  };

  const ImagePlaceholder = ({ titulo }) => (
    <div className="curso-imagen-placeholder">
      <FaImage className="placeholder-icon" />
      <span className="placeholder-text">{titulo || 'Sin imagen'}</span>
    </div>
  );

  const handleVerDetalles = async (item) => {
    try {
      const eventoId = item.curso?.id || item.curso?.ID_EVT || item.ID_EVT;
      if (eventoId) {
        const response = await fetch(`${BACK_URL}/api/eventos/${eventoId}`);
        if (response.ok) {
          const eventoDetalle = await response.json();
          setSelectedItem({ ...item, detalles: eventoDetalle });
        } else {
          setSelectedItem(item);
        }
      } else {
        setSelectedItem(item);
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  const Loader = () => (
    <div className="loader2-container">
      <div className="loader2"></div>
      <span>Cargando cursos...</span>
    </div>
  );

  const fotoUrl = user?.img
    ? `${BACK_URL}/${user?.img.replace(/\\/g, "/")}`
    : user?.photo ||
      "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(`${user?.name || ""} ${user?.lastname || ""}`);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    
    fetch(`${BACK_URL}/api/cursos/${user.id}`)
      .then((res) => res.json())
      .then(async (data) => {
        const cursosConImagenes = await Promise.all(
          data.map(async (item) => {
            try {
              const eventoId = item.curso?.id || item.curso?.ID_EVT || item.ID_EVT;
              if (eventoId) {
                const response = await fetch(`${BACK_URL}/api/eventos/${eventoId}`);
                if (response.ok) {
                  const eventoDetalle = await response.json();
                  return {
                    ...item,
                    curso: { ...item.curso, ...eventoDetalle }
                  };
                }
              }
              return item;
            } catch (error) {
              console.error(`Error cargando detalles del evento ${eventoId}:`, error);
              return item;
            }
          })
        );
        setCursos(cursosConImagenes);
      })
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
            ) : !Array.isArray(cursos) || cursos.length === 0 ? (
              <div className="sin-cursos-msg">
                No tienes cursos por el momento
              </div>
            ) : (
              <div className="cursos-grid">
                {cursos.map((item, idx) => {
                  const evento = item.curso || item;
                  const eventoId = evento.id || evento.ID_EVT || idx;
                  const imagenUrl = getImageUrl(evento);
                  const hasImageError = imageErrors.has(eventoId);
                  const titulo = evento.nombre || evento.NOM_EVT || 'Sin título';
                  
                  return (
                    <div className="curso-card" key={eventoId}>
                      <div className="curso-imagen-container">
                        {imagenUrl && !hasImageError ? (
                          <div className="curso-imagen">
                            <img 
                              src={imagenUrl} 
                              alt={titulo}
                              onError={() => handleImageError(eventoId)}
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <ImagePlaceholder titulo={titulo} />
                        )}
                      </div>
                      
                      <div className="curso-content">
                        <div className="curso-header">
                          <h2 className="curso-nombre">
                            {titulo}
                          </h2>
                          <span
                            className={`curso-estado ${badgeEstado(
                              evento.categoria || getTipoEvento(evento.TIP_EVT)
                            )}`}
                          >
                            {evento.categoria || getTipoEvento(evento.TIP_EVT)}
                          </span>
                        </div>

                        {evento.SUB_EVT && (
                          <p className="curso-subtitulo">{evento.SUB_EVT}</p>
                        )}

                        <div className="curso-info-grid">
                          <div className="curso-info-item">
                            <FaBookOpen className="curso-icon" />
                            <span>Área: {evento.area || evento.CAR_MOT || 'No especificada'}</span>
                          </div>

                          <div className="curso-info-item">
                            <FaCalendarAlt className="curso-icon" />
                            <span>Inicio: {formatDate(evento.fecha || evento.FEC_EVT)}</span>
                          </div>

                          {(evento.FEC_FIN || evento.fechaFin) && (
                            <div className="curso-info-item">
                              <FaRegClock className="curso-icon" />
                              <span>Fin: {formatDate(evento.FEC_FIN || evento.fechaFin)}</span>
                            </div>
                          )}

                          {(evento.LUG_EVT || evento.lugar) && (
                            <div className="curso-info-item">
                              <FaMapMarkerAlt className="curso-icon" />
                              <span>Lugar: {evento.LUG_EVT || evento.lugar}</span>
                            </div>
                          )}

                          {evento.horas && (
                            <div className="curso-info-item">
                              <FaRegClock className="curso-icon" />
                              <span>Duración: {evento.horas} horas</span>
                            </div>
                          )}
                        </div>
                        <div className="curso-actions">
                          <button
                            className="btn-curso"
                            onClick={() => handleVerDetalles(item)}
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <ModalDetalles
              show={showModal}
              item={selectedItem}
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