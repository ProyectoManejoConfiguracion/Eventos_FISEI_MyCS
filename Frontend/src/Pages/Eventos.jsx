import React, { useEffect, useState } from "react";
import "../Styles/Eventos.css";
import "../Styles/Inscripcion.css";
import { FaRegClock, FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import BuscadorEventos from "../Components/BuscadorEventos";
import defaultImg from "../assets/imagen_defecto.jpg";
import cursosimg from '../assets/Cursos.jpg';
import ModalInscripcion from "../Components/modals/Inscripcion";
import { useAuth } from "../auth/AuthContext";

const badgeColor = (tipo) => {
  switch (tipo) {
    case "CONFERENCIAS":
      return "badge-tomato";
    case "CURSO":
      return "badge-blue";
    case "CONGRESO":
      return "badge-yellow";
    case "WEBINAR":
      return "badge-purple";
    case "SOCIALIZACIONES":
      return "badge-red";
    case "TALLERES":
      return "badge-vine";
    case "SEMINARIOS":
      return "badge-greenwatter";
    case "OTROS":
      return "badge-pink";
    case "GRATUITO":
      return "badge-green";
    case "DE PAGO":
      return "badge-tomato";
    default:
      return "badge-default";
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
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSel, setEventoSel] = useState(null);
  const [detalleSel, setDetalleSel] = useState(null);
  const [tarifaSel, setTarifaSel] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      axios.get("https://eventos-fisei-mycs.onrender.com/api/eventos"),
      axios.get("https://eventos-fisei-mycs.onrender.com/api/detalle_eventos"),
      axios.get("https://eventos-fisei-mycs.onrender.com/api/tarifas_evento"),
    ])
      .then(([resEventos, resDetalles, resTarifas]) => {
        setEventos(resEventos.data);
        setDetalles(resDetalles.data);
        setTarifas(resTarifas.data);
        setEventosFiltrados(resEventos.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const eventosCombinados = eventos.map((evt) => {
    const det = detalles.find((d) => d.ID_EVT === evt.ID_EVT) || {};
    return { ...evt, ...det };
  });

  const handleFiltrar = (filtros) => {
    let filtrados = eventosCombinados;
    if (filtros.nombre)
      filtrados = filtrados.filter((e) =>
        e.NOM_EVT?.toLowerCase().includes(filtros.nombre.toLowerCase())
      );
    if (filtros.categoria)
      filtrados = filtrados.filter((e) =>
        (e.CAT_DET || "")
          .toLowerCase()
          .includes(filtros.categoria.toLowerCase())
      );
    if (filtros.area)
      filtrados = filtrados.filter((e) =>
        (e.ARE_DET || "").toLowerCase().includes(filtros.area.toLowerCase())
      );
    if (filtros.horas)
      filtrados = filtrados.filter((e) =>
        String(e.HOR_DET || "").includes(filtros.horas)
      );
    if (filtros.tipo)
      filtrados = filtrados.filter((e) =>
        (e.TIP_EVT || "").toLowerCase().includes(filtros.tipo.toLowerCase())
      );
    setEventosFiltrados(filtrados);
  };

  const getDetalleEvento = (id_evt) =>
    detalles.find((d) => d.ID_EVT === id_evt);
  const getTarifaEvento = (id_evt) =>
    tarifas.filter((t) => t.ID_EVT === id_evt);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="eventos-page">
      <div className="tit-container">
        <div className="tit-section">
          <img src={cursosimg} className="tit-imagen" />
          <div className="hero-overlay"></div>
          <div className="tit-content">
            <h1 className="tit-title">Cursos y Eventos</h1>
            <p className="tit-subtitle">
              Descubre nuestros eventos académicos y cursos especializados de cada
              facultad
            </p>
          </div>
        </div>
      </div>
      <BuscadorEventos onFiltrar={handleFiltrar} />
      <div className="eventos-grid">
        {eventosFiltrados.map((evento) => {
          const detalle = getDetalleEvento(evento.ID_EVT);
          const tarifasEvento = getTarifaEvento(evento.ID_EVT);
          const imagenUrl = evento.FOT_EVT
            ? `https://eventos-fisei-mycs.onrender.com/${evento.FOT_EVT.replace(/\\/g, "/")}`
            : defaultImg;

          return (
            <div className="evento-card" key={evento.ID_EVT}>
              <h2 className="evento-title">{evento.NOM_EVT}</h2>
              <span
                className={`evento-badge ${badgeColor(
                  detalle?.CAT_DET || evento.TIP_EVT
                )}`}
              >
                {detalle?.CAT_DET || evento.TIP_EVT}
              </span>
              <img
                src={imagenUrl}
                alt={evento.NOM_EVT}
                className="evento-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImg;
                }}
                style={{
                  display: "block",
                  margin: "10px auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                }}
              />
              <p className="evento-desc">{evento.DES_EVT}</p>
              <div className="evento-info">
                <span>
                  <i>
                    <FaRegClock />
                  </i>{" "}
                  {evento.FEC_EVT}
                </span>
                <span>
                  <i>
                    <FaLocationDot />
                  </i>{" "}
                  {evento.LUG_EVT}
                </span>
                <span>
                  <i>
                    <FaUsers />
                  </i>{" "}
                  {detalle?.CUP_DET || "N/A"} cupos
                </span>
              </div>
              <div className="evento-tec">
                <b>Área:</b> {detalle?.ARE_DET || "N/A"}
              </div>
              <div className="evento-tec">
                <b>Modalidad:</b> {evento?.MOD_EVT || "N/A"}
              </div>
              <div className="evento-tec">
                <b>Tarifas:</b>
                {tarifasEvento.length > 0 ? (
                  tarifasEvento.map((tarifa, idx) => (
                    <span className="tec-badge" key={idx}>
                      {tarifa.TIP_PAR}: ${tarifa.VAL_EVT}
                    </span>
                  ))
                ) : (
                  <span className="tec-badge">Gratuito</span>
                )}
              </div>
              <div className="evento-actions">
                
                <button
                  className="btn-inscribirse"
                  onClick={() => {
                    setEventoSel({ ...evento, FOT_EVT: imagenUrl });
                    setDetalleSel(detalle);
                    setTarifaSel(tarifasEvento);
                    setModalOpen(true);
                  }}
                >
                  Inscribirse
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <ModalInscripcion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        evento={eventoSel}
        detalle={detalleSel}
        tarifa={tarifaSel}
        usuario={user}
        onInscribir={(data) => {
         
        }}
      />
    </div>
  );
};

export default Eventos;