import React, { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from '../../auth/AuthContext';
import axios from "axios";
import { BACK_URL } from "../../../config.js"; 

const ModalInscripcion = ({
  isOpen,
  onClose,
  evento,
  detalle,
  tarifa,
  usuario,
  onInscribir,
}) => {
  const [metodoPago, setMetodoPago] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const { user } = useAuth(); 

  if (!isOpen || !evento) return null;

  const cupos = detalle?.CUP_DET || 0;
  const esGratis = !tarifa || tarifa.length === 0 || tarifa[0].VAL_EVT === 0;

  const handleInscribir = async () => {
    if (!user?.id) {
      Swal.fire("No autenticado", "Debes iniciar sesión para inscribirte.", "info").then(() => {
        onClose();
      });
      return;
    }
    if (cupos <= 0) {
      Swal.fire("Sin cupos", "No hay cupos disponibles.", "error");
      return;
    }
    if (!usuario?.name || !usuario?.lastname || !usuario?.email) {
      Swal.fire("Datos incompletos", "Completa tus datos antes de inscribirte.", "warning");
      return;
    }
    if (!esGratis && !metodoPago) {
      Swal.fire("Método de pago", "Selecciona un método de pago.", "warning");
      return;
    }
    if (metodoPago === "transferencia" && !comprobante) {
      Swal.fire("Comprobante", "Sube el comprobante de pago.", "warning");
      return;
    }

    try {
      await axios.post(`${BACK_URL}/api/registro_personas/register/`, {
      cedula: user.id,
      idEvento: evento.ID_EVT
      });
      Swal.fire("Inscrito", "Te has inscrito correctamente.", "success");
      onInscribir && onInscribir({ metodoPago, comprobante });
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      Swal.fire("Error", `No se pudo inscribir. ${errorMsg}`, "error");
    }
  };

  return (
    <div className="modal-inscripcion">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose} title="Cerrar">×</button>
        <h2>{evento.NOM_EVT}</h2>
        <img src={evento.FOT_EVT} alt={evento.NOM_EVT} />
        <ul className="modal-info-list">
          <li><b>Fecha:</b> {evento.FEC_EVT}</li>
          <li><b>Hora:</b> {evento.HOR_EVT || "N/A"}</li>
          <li><b>Precio:</b> {esGratis ? <span style={{color:'#27ae60'}}>Gratis</span> : `$${tarifa[0]?.VAL_EVT}`}</li>
          <li><b>Cupos disponibles:</b> {cupos}</li>
        </ul>
        {!esGratis && (
          <>
            <div className="metodo-pago-group">
              <label>
                <input
                  type="radio"
                  value="efectivo"
                  checked={metodoPago === "efectivo"}
                  onChange={e => setMetodoPago(e.target.value)}
                />
                Efectivo
              </label>
              <label>
                <input
                  type="radio"
                  value="transferencia"
                  checked={metodoPago === "transferencia"}
                  onChange={e => setMetodoPago(e.target.value)}
                />
                Transferencia
              </label>
            </div>
            {metodoPago === "transferencia" && (
              <div className="input-comprobante">
                <label style={{fontSize:'0.97rem',marginBottom:'0.3rem'}}>Sube comprobante:</label>
                <input type="file" accept="image/*,application/pdf" onChange={e => setComprobante(e.target.files[0])} />
              </div>
            )}
          </>
        )}
        <button className="btn-inscribir-modal" onClick={handleInscribir}>Inscribirse</button>
      </div>
    </div>
  );
};

export default ModalInscripcion;