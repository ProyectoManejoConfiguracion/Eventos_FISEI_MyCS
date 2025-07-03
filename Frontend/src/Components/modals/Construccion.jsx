import React from "react";
import "../../Styles/Construccion.css";
import gifConstruccion from "../../assets/modulo.gif"; 

const ModalConstruccion = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="modalCons-overlay">
      <div className="modalCons-content">
        <h2 className="modalCons-title">Módulo en construcción</h2>
        <img
          src={gifConstruccion}
          alt="En construcción"
          className="modalCons-gif"
        />
        <button className="modalCons-close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalConstruccion;