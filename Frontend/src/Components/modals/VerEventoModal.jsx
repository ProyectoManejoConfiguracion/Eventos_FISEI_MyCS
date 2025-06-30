import React from "react";
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaMoneyBillWave, FaGraduationCap, FaBuilding, FaFileAlt } from "react-icons/fa";
import "../../Styles/Eventos.css";
import { BACK_URL } from "../../../config"; 

const VerEventoModal = ({ isOpen, closeModal, evento }) => {
  if (!isOpen || !evento) return null;
  
  // Extraer los detalles correctamente (están en la propiedad 0)
  const detallesEvento = evento[0] || {};

  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificado";
    try {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(fecha).toLocaleDateString('es-ES', options);
    } catch (error) {
      return fecha;
    }
  };

  // Función para generar la URL correcta de la imagen
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http')) return imageUrl;
    
    return `${BACK_URL}/${imageUrl}`;
  };
  
  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999
    }}>
      <div className="modal-container" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1000000
      }}>
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1,
          borderRadius: '8px 8px 0 0'
        }}>
          <h2 style={{ margin: 0 }}>Detalles del Evento</h2>
          <button 
            className="close-button" 
            onClick={closeModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '20px' }}>
          {/* Cabecera con imagen */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h1 style={{ 
              color: '#581517', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {evento.NOM_EVT}
            </h1>
            
            {evento.SUB_EVT && (
              <h3 style={{ 
                color: '#6b7280', 
                fontWeight: '500',
                marginTop: '0',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {evento.SUB_EVT}
              </h3>
            )}
            
            {evento.FOT_EVT && (
              <div style={{ 
                width: '100%',
                maxWidth: '500px',
                maxHeight: '250px',
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <img 
                  src={getImageUrl(evento.FOT_EVT)}
                  alt={evento.NOM_EVT}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Columna izquierda */}
            <div>
              <div className="detalle-seccion">
                <h3 style={{ 
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '8px' 
                }}>
                  Información General
                </h3>
                
                <div className="detalle-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  margin: '15px 0'
                }}>
                  <FaCalendarAlt style={{ color: '#581517' }} />
                  <div>
                    <strong>Fecha:</strong> 
                    <div>{formatearFecha(evento.FEC_EVT)}</div>
                    {evento.FEC_FIN && evento.FEC_FIN !== evento.FEC_EVT && (
                      <div style={{ marginTop: '5px' }}>
                        <strong>Hasta:</strong> {formatearFecha(evento.FEC_FIN)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="detalle-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  margin: '15px 0'
                }}>
                  <FaMapMarkerAlt style={{ color: '#581517' }} />
                  <div>
                    <strong>Lugar:</strong> {evento.LUG_EVT || 'No especificado'}
                  </div>
                </div>
                
                <div className="detalle-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  margin: '15px 0'
                }}>
                  <FaUsers style={{ color: '#581517' }} />
                  <div>
                    <strong>Modalidad:</strong> {evento.MOD_EVT || 'No especificado'}
                  </div>
                </div>
                
                <div className="detalle-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  margin: '15px 0'
                }}>
                  <FaGraduationCap style={{ color: '#581517' }} />
                  <div>
                    <strong>Categoría:</strong> {detallesEvento.CAT_DET || 'No especificado'}
                  </div>
                </div>
                
                <div className="detalle-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  margin: '15px 0'
                }}>
                  <FaMoneyBillWave style={{ color: '#581517' }} />
                  <div>
                    <strong>Tipo:</strong> {evento.TIP_EVT || 'No especificado'}
                  </div>
                </div>
              </div>
              
              {/* Sección de tarifas (si aplica) */}
              {evento.TIP_EVT === "DE PAGO" && evento.tarifas && (
                <div className="detalle-seccion" style={{ marginTop: '20px' }}>
                  <h3 style={{ 
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '8px' 
                  }}>
                    Tarifas
                  </h3>
                  
                  <div className="detalle-item" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    margin: '15px 0'
                  }}>
                    <FaMoneyBillWave style={{ color: '#581517' }} />
                    <div>
                      <strong>Estudiantes:</strong> 
                      {evento.tarifas.ESTUDIANTE ? `$${evento.tarifas.ESTUDIANTE}` : 'No especificado'}
                    </div>
                  </div>
                  
                  {evento.MOD_EVT === "PUBLICO" && evento.tarifas.PERSONA && (
                    <div className="detalle-item" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      margin: '15px 0'
                    }}>
                      <FaMoneyBillWave style={{ color: '#581517' }} />
                      <div>
                        <strong>Público General:</strong> ${evento.tarifas.PERSONA}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Columna derecha */}
            <div>
              <div className="detalle-seccion">
                <h3 style={{ 
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '8px' 
                }}>
                  Requisitos y Detalles
                </h3>
                
                {detallesEvento.CUP_DET && (
                  <div className="detalle-item" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    margin: '15px 0'
                  }}>
                    <FaUsers style={{ color: '#581517' }} />
                    <div>
                      <strong>Cupo:</strong> {detallesEvento.CUP_DET}
                    </div>
                  </div>
                )}
                
                {detallesEvento.CARTA_MOTIVACION && (
                  <div className="detalle-item" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    margin: '15px 0'
                  }}>
                    <FaFileAlt style={{ color: '#581517' }} />
                    <div>
                      <strong>Carta de Motivación:</strong> {detallesEvento.CARTA_MOTIVACION}
                    </div>
                  </div>
                )}
                
                {detallesEvento.NOT_DET && (
                  <div className="detalle-item" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    margin: '15px 0'
                  }}>
                    <FaGraduationCap style={{ color: '#581517' }} />
                    <div>
                      <strong>Nota:</strong> {detallesEvento.NOT_DET}
                    </div>
                  </div>
                )}
                
                {detallesEvento.CERTIFICADO && (
                  <div className="detalle-item" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    margin: '15px 0'
                  }}>
                    <FaFileAlt style={{ color: '#581517' }} />
                    <div>
                      <strong>Certificado:</strong> Sí
                    </div>
                  </div>
                )}
                
                {detallesEvento.ARE_DET && (
                  <div className="detalle-item" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    margin: '15px 0'
                  }}>
                    <FaBuilding style={{ color: '#581517' }} />
                    <div>
                      <strong>Área:</strong> {detallesEvento.ARE_DET}
                    </div>
                  </div>
                )}
                
                {/* Mostrar un mensaje cuando no hay detalles disponibles */}
                {!detallesEvento.CUP_DET && !detallesEvento.HOR_DET && !detallesEvento.CARTA_MOTIVACION && 
                 !detallesEvento.NOT_DET && !detallesEvento.CERTIFICADO && !detallesEvento.ARE_DET && (
                  <div style={{ 
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '20px 0'
                  }}>
                    No hay detalles adicionales para este evento.
                  </div>
                )}
              </div>
              
              {/* Sección de descripción */}
              {evento.DES_EVT && (
                <div className="detalle-seccion" style={{ marginTop: '20px' }}>
                  <h3 style={{ 
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '8px' 
                  }}>
                    Descripción
                  </h3>
                  
                  <div style={{ 
                    margin: '15px 0',
                    lineHeight: '1.6',
                    color: '#4b5563'
                  }}>
                    {evento.DES_EVT}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ 
          padding: '15px 20px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          textAlign: 'right' 
        }}>
          <button 
            onClick={closeModal}
            style={{
              padding: '8px 16px',
              backgroundColor: '#581517',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerEventoModal;