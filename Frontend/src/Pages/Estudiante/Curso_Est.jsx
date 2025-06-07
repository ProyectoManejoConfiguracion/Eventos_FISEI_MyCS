import React from "react";
import "../../Styles/Curso_Est.css";
import { FaBookOpen, FaRegClock } from "react-icons/fa";

const cursos = [
  {
    id: 1,
    nombre: "Desarrollo Web Full Stack",
    instructor: "Dr. Carlos Ruiz",
    progreso: 75,
    inicio: "2024-03-15",
    estado: "En progreso"
  },
  {
    id: 2,
    nombre: "Introducción a Python",
    instructor: "Ing. María Pérez",
    progreso: 100,
    inicio: "2024-01-20",
    estado: "Completado"
  },
  {
    id: 3,
    nombre: "Introducción a Python",
    instructor: "Ing. María Pérez",
    progreso: 100,
    inicio: "2024-01-20",
    estado: "Completado"
  },

];

const badgeEstado = (estado) => {
  switch (estado) {
    case "En progreso": return "badge-amarillo";
    case "Completado": return "badge-verde";
    case "Pendiente": return "badge-rojo";
    default: return "badge-gris";
  }
};

const Cursos = () => {
  return (
    <div className="cursos-page">
      <h1 className="cursos-title">Mis Cursos y Eventos</h1>
      <div className="cursos-grid">
        {cursos.map((curso) => (
          <div className="curso-card" key={curso.id}>
            <div className="curso-header">
              <h2 className="curso-nombre">{curso.nombre}</h2>
              <span className={`curso-estado ${badgeEstado(curso.estado)}`}>
                {curso.estado}
              </span>
            </div>

            <div className="curso-instructor">
              <FaBookOpen className="curso-icon" />
              <span>{curso.instructor}</span>
            </div>

            <div className="curso-progreso">
              <label>Progreso: <b>{curso.progreso}%</b></label>
              <div className="curso-barra">
                <div
                  className="curso-barra-inner"
                  style={{ width: `${curso.progreso}%` }}
                ></div>
              </div>
            </div>

            <div className="curso-info">
              <FaRegClock /> <span>Inicio: {curso.inicio}</span>
            </div>

            <div className="curso-actions">
              <button className="btn-curso">Acceder al Curso</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
