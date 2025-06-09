import React, { useEffect, useState } from 'react';
import '../Styles/Eventos.css';
import { FaRegClock, FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import axios from 'axios';

import defaultImg from '../assets/imagen_defecto.jpg';

const badgeColor = tipo => {
  switch (tipo) {
    case "CONFERENCIAS": return "badge-tomato";
    case "CURSO": return "badge-blue";
    case "Gratuito": return "badge-green";
    case "CURSO": return "badge-blue";
    default: return "badge-default";
  }
};

const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
    <span>Cargando eventos...</span>
  </div>
);

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/api/eventos'),
      axios.get('http://localhost:3000/api/detalle_eventos'),
      axios.get('http://localhost:3000/api/tarifas_evento')
    ])
      .then(([resEventos, resDetalles, resTarifas]) => {
        setEventos(resEventos.data);
        setDetalles(resDetalles.data);
        setTarifas(resTarifas.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getDetalleEvento = (id_evt) => detalles.find(d => d.ID_EVT === id_evt);
  const getTarifaEvento = (id_evt) => tarifas.filter(t => t.ID_EVT === id_evt);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="eventos-page">
      <h1 className="eventos-title">Cursos y Eventos</h1>
      <div className="eventos-grid">
        {eventos.map(evento => {
          const detalle = getDetalleEvento(evento.ID_EVT);
          const tarifasEvento = getTarifaEvento(evento.ID_EVT);
          const imagenUrl = evento.FOT_EVT
            ? `http://localhost:3000/${evento.FOT_EVT.replace(/\\/g, "/")}`
            : defaultImg;

          return (
            <div className="evento-card" key={evento.ID_EVT}>
              <h2 className="evento-title">{evento.NOM_EVT}</h2>
              <span className={`evento-badge ${badgeColor(detalle?.CAT_DET || evento.TIP_EVT)}`}>
                {detalle?.CAT_DET || evento.TIP_EVT}
              </span>
              <img
                src={imagenUrl}
                alt={evento.NOM_EVT}
                className="evento-img"
                onError={e => { e.target.onerror = null; e.target.src = defaultImg; }}
                style={{ display: 'block', margin: '10px auto', maxHeight: '120px', objectFit: 'contain' }}
              />
              <p className="evento-desc">{evento.DES_EVT}</p>
              <div className="evento-info">
                <span>
                  <i><FaRegClock /></i> {evento.FEC_EVT}
                </span>
                <span>
                  <i><FaLocationDot /></i> {evento.LUG_EVT}
                </span>
                <span>
                  <i><FaUsers /></i> {detalle?.CUP_DET || 'N/A'} cupos
                </span>
              </div>
              <div className="evento-tec">
                <b>Área:</b> {detalle?.ARE_DET || 'N/A'}
              </div>
              <div className="evento-tec">
                <b>Tarifas:</b>
                {tarifasEvento.length > 0 ? tarifasEvento.map((tarifa, idx) => (
                  <span className="tec-badge" key={idx}>
                    {tarifa.TIP_PAR}: ${tarifa.VAL_EVT}
                  </span>
                )) : <span className="tec-badge">Gratuito</span>}
              </div>
              <div className="evento-actions">
                <button className="btn-detalles">Ver Detalles</button>
                <button className="btn-inscribirse">Inscribirse</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Eventos;



