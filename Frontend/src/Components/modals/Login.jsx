import React, { useEffect } from "react";
import '../../Styles/Login.css';
import logo from '../../assets/logo.png';

const Login = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div className="overlay" />
      <div className="Container-Modal">
        <div className="modal-content">
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>

          <div className="login-logo-container">
            <img src={logo} alt="Logo" className="login-logo" />
          </div>

          <h2 className="login-titulo">Iniciar Sesión</h2>

          <div className="login-form">
            <div className="login-input-container">
              <input
                type="text"
                placeholder="Correo electrónico"
                className="login-input"
              />
            </div>

            <div className="login-input-container">
              <input
                type="password"
                placeholder="Contraseña"
                className="login-input"
              />
            </div>

            <div className="login-forgot-password">
              <a href="#" className="login-forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button className="login-button">
              Iniciar Sesión
            </button>
          </div>

          <div className="login-register-container">
            <p className="login-register-text">
              ¿No tienes cuenta?
              <a href="#" className="login-register-link"> Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
