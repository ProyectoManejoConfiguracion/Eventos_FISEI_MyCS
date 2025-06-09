import React, { useEffect, useState } from "react";
import "../../Styles/Login.css";
import logo from "../../assets/logo.png";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = ({ isOpen, closeModal }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      const loggedUser= await login(email, password);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: "#e8f5e9",
        color: "#2e7d32",
        iconColor: "#4caf50",
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Swal.fire({
        title: "Inicio de sesion Correcto!",
        icon: "success",
        draggable: true,
      }).then(() => {
        if (loggedUser?.role == "Admin") {
          navigate("/Administrador");
          closeModal();
        }else if(loggedUser?.role=="Estudiante"){
          navigate("/Estudiante");
          closeModal();
        }
      });
    } catch (error) {
      console.error(
        "Error en login:",
        error.response?.data || error.message || error
      );
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al iniciar sesión",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
      <div className="overlay" onClick={closeModal} />
      <div className="Container-ModalL">
        <div className="modal-contentL">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-input-container">
              <input
                type="password"
                placeholder="Contraseña"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-forgot-password">
              <a href="#" className="login-forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button className="login-button" onClick={handleLogin}>
              Iniciar Sesión
            </button>
          </div>

          <div className="login-register-container">
            <p className="login-register-text">
              ¿No tienes cuenta?
              <a href="/Registro" className="login-register-link">
                {" "}
                Regístrate
              </a>
              <br />
              <a href="/Restudiante" className="login-register-link">
                {""}
                Regístrate como estudiante
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
