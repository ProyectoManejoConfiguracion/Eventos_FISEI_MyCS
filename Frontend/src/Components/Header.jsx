import React, { useState } from 'react'
import logo from '../assets/logo.png' ;
import '../styles/Header.css' ;
import { Link } from 'react-router-dom';
import { FaUserAlt } from "react-icons/fa";
import Login from '../Components/modals/Login'

const Header = () => {
  
  const [isModalOpen,setIsModalOpen] = useState(false);
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
        <button className='btn_Loging' onClick={()=>setIsModalOpen(true)}> <FaUserAlt size={20} color="#581517" />  Iniciar Sesion</button>
        <Login isOpen={isModalOpen} closeModal={()=>setIsModalOpen(false)}/>   
</div>


    </header>
  )
}

export default Header