import React from 'react'
import logo from '../assets/logo.png' ;
import '../styles/Header.css' ;
import { FaUserAlt } from "react-icons/fa";

const Header = () => {
  return (
    <header className='header'>
        <div className='header__container'>
            <img src={logo} className='logo'/>
        
        <nav className='header__nav'>
            <ul className='header__nav-list'>
                <li className='header__nav-item'>Inicio</li>
                <li className='header__nav-item'>Eventos</li>
                <li className='header__nav-item'>Nosotros</li>
                <li className='header__nav-item'>Contactos</li>
            </ul>
        </nav>
        <button className='btn_Loging'> <FaUserAlt size={20} color="#581517" />  Iniciar Sesion</button>
        
       
</div>


    </header>
  )
}

export default Header