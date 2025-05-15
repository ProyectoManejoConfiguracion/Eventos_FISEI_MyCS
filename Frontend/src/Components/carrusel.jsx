import React, { useCallback, useEffect, useRef, useState } from 'react' 
import carusell1 from "../assets/carusel1.jpg";
import carusell2 from "../assets/carusel2.png";
import carusell3 from "../assets/carusel3.jpg";
import "../styles/carrusel.css"

function Carusell(){
  const[currentImagen, setCurrentImagen] = useState(0)
  const[isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef(null)
  const imagenes = [
    {img: carusell1, label: "EVENTOS Y CURSOS", desc:'Incentivar la investigación en los campos afines '},
    {img: carusell2, label: 'EVENTOS Y CURSOS', desc:'Disponibilidad para todas la personas'},
    {img: carusell3, label: 'EVENTOS Y CURSOS', desc:'Compromiso con el desarrollo Tecnológico'}
  ];

  const cambiarSlide = useCallback((index)=>{
    if(isTransitioning) return;

    setIsTransitioning(true)
    setCurrentImagen(index)

    setTimeout(()=>{
        setIsTransitioning(false)
    },500);
  }, [isTransitioning]);

  const handleNext = useCallback(() => {
    cambiarSlide((currentImagen + 1) % imagenes.length);
  }, [currentImagen, imagenes.length, cambiarSlide]);

  const handlePrev = useCallback(() => {
    cambiarSlide((currentImagen - 1 + imagenes.length) % imagenes.length);
  }, [currentImagen, imagenes.length, cambiarSlide]);

  const handleDotClick = (index) => {
    cambiarSlide(index);
  };


  useEffect(()=> {
     const handleKeyDown = (e) => {
      if (e.key === 'FlechaIzquierda') {
        handlePrev();
      } else if (e.key === 'FlechaDerecha') {
        handleNext();
      } else if (e.key === ' ') {
        togglePause();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev]);
  
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return(
    <div className='carusell-container'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref ={carouselRef}
        role='region'
        aria-roledescription="carrusel"
        aria-label="Galería de imágenes"
    >    
      <div className='carusell' 
          style={{ transform: `translateX(-${currentImagen * 100}%)` }}>
        {imagenes.map((imagen, index)=>(
          <div 
            className={`carusell-imagen ${index === currentImagen ? 'active' : ''}`}
            key ={index}
            aria-hidden={index !== currentImagen}
          >
            <img 
            src={imagen.img} 
            alt={imagen.label}/>

            <div className='carusell-caption'>
              <h3>{imagen.label}</h3>
              <p>{imagen.desc}</p>
            </div> 
          </div>
        ))}
      </div>

    <button className='carusell-control prev' onClick={handlePrev} aria-label="Anterior">
        <span className="flecha-izquierda"></span> 
    </button>
    <button className='carusell-control next' onClick={handleNext} aria-label='Siguiente'>
        <span className="flecha-derecha"></span>
    </button>

      <div className="carrusel-indicators">
        {imagenes.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`carrusel-dot ${index === currentImagen ? 'active' : ''}`}
            aria-label={`Ir a la imagen ${index + 1}`}
            aria-current={index === currentImagen}
          />
        ))}
      </div>  

    </div>

  )
}

export default Carusell