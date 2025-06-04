import React from 'react'
import logo from "../assets/logo.png";
import "../Styles/Administrador.css";
import { useAuth } from "../auth/AuthContext";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaHome,FaUser,FaBook,FaCalendar, FaGlobe, FaCog,FaUserAlt  } from "react-icons/fa";

const Administrador = () => {
   const { user, logout } = useAuth();
       const navigate = useNavigate();

     const handleLogout = async () => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            logout(); // ejecuta la función de cerrar sesión
            await Swal.fire({
                title: "Sesión cerrada",
                text: "Has cerrado sesión exitosamente.",
                icon: "success"
            });
             navigate('/');
             
           
        }
    };
  return (
    <div className="sidebar">
      <div className='sidebar-header'>
         <img src={logo} alt="Logo" className="login-logo" />
         <p className='subtitle'>Panel de Control</p>
    
      </div>
      <nav className='sidebar-navbar'>
        <ul className='sidebar-navbar_item'>
          <li className='navbar_items'> <FaHome className="nav-icon" />Vista General </li>
          <li className='navbar_items'><FaUser className="nav-icon" />Usuarios</li>
          <li className='navbar_items'><FaBook className="nav-icon" />Cursos</li>
           <li className='navbar_items'><FaCalendar className="nav-icon" />Eventos</li>
           <li className='navbar_items'><FaGlobe className="nav-icon" />Contenido Web</li>
            <li className='navbar_items'><FaCog className="nav-icon" />Configuracion</li>
        </ul>

      </nav>
      <button className='btn_Logout' onClick={handleLogout}> <FaUserAlt size={20} color="white" />  Cerrar Sesion</button>





    </div>
  )
}

export default Administrador