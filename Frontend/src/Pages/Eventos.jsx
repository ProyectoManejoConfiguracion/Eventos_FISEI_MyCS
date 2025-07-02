import React, { useEffect, useState, useCallback } from "react";
import "../Styles/Eventos.css";
import "../Styles/Inscripcion.css";
import { FaRegClock, FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import BuscadorEventos from "../Components/BuscadorEventos";
import cursosimg from "../assets/Cursos.jpg";
import ModalInscripcion from "../Components/modals/Inscripcion";
import { useAuth } from "../auth/AuthContext";
import { BACK_URL } from "../../config";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  const [homeEventInfo, setHomeEventInfo] = useState({
    imagen: null,
    titulo: "",
    descripcion: "",
  });

  // Función para formatear URL de imágenes
  const formatImageUrl = useCallback((path) => {
    if (!path) return null;
    // Prevenir doble formateo
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `${BACK_URL}/${path.replace(/\\/g, "/")}`;
  }, []);

  // Cargar información de la página de inicio - solo una vez
  useEffect(() => {
    axios
      .get(`${BACK_URL}/api/home?section=eventos`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const registro = res.data[0];
          setHomeEventInfo({
            imagen: registro.imagen ? formatImageUrl(registro.imagen) : null,
            titulo: registro.titulo || "",
            descripcion: registro.descripcion || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar información de home:", error);
        setHomeEventInfo({
          imagen: null,
          titulo: "",
          descripcion: "",
        });
      });
  }, []); // Sin dependencias para evitar recargas

  // Cargar datos de eventos - solo una vez
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEventos, resDetalles, resTarifas] = await Promise.all([
          axios.get(`${BACK_URL}/api/eventos`),
          axios.get(`${BACK_URL}/api/detalle_eventos`),
          axios.get(`${BACK_URL}/api/tarifas_evento`),
        ]);

        // No modificar las URLs aquí, solo guardar los datos originales
        setEventos(resEventos.data);
        setDetalles(resDetalles.data);
        setTarifas(resTarifas.data);
        setEventosFiltrados(resEventos.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Sin dependencias para cargar solo una vez

  // Manejar el evento seleccionado desde la navegación
  useEffect(() => {
    if (location.state && location.state.eventoSeleccionado && !modalOpen) {
      const evento = location.state.eventoSeleccionado;
      const detalle = getDetalleEvento(evento.ID_EVT);
      const tarifasEvento = getTarifaEvento(evento.ID_EVT);

      // Evitar modificar FOT_EVT, solo pasar el objeto tal como está
      setEventoSel(evento);
      setDetalleSel(detalle);
      setTarifaSel(tarifasEvento);
      setModalOpen(true);

      // Limpiar el estado de location para evitar reaperturas
      window.history.replaceState({}, document.title);
    }
  }, [location.state, modalOpen]);

  const getDetalleEvento = useCallback(
    (id_evt) => detalles.find((d) => d.ID_EVT === id_evt),
    [detalles]
  );

  const getTarifaEvento = useCallback(
    (id_evt) => tarifas.filter((t) => t.ID_EVT === id_evt),
    [tarifas]
  );

  const eventosCombinados = eventos.map((evt) => {
    const det = detalles.find((d) => d.ID_EVT === evt.ID_EVT) || {};
    return { ...evt, ...det };
  });

  const handleFiltrar = useCallback(
    (filtros) => {
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
    },
    [eventosCombinados]
  );

  const openModal = useCallback((evento, detalle, tarifas) => {
    setEventoSel(evento);
    setDetalleSel(detalle);
    setTarifaSel(tarifas);
    setModalOpen(true);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="eventos-page">
      <div className="tit-container">
        <div className="tit-section">
          <img
            src={homeEventInfo.imagen || cursosimg}
            className="tit-imagen"
            alt="Imagen principal eventos"
          />
          <div className="hero-overlay"></div>
          <div className="tit-content">
            <h1 className="tit-title">
              {homeEventInfo.titulo || "Cursos y Eventos"}
            </h1>
            <p className="tit-subtitle">
              {homeEventInfo.descripcion ||
                "Descubre nuestros eventos académicos y cursos especializados de cada facultad"}
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
            ? formatImageUrl(evento.FOT_EVT)
            : "/placeholder-image.jpg";

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
                  if (!e.target.src.endsWith("/1749487325571-234972478.jpeg")) {
                    e.target.src = "/1749487325571-234972478.jpeg";
                  }
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
                  onClick={() => openModal(evento, detalle, tarifasEvento)}
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
        onInscribir={() => {}}
      />
    </div>
  );
};

export default Eventos;
