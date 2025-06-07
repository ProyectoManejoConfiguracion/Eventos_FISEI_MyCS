import React from 'react';
import '../Styles/Eventos.css';
import eventoImg from '../assets/img-css.png';
import { FaRegClock,FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";


const eventos = [
  {
    id: 1,
    titulo: "Hackathon Universitario 2024",
    tipo: "Competencia",
    imagen: eventoImg,
    descripcion: "Competencia de programación de 48 horas",
    fecha: "2024-06-15 - 09:00 AM",
    lugar: "Campus Principal - Aula Magna",
    participantes: 150,
    tecnologias: ["JavaScript", "Python", "React", "Node.js"]
  },
  {
    id: 2,
    titulo: "Curso de React",
    tipo: "Curso",
    imagen: eventoImg,
    descripcion: "Aprende React desde cero",
    fecha: "2024-07-01 - 10:00 AM",
    lugar: "Aula 101",
    participantes: 50,
    tecnologias: ["React", "JavaScript"]
  },
   {
    id: 3,
    titulo: "Hackathon Universitario 2024",
    tipo: "Competencia",
    imagen: eventoImg,
    descripcion: "Competencia de programación de 48 horas",
    fecha: "2024-06-15 - 09:00 AM",
    lugar: "Campus Principal - Aula Magna",
    participantes: 150,
    tecnologias: ["JavaScript", "Python", "React", "Node.js"]
  },
   {
    id: 4,
    titulo: "Hackathon Universitario 2024",
    tipo: "Competencia",
    imagen: eventoImg,
    descripcion: "Competencia de programación de 48 horas",
    fecha: "2024-06-15 - 09:00 AM",
    lugar: "Campus Principal - Aula Magna",
    participantes: 150,
    tecnologias: ["JavaScript", "Python", "React", "Node.js"]
  },
];

const badgeColor = tipo => {
  switch (tipo) {
    case "Competencia": return "badge-tomato";
    case "Curso": return "badge-blue";
    
    default: return "badge-default";
  }
};

const Eventos = () => {
  return (
    <div className="eventos-page">
      <h1 className="eventos-title">Cursos y Eventos</h1>
      <div className="eventos-grid">
        {eventos.map(evento => (
          <div className="evento-card" key={evento.id}>
            <h2 className="evento-title">{evento.titulo}</h2>
            <span className={`evento-badge ${badgeColor(evento.tipo)}`}>{evento.tipo}</span>
            <img src={evento.imagen} alt={evento.titulo} className="evento-img" />
            <p className="evento-desc">{evento.descripcion}</p>
            <div className="evento-info">
              <span>
                <i><FaRegClock /></i> {evento.fecha}
              </span>
              <span>
                <i><FaLocationDot /></i> {evento.lugar}
              </span>
              <span>
                <i><FaUsers /></i> {evento.participantes} participantes
              </span>
            </div>
            <div className="evento-tec">
              <b>Tecnologías:</b>
              {evento.tecnologias.map((tec, idx) => (
                <span className="tec-badge" key={idx}>{tec}</span>
              ))}
            </div>
            <div className="evento-actions">
              <button className="btn-detalles">Ver Detalles</button>
              <button className="btn-inscribirse">Inscribirse</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Eventos;