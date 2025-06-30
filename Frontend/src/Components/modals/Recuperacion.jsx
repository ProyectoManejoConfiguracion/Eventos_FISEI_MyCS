// PasswordRecoveryModal.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import "../../Styles/Login.css";
import { BACK_URL } from "../../../config";

export default function Recuperacion({ isOpen, onClose }) {
  const [emailRec, setEmailRec] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACK_URL}/api/auth/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailRec })
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Listo!",
          text: "Revisa tu correo para restablecer la contraseña."
        });
        onClose();
      } else {
        const err = await res.json();
        Swal.fire("Error", err.message || "Algo falló", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el correo", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="Container-ModalL">
        <div className="modal-contentL">
          <button className="close-button" onClick={onClose}>&times;</button>
          <h2 className="login-titulo">Recuperar Contraseña</h2>
          <div className="login-form">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="login-input"
              value={emailRec}
              onChange={e => setEmailRec(e.target.value)}
            />
            <button
              className="login-button"
              onClick={handleSend}
              disabled={!emailRec}        // opcional: deshabilita si está vacío
            >
              Enviar enlace
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
