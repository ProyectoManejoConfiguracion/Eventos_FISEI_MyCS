import React from 'react'
import logo from '../assets/logo.png' ;
import '../styles/Header.css' ;
import { Link } from 'react-router-dom';
import { FaUserAlt } from "react-icons/fa";

const Header = () => {
  return (
    <header className='header'>
        <div className='header__container'>
            <img src={logo} className='logo'/>
        
        <nav className='header__nav'>
            <ul className='header__nav-list'>
                <ul className='header__nav-list'>
                      <li><Link className='header__nav-item' to="/">Inicio</Link></li>
                      <li><Link className='header__nav-item' to="/Eventos">Eventos</Link></li>
                      <li><Link className='header__nav-item' to="/Nosotros">Nosotros</Link></li>
                      <li><Link className='header__nav-item' to="/Contactos">Contactos</Link></li>
                </ul>

            </ul>
        </nav>
        <div className='container-botton'>
<button className='btn_Loging'> <FaUserAlt  size={18} color="white" className='btn-icon' />  Iniciar Sesion</button>
        </div>
        
        
       
</div>


    </header>
  )
}

export default Header