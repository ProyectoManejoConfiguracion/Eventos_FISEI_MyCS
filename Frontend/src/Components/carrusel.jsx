import React, { useCallback, useEffect, useRef, useState } from 'react';
import carusell1 from "../assets/carusel1.jpg";
import carusell2 from "../assets/carusel2.png";
import carusell3 from "../assets/carusel3.jpg";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../styles/carrusel.css";

function Carrusel() {
  const [currentImagen, setCurrentImagen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  const imagenes = [
    { img: carusell1, label: "EVENTOS Y CURSOS", desc: 'Incentivar la investigación en los campos afines', link: '/eventos-cursos' },
    { img: carusell2, label: 'EVENTOS Y CURSOS', desc: 'Disponibilidad para todas la personas', link: '/eventos-cursos' },
    { img: carusell3, label: 'EVENTOS Y CURSOS', desc: 'Compromiso con el desarrollo Tecnológico', link: '/eventos-cursos' }
  ];

  const cambiarSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImagen(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const handleNext = useCallback(() => cambiarSlide((currentImagen + 1) % imagenes.length), [currentImagen, imagenes.length, cambiarSlide]);
  const handlePrev = useCallback(() => cambiarSlide((currentImagen - 1 + imagenes.length) % imagenes.length), [currentImagen, imagenes.length, cambiarSlide]);
  const handleDotClick = (index) => cambiarSlide(index);
  const handleImageClick = (link) => window.location.href = link;

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(handleNext, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [handleNext, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === ' ') setIsPaused(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div 
      className='discovery-carousel'
      ref={carouselRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role='region'
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
    >    
      <div 
        className='discovery-carousel-track' 
        style={{ transform: `translateX(-${currentImagen * 100}%)` }}
      >
        {imagenes.map((imagen, index) => (
          <div 
            className={`discovery-carousel-slide ${index === currentImagen ? 'active' : ''}`}
            key={index}
            aria-hidden={index !== currentImagen}
            onClick={() => handleImageClick(imagen.link)}
          >
            <img 
              src={imagen.img} 
              alt={imagen.label}
              className='discovery-carousel-image'
            />
            <div className='discovery-carousel-caption'>
              <h3>{imagen.label}</h3>
              <p>{imagen.desc}</p>
              <button 
                className="discovery-carousel-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(imagen.link);
                }}
              >
                Ver más
              </button>
            </div> 
          </div>
        ))}
      </div>

      <button 
        className='discovery-carousel-control prev' 
        onClick={(e) => { e.stopPropagation(); handlePrev() }} 
        aria-label="Anterior"
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        className='discovery-carousel-control next' 
        onClick={(e) => { e.stopPropagation(); handleNext() }} 
        aria-label='Siguiente'
      >
        <ChevronRight size={32} />
      </button>

      <div className="discovery-carousel-indicators">
        {imagenes.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); handleDotClick(index) }}
            className={`discovery-carousel-indicator ${index === currentImagen ? 'active' : ''}`}
            aria-label={`Ir a la imagen ${index + 1}`}
            aria-current={index === currentImagen}
          />
        ))}
      </div>  
    </div>
  );
}

export default Carrusel;