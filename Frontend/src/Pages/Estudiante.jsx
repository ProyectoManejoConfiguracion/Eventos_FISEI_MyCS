import React from "react";
import logo from "../assets/logo.png";
import { FaUserAlt } from "react-icons/fa";
import "../Styles/Estudiante.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { MdWavingHand } from "react-icons/md";
const Estudiante = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Queres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      logout();
      await Swal.fire({
        title: "Sesión cerrada",
        text: "Has cerrado sesión exitosamente.",
        icon: "success",
      });
      navigate("/");
    }
  };
  return (
    <div className="estudiante-container">
      <header className="estudiante-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <div>
            <h1 className="dashboard-title">Bienvenido al Aula Virtual</h1>
            <p className="welcome-text">
              <MdWavingHand /> Hola, {user?.name} {user?.lastname}
            </p>
          </div>
        </div>
        <div className="header-right">
         
          <button className="logout-btn" onClick={handleLogout}>
            <FaUserAlt size={16} color="white" />
            Cerrar Sesión
          </button>
        </div>
      </header>
    </div>
  );
};

export default Estudiante;
