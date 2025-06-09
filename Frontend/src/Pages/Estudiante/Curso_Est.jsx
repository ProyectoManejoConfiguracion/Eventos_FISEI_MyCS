import React, { useEffect, useState } from "react";
import "../../Styles/Curso_Est.css";
import { FaBookOpen, FaRegClock } from "react-icons/fa";
import { useAuth } from "../../auth/AuthContext";
import ModalConstruccion from "../../Components/modals/Construccion";

const badgeEstado = (categoria) => {
  switch (categoria) {
    case "CURSO": return "badge-amarillo";
    case "SEMINARIOS": return "badge-verde";
    default: return "badge-gris";
  }
};
const Loader = () => (
  <div className="loader2-container">
    <div className="loader2"></div>
    <span>Cargando cursos...</span>
  </div>
);

const Cursos = () => {
  const { user, logout } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/cursos/${user?.id}`)
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch(() => setCursos([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
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
                <span className={`curso-estado ${badgeEstado(item.curso.categoria)}`}>
                  {item.curso.categoria}
                </span>
              </div>

              <div className="curso-instructor">
                <FaBookOpen className="curso-icon" />
                <span>{item.curso.area}</span>
              </div>

              <div className="curso-progreso">
                <label>Horas: <b>{item.curso.horas}</b></label>
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
                <button className="btn-curso" onClick={() => setShowModal(true)}>
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ModalConstruccion show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Cursos;