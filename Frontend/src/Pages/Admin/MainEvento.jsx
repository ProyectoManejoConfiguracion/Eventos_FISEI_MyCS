import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalEvento from "./RegistrarEventos";
import EditEvento from "./EditEvento";
import VerEventoModal from "../../Components/modals/VerEventoModal";
import "../../Styles/Eventos.css";
import { FaPlus, FaTrashAlt, FaEye, FaEdit, FaInfoCircle, FaChevronDown, FaChevronUp, FaRecycle, FaUser, FaClock } from "react-icons/fa";
import { BACK_URL } from "../../../config";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const MainEvento = () => {
  const [eventos, setEventos] = useState([]);
  const [detallesEventos, setDetallesEventos] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVerModalOpen, setIsVerModalOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoVisibles, setShowNoVisibles] = useState(false);

  useEffect(() => {
    obtenerEventos();
    obtenerDetallesEventos();
  }, []);

  const obtenerEventos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACK_URL}/api/eventos`);
      setEventos(res.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      setError("No se pudieron cargar los eventos. Intente nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerDetallesEventos = async () => {
    try {
      const res = await axios.get(`${BACK_URL}/api/detalle_eventos`);
      
      // Convertir el array a un objeto con ID_EVT como clave para acceso más rápido
      const detallesObj = {};
      res.data.forEach(detalle => {
        detallesObj[detalle.ID_EVT] = detalle;
      });
      
      setDetallesEventos(detallesObj);
    } catch (error) {
      console.error("Error al obtener detalles de eventos:", error);
    }
  };

  const cambiarVisibilidadEvento = async (id, nuevoEstado) => {
    const accion = nuevoEstado === "VISIBLE" ? "recuperar" : "eliminar";
    const confirmar = window.confirm(
      `¿Estás seguro de ${accion} este evento?`
    );
    if (!confirmar) return;

    try {
      // Actualizado para usar PUT en lugar de PATCH y la ruta correcta
      await axios.put(`${BACK_URL}/api/eventos/visibilidad/${id}`, { EST_VIS: nuevoEstado });
      obtenerEventos(); 
      obtenerDetallesEventos();
      alert(`Evento ${accion === "recuperar" ? "recuperado" : "eliminado"} con éxito`);
    } catch (error) {
      console.error(`Error al ${accion} evento:`, error);
      alert(`Error al ${accion} el evento. Intente nuevamente.`);
    }
  };

  const eliminarEvento = async (id) => {
    await cambiarVisibilidadEvento(id, "NO VISIBLE");
  };

  const recuperarEvento = async (id) => {
    await cambiarVisibilidadEvento(id, "VISIBLE");
  };

  const cargarDatosEvento = async (evento) => {
    try {
      // Obtener detalles específicos para este evento
      let detalle = {};
      try {
        const detalleResponse = await axios.get(`${BACK_URL}/api/detalle_eventos/${evento.ID_EVT}`);
        detalle = detalleResponse.data;
      } catch (err) {
        console.log("No se encontraron detalles para este evento", err);
      }

      // Obtener tarifas para este evento si es de pago
      let tarifas = {};
      if (evento.TIP_EVT === "DE PAGO") {
        try {
          const tarifasResponse = await axios.get(`${BACK_URL}/api/tarifas_evento/evento/${evento.ID_EVT}`);
          
          tarifasResponse.data.forEach(tarifa => {
            if (tarifa.TIP_PAR === "ESTUDIANTE") {
              tarifas.ESTUDIANTE = tarifa.VAL_EVT;
            } else if (tarifa.TIP_PAR === "PERSONA") {
              tarifas.PERSONA = tarifa.VAL_EVT;
            }
          });
        } catch (err) {
          console.log("No se encontraron tarifas para este evento", err);
        }
      }
      
      // Intentar obtener carreras y niveles asociados al evento (si tiene)
      let carrerasNiveles = { carreras: [], niveles: {} };
      try {
        const carrerasNivelesResponse = await axios.get(`${BACK_URL}/api/registro_evento/detalle/${evento.ID_EVT}`);
        if (carrerasNivelesResponse.data) {
          carrerasNiveles = carrerasNivelesResponse.data;
        }
      } catch (err) {
        console.log("No se encontraron carreras/niveles para este evento");
      }

      // Crear objeto unificado con todos los datos
      const eventoCompleto = {
        ...evento,
        ...detalle,
        tarifas,
        carrerasNiveles
      };
      
      return eventoCompleto;
    } catch (error) {
      console.error("Error al cargar datos del evento:", error);
      throw error;
    }
  };

  const abrirModalEdicion = async (evento) => {
    try {
      const eventoCompleto = await cargarDatosEvento(evento);
      setEventoSeleccionado(eventoCompleto);
      setIsEditModalOpen(true);
    } catch (error) {
      alert("Error al cargar los detalles del evento. Intente nuevamente.");
    }
  };

  const abrirModalVer = async (evento) => {
    try {
      const eventoCompleto = await cargarDatosEvento(evento);
      setEventoSeleccionado(eventoCompleto);
      setIsVerModalOpen(true);
    } catch (error) {
      alert("Error al cargar los detalles del evento. Intente nuevamente.");
    }
  };

  const abrirModalRegistro = () => {
    setIsModalOpen(true);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    try {
      return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return fecha;
    }
  };

  const getTipoEvento = (tipo) => {
    return tipo === "GRATUITO" ? 
      <span className="badge badge-success">Gratuito</span> : 
      <span className="badge badge-warning">De Pago</span>;
  };

  const getModalidadEvento = (modalidad) => {
    return modalidad === "PUBLICO" ? 
      <span className="badge badge-info">Público</span> : 
      <span className="badge badge-secondary">Privado</span>;
  };

  // Filtrar eventos por visibilidad
  const eventosVisibles = eventos.filter(evento => 
    evento.EST_VIS === "VISIBLE" || !evento.EST_VIS
  );
  
  const eventosNoVisibles = eventos.filter(evento => 
    evento.EST_VIS === "NO VISIBLE"
  );

  if (loading) {
    return <div className="loading-spinner">Cargando eventos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="eventos-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Gestión de Eventos</h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-end',
          fontSize: '14px',
          color: '#6b7280'
        }}>
        </div>
      </div>

      <div className="btn-container">
        <button 
          className="btn-registrar" 
          onClick={abrirModalRegistro} 
          type="button"
        >
          <FaPlus className="icon-plus" /> Registrar nuevo evento
        </button>
      </div>

      {eventosVisibles.length === 0 && eventosNoVisibles.length === 0 ? (
        <div className="no-eventos">
          <p>No hay eventos registrados. ¡Comienza creando uno nuevo!</p>
        </div>
      ) : (
        <>
          {/* Tabla de eventos visibles */}
          <div className="table-responsive">
            {eventosVisibles.length === 0 ? (
              <div className="no-eventos">
                <p>No hay eventos activos</p>
              </div>
            ) : (
              <table className="tabla-eventos">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Lugar</th>
                    <th>Tipo</th>
                    <th>Modalidad</th>
                    <th>Categoría</th>
                    <th className="acciones-columna">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosVisibles.map((evento) => {
                    const detalle = detallesEventos[evento.ID_EVT] || {};
                    
                    return (
                      <tr className="fila-evento" key={evento.ID_EVT}>
                        <td>
                          <div className="evento-titulo">
                            {evento.NOM_EVT}
                            <div className="evento-subtitulo">{evento.SUB_EVT}</div>
                          </div>
                        </td>
                        <td>
                          <div className="evento-fechas">
                            <div>{formatearFecha(evento.FEC_EVT)}</div>
                            {evento.FEC_FIN && evento.FEC_FIN !== evento.FEC_EVT && (
                              <div className="fecha-fin">hasta {formatearFecha(evento.FEC_FIN)}</div>
                            )}
                          </div>
                        </td>
                        <td>{evento.LUG_EVT}</td>
                        <td>{getTipoEvento(evento.TIP_EVT)}</td>
                        <td>{getModalidadEvento(evento.MOD_EVT)}</td>
                        <td>{detalle.CAT_DET || "N/A"}</td>
                        
                        <td className="acciones-columna">
                          <div className="acciones-container">
                            <button
                              className="btn-ver"
                              onClick={() => abrirModalVer(evento)}
                              title="Ver detalles"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="btn-editar"
                              onClick={() => abrirModalEdicion(evento)}
                              title="Editar evento"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn-eliminar"
                              onClick={() => eliminarEvento(evento.ID_EVT)}
                              title="Eliminar evento"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Sección para eventos no visibles (desplegable) */}
          {eventosNoVisibles.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '10px 15px',
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  marginBottom: showNoVisibles ? '15px' : '0',
                  cursor: 'pointer'
                }}
                onClick={() => setShowNoVisibles(!showNoVisibles)}
              >
                <h3 style={{ margin: '0', fontSize: '16px' }}>
                  Eventos Archivados ({eventosNoVisibles.length})
                </h3>
                <button 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}
                >
                  {showNoVisibles ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
              
              {showNoVisibles && (
                <div className="table-responsive">
                  <table className="tabla-eventos">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Lugar</th>
                        <th>Tipo</th>
                        <th>Modalidad</th>
                        <th>Categoría</th>
                        <th className="acciones-columna">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventosNoVisibles.map((evento) => {
                        const detalle = detallesEventos[evento.ID_EVT] || {};
                        
                        return (
                          <tr 
                            className="fila-evento" 
                            key={evento.ID_EVT}
                            style={{ backgroundColor: '#f9fafb' }}
                          >
                            <td>
                              <div className="evento-titulo">
                                {evento.NOM_EVT}
                                <div className="evento-subtitulo">{evento.SUB_EVT}</div>
                              </div>
                            </td>
                            <td>
                              <div className="evento-fechas">
                                <div>{formatearFecha(evento.FEC_EVT)}</div>
                                {evento.FEC_FIN && evento.FEC_FIN !== evento.FEC_EVT && (
                                  <div className="fecha-fin">hasta {formatearFecha(evento.FEC_FIN)}</div>
                                )}
                              </div>
                            </td>
                            <td>{evento.LUG_EVT}</td>
                            <td>{getTipoEvento(evento.TIP_EVT)}</td>
                            <td>{getModalidadEvento(evento.MOD_EVT)}</td>
                            <td>{detalle.CAT_DET || "N/A"}</td>
                            
                            <td className="acciones-columna">
                              <div className="acciones-container">
                                <button
                                  className="btn-ver"
                                  onClick={() => abrirModalVer(evento)}
                                  title="Ver detalles"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="btn-recuperar"
                                  onClick={() => recuperarEvento(evento.ID_EVT)}
                                  title="Recuperar evento"
                                  style={{
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <FaRecycle />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {isModalOpen && (
        <ModalEvento
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          onSave={() => {
            obtenerEventos();
            obtenerDetallesEventos();
          }}
        />
      )}

      {isEditModalOpen && eventoSeleccionado && (
        <EditEvento
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          eventoSeleccionado={eventoSeleccionado}
          onSave={() => {
            obtenerEventos();
            obtenerDetallesEventos();
          }}
        />
      )}

      {isVerModalOpen && eventoSeleccionado && (
        <VerEventoModal
          isOpen={isVerModalOpen}
          closeModal={() => setIsVerModalOpen(false)}
          evento={eventoSeleccionado}
        />
      )}
    </div>
  );
};

export default MainEvento;