import React from 'react';
import '../Styles/Footer.css';
import { Facebook, Instagram, Twitter, Github, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/">Inicio</a>
        <a href="/Eventos">Eventos</a>
        <a href="/Nosotros">Nosotros</a>
        <a href="/Contactos">Contactos</a>
        <a href="#">Algun problema.?</a>
       
      </div>

      <div className="footer-socials">
        <a href="#"><Facebook size={20} /></a>
        <a href="#"><Instagram size={20} /></a>
        <a href="#"><Twitter size={20} /></a>
        <a href="#"><Github size={20} /></a>
        <a href="#"><Youtube size={20} /></a>
      </div>

      <div className="footer-copy">
        © 2024 Grupo, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;