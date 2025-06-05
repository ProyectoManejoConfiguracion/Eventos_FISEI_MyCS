import React, { useState, useEffect, useCallback } from 'react';
import '../../Styles/Features.css';
import maestros from '../../assets/profesor.jpg';
import facu from '../../assets/facultad1.jpg';
import aprender from '../../assets/aprendizaje.jpg'
import { FaChalkboardTeacher } from "react-icons/fa";

const FEATURES_DATA = [
  {
    icon: <FaChalkboardTeacher size={24} />,
    title: 'Profesores Expertos',
    description: 'Aprende de profesionales en activo con años de experiencia en la industria tecnológica que te guiarán en tu desarrollo académico y profesional con metodologías innovadoras y un enfoque personalizado para cada estudiante.',
    image: maestros,
    alt: 'Profesores expertos enseñando en Discovery'
  },
  {
    icon: '🏢',
    title: 'Infraestructura de Vanguardia',
    description: 'Laboratorios equipados con tecnología de punta para que experimentes con las herramientas más modernas del mercado en un ambiente propicio para el aprendizaje y la innovación.',
    image: facu,
    alt: 'Instalaciones modernas y laboratorios de Discovery'
  },
  {
    icon: '🧠',
    title: 'Aprendizaje Práctico',
    description: 'Metodología basada en proyectos reales que te prepara para los desafíos del mundo laboral actual, desarrollando habilidades técnicas y blandas esenciales para tu éxito profesional.',
    image: aprender,
    alt: 'Estudiantes aprendiendo de forma práctica'
  }
];

// Componente de la sección
const FeaturesSection = () => {
  return (
    <section className="features-section" id="experiencia-discovery">
    
      <div className="floating-elements" aria-hidden="true">
        <div className="floating-circle floating-circle--1"></div>
        <div className="floating-circle floating-circle--2"></div>
        <div className="floating-circle floating-circle--3"></div>
      </div>

      <div className="section-container">
        <header className="section-header">
          <h2 className="section-title">
              ¿Por qué elegirnos?
          </h2>
          {/*<p className="section-subtitle">
            Explora el ambiente único de nuestra comunidad educativa y vive la diferencia Discovery. 
            Ofrecemos educación de calidad en un entorno diseñado para inspirar. 
            Encuentra tu espacio ideal donde puedes crear momentos inolvidables 
            mientras desarrollas tus habilidades tecnológicas.
          </p>*/}
        </header>
        
        {/* Grid de características en zigzag */}
        <div className="features-grid">
          {FEATURES_DATA.map((feature, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <article 
                key={index} 
                className={`feature-row ${isEven ? 'feature-row--normal' : 'feature-row--reverse'}`}
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                {/* Contenido de texto */}
                <div className="feature-content">
                  <div className="feature-item">
                    {/* Header con ícono y título en línea - MODIFICACIÓN PRINCIPAL */}
                    <div className="feature-header">
                      <div className="feature-icon" aria-hidden="true">
                        {feature.icon}
                      </div>
                      <h3 className="feature-title">{feature.title}</h3>
                    </div>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>

                {/* Imagen */}
                <div className="feature-image-container">
                  <img 
                    src={feature.image} 
                    alt={feature.alt || feature.title}
                    className="feature-image"
                    loading="lazy"
                    width="300"
                    height="300"
                  />
                  <div className="image-overlay" aria-hidden="true"></div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;