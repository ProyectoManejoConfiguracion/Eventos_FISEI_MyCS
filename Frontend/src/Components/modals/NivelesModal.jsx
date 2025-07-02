import React from "react";
import "../../Styles/ModalNivel.css"; 

const NivelesModal = ({ 
  show, 
  onClose, 
  carrera, 
  niveles, 
  selectedNiveles, 
  onNivelSelection, 
  onSelectAll, 
  onDeselectAll, 
  onSave 
}) => {
  if (!show || !carrera) return null;
  
  const nivelesCarrera = niveles.filter(nivel => nivel.ID_CAR === carrera.ID_CAR);
  const selected = selectedNiveles[carrera.ID_CAR] || [];
  
  // Evitar propagación del clic para que no cierre el modal principal
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999999, // Z-index extremadamente alto
        backdropFilter: 'blur(3px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          width: '90%',
          maxWidth: '400px',
          padding: '24px',
          position: 'relative',
          zIndex: 10000000 // Z-index aún más alto
        }}
        onClick={handleContainerClick}
      >
        <button 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#6b7280',
            cursor: 'pointer'
          }} 
          onClick={onClose}
        >
          ×
        </button>
        
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '16px',
          textAlign: 'center',
          color: '#1f2937'
        }}>
          Seleccionar Niveles para {carrera.NOM_CAR}
        </h3>
        
        <div style={{
          marginBottom: '20px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '15px'
          }}>
            <button 
              style={{
                padding: '8px 12px',
                backgroundColor: '#581517',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={onSelectAll}
            >
              Seleccionar Todos
            </button>
            <button 
              style={{
                padding: '8px 12px',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={onDeselectAll}
            >
              Deseleccionar Todos
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {nivelesCarrera.length > 0 ? (
              nivelesCarrera.map((nivel) => (
                <label 
                  key={nivel.ID_NIV} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    value={nivel.ID_NIV}
                    checked={selected.includes(nivel.ID_NIV)}
                    onChange={() => onNivelSelection(nivel.ID_NIV)}
                    style={{
                      marginRight: '10px',
                      width: '18px',
                      height: '18px',
                      accentColor: '#581517'
                    }}
                  />
                  <span style={{
                    fontSize: '15px',
                    color: '#1f2937'
                  }}>
                    {nivel.NOM_NIV}
                  </span>
                </label>
              ))
            ) : (
              <p style={{
                textAlign: 'center',
                color: '#6b7280',
                padding: '20px 0'
              }}>
                No hay niveles disponibles para esta carrera.
              </p>
            )}
          </div>
        </div>
        
        <button 
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#581517',
            color: 'white',
            fontWeight: '500',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={onSave}
        >
          Guardar Selección
        </button>
      </div>
    </div>
  );
};

export default NivelesModal;