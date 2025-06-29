import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaUser, FaClipboardCheck, FaStar, FaImage } from "react-icons/fa";
import "../../Styles/ModalDetalles.css";
import { BACK_URL } from "../../../config";
import { useAuth } from "../../auth/AuthContext";

const ModalDetalles = ({ show, item, onClose }) => {
  const { user } = useAuth();
  const [notaData, setNotaData] = useState(null);
  const [docenteData, setDocenteData] = useState(null);
  const [detalleEvento, setDetalleEvento] = useState(null);
  const [loadingNota, setLoadingNota] = useState(false);
  const [loadingDocente, setLoadingDocente] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [asistenciaCertificado, setAsistenciaCertificado] = useState(null);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);

  const obtenerNota = useCallback(async () => {
    if (!user?.id || !item) return;
    
    const evento = item.detalles || item.curso || item;
    const eventoId = evento.id || evento.ID_EVT;
    const nombre = evento.nombre || evento.NOM_EVT;
    
    if (!eventoId && !nombre) return;
    setLoadingNota(true);
    try {
      const response = await fetch(`${BACK_URL}/api/notas/${user.id}`);
      if (response.ok) {
        const notas = await response.json();
        
        if (!Array.isArray(notas)) {
          setNotaData(null);
          return;
        }
        
        const notaEvento = notas.find(nota => {
          if (eventoId && nota.id === eventoId) return true;
          if (nombre && nota.nombre && 
              nota.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()) return true;
          if (evento.NOM_EVT && nota.nombre && 
              nota.nombre.toLowerCase().trim() === evento.NOM_EVT.toLowerCase().trim()) return true;
          if (nombre && nota.nombre && 
              nota.nombre.toLowerCase().includes(nombre.toLowerCase())) return true;
          return false;
        });
        
        setNotaData(notaEvento || null);
      } else {
        setNotaData(null);
      }
    } catch (error) {
      console.error('Error al cargar nota:', error);
      setNotaData(null);
    } finally {
      setLoadingNota(false);
    }
  }, [user?.id, item]);

  const obtenerDetalleYDocente = useCallback(async () => {
    if (!item) return;
    
    const evento = item.detalles || item.curso || item;
    const eventoId = evento.id || evento.ID_EVT;
    
    if (!eventoId) return;
    
    setLoadingDocente(true);
    try {
      const detalleResponse = await fetch(`${BACK_URL}/api/detalle_eventos/${eventoId}`);
      
      if (detalleResponse.ok) {
        const detalles = await detalleResponse.json();
        
        let detalleEvento = null;
        
        if (Array.isArray(detalles)) {
          // Filtrar por el evento específico
          const detallesDelEvento = detalles.filter(detalle => detalle.ID_EVT === eventoId);
          
          if (detallesDelEvento.length > 0) {
            // Tomar el primer detalle del evento
            detalleEvento = detallesDelEvento[0];
            console.log(`📋 Encontrados ${detallesDelEvento.length} detalles para el evento ${eventoId}`);
            console.log('📋 Usando el primer detalle:', detalleEvento);
          }
        } else {
          detalleEvento = detalles;
        }
        
        setDetalleEvento(detalleEvento);
        
        if (detalleEvento?.CED_AUT) {
          const docenteResponse = await fetch(`${BACK_URL}/api/autoridades/cedula/${detalleEvento.CED_AUT}`);
          
          if (docenteResponse.ok) {
            const docenteInfo = await docenteResponse.json();
            setDocenteData(docenteInfo);
          } else {
            setDocenteData(null);
          }
        } else {
          setDocenteData(null);
        }
      } else {
        setDetalleEvento(null);
        setDocenteData(null);
      }
    } catch (error) {
      console.error('Error al cargar detalle del evento o docente:', error);
      setDetalleEvento(null);
      setDocenteData(null);
    } finally {
      setLoadingDocente(false);
    }
  }, [item]);

  // Nueva función para obtener la asistencia desde certificado
  const obtenerAsistenciaCertificado = useCallback(async () => {
    if (!user?.id || !item || !detalleEvento?.ID_DET) return;
    setLoadingAsistencia(true);
    try {
      const response = await fetch(`${BACK_URL}/api/certificado/asistencia/${user.id}/${detalleEvento.ID_DET}`);
      if (response.ok) {
        const data = await response.json();
        // data puede ser un array con un objeto { asistencia: { ... } }
        if (Array.isArray(data) && data.length > 0 && data[0].asistencia) {
          setAsistenciaCertificado(data[0].asistencia);
        } else {
          setAsistenciaCertificado(null);
        }
      } else {
        setAsistenciaCertificado(null);
      }
    } catch (error) {
      console.error('Error al cargar asistencia certificado:', error);
      setAsistenciaCertificado(null);
    } finally {
      setLoadingAsistencia(false);
    }
  }, [user?.id, item, detalleEvento]);

  useEffect(() => {
    if (show && item) {
      obtenerNota();
      obtenerDetalleYDocente();
      setImageError(false);
    } else if (!show) {
      setNotaData(null);
      setDocenteData(null);
      setDetalleEvento(null);
      setAsistenciaCertificado(null);
      setLoadingNota(false);
      setLoadingDocente(false);
      setLoadingAsistencia(false);
      setImageError(false);
    }
  }, [show, item, obtenerNota, obtenerDetalleYDocente]);

  // Nuevo useEffect para asistencia certificado
  useEffect(() => {
    if (show && item && detalleEvento?.ID_DET) {
      obtenerAsistenciaCertificado();
    }
  }, [show, item, detalleEvento, obtenerAsistenciaCertificado]);

  if (!show || !item) return null;

  const evento = item.detalles || item.curso || item;
  const nombre = evento.nombre || evento.NOM_EVT || 'Sin nombre';
  const descripcion = evento.descripcion || evento.DES_EVT || 'Sin descripción';
  
  // Obtener información del docente
  const getDocenteInfo = () => {
    if (loadingDocente) return 'Cargando...';
    if (docenteData?.CED_PER_PERSONA) {
      const { NOM_PER, APE_PER } = docenteData.CED_PER_PERSONA;
      return `${NOM_PER} ${APE_PER}`;
    }
    return evento.docente || evento.instructor || 'No asignado';
  };

  const docente = getDocenteInfo();
  const asistencia = item.asistencia || evento.asistencia || 'No registrada';

  const getImageUrl = () => {
    if (evento.FOT_EVT) {
      if (evento.FOT_EVT.startsWith('http')) {
        return evento.FOT_EVT;
      }
      return `${BACK_URL}/${evento.FOT_EVT.replace(/\\/g, "/")}`;
    }
    return null;
  };

  const imagenUrl = getImageUrl();

  const handleImageError = () => {
    setImageError(true);
  };

  const getNota = () => {
    if (loadingNota) return 'Cargando...';
    if (notaData?.nota !== null && notaData?.nota !== undefined) {
      return typeof notaData.nota === 'string' ? notaData.nota : notaData.nota.toString();
    }
    return 'Sin calificar';
  };

  const nota = getNota();

  // Render para asistencia certificado
  const renderAsistenciaCertificado = () => {
    if (loadingAsistencia) {
      return (
        <span className="modal-dato-valor loading">Cargando...</span>
      );
    }
    if (asistenciaCertificado) {
      return (
        <span className="modal-dato-valor asistencia-valor">
          {`${asistenciaCertificado.dias_asistidos} / ${asistenciaCertificado.dias_totales} días (${asistenciaCertificado.porcentaje}%)`}
        </span>
      );
    }
    return (
      <span className="modal-dato-valor">No registrada</span>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{nombre}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-imagen-container">
            {imagenUrl && !imageError ? (
              <img 
                src={imagenUrl} 
                alt={nombre}
                className="modal-imagen"
                onError={handleImageError}
              />
            ) : (
              <div className="modal-imagen-placeholder-styled">
                <FaImage className="placeholder-icon-styled" />
                <span className="placeholder-text-styled">{nombre}</span>
              </div>
            )}
          </div>

          <div className="modal-info">
            <div className="modal-section">
              <h3>Descripción</h3>
              <p className="modal-descripcion">{descripcion}</p>
            </div>

            <div className="modal-datos-grid">
              <div className="modal-dato">
                <div className="modal-dato-header">
                  <FaUser className="modal-icon" />
                  <span className="modal-dato-label">Docente</span>
                </div>
                <span className={`modal-dato-valor ${loadingDocente ? 'loading' : ''}`}>
                  {docente}
                </span>
              </div>

              <div className="modal-dato">
                <div className="modal-dato-header">
                  <FaStar className="modal-icon" />
                  <span className="modal-dato-label">Nota</span>
                </div>
                <span className={`modal-dato-valor ${
                  loadingNota ? 'loading' : 
                  (nota !== 'Sin calificar' && nota !== 'Cargando...') ? 'nota-valor' : ''
                }`}>
                  {nota}
                </span>
              </div>

              <div className="modal-dato">
                <div className="modal-dato-header">
                  <FaClipboardCheck className="modal-icon" />
                  <span className="modal-dato-label">Asistencia</span>
                </div>
                {renderAsistenciaCertificado()}
              </div>

              {/* Información adicional del detalle del evento */}
              {detalleEvento?.HOR_DET && (
                <div className="modal-dato">
                  <div className="modal-dato-header">
                    <FaClipboardCheck className="modal-icon" />
                    <span className="modal-dato-label">Duracion</span>
                  </div>
                  <span className="modal-dato-valor">
                    {detalleEvento.HOR_DET} horas
                  </span>
                </div>
              )}

              {notaData?.fechaFinalizacion && (
                <div className="modal-dato">
                  <div className="modal-dato-header">
                    <FaStar className="modal-icon" />
                    <span className="modal-dato-label">Fecha de Finalización</span>
                  </div>
                  <span className="modal-dato-valor">
                    {new Date(notaData.fechaFinalizacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalles;