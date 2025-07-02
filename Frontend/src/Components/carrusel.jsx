import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../styles/carrusel.css";

const API_BASE_URL = import.meta.env.VITE_BACK_URL;

function Carrusel() {
  const [imagenes, setImagenes] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/home?section=carousel`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el carrusel');
        return res.json();
      })
      .then(data => {
        setImagenes(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => {
        setImagenes([]);
        setError('No se pudo cargar el carrusel');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isPaused && imagenes.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % imagenes.length);
      }, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, imagenes.length]);

  const handleNext = useCallback(() => {
    if (imagenes.length === 0) return;
    setIsTransitioning(true);
    setCurrent(prev => (prev + 1) % imagenes.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [imagenes.length]);

  const handlePrev = useCallback(() => {
    if (imagenes.length === 0) return;
    setIsTransitioning(true);
    setCurrent(prev => (prev - 1 + imagenes.length) % imagenes.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [imagenes.length]);

  const handleDotClick = (idx) => setCurrent(idx);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === ' ') setIsPaused(p => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (loading) {
    return (
      <div className="discovery-carousel loading-state">
        <div className="carousel-loader">
          <div className="loader-spinner"></div>
          <p>Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error || imagenes.length === 0) {
    return (
      <div className="discovery-carousel error-state">
        <div className="carousel-error">
          <p>{error || "No hay imágenes para mostrar"}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className='discovery-carousel'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
      style={{ height: '100vh' }}
    >
      <div
        className='discovery-carousel-track'
        style={{
          transform: `translateX(-${current * 100}%)`,
          transitionDuration: `${isTransitioning ? 500 : 0}ms`
        }}
      >
        {imagenes.map((img, idx) => (
          <div
            className={`discovery-carousel-slide ${idx === current ? 'active' : ''}`}
            key={img.id || idx}
            aria-hidden={idx !== current}
            style={{ cursor: img.redirectUrl ? 'pointer' : 'default' }}
            onClick={() => img.redirectUrl && (window.location.href = img.redirectUrl)}
          >
            <img
              src={`${API_BASE_URL.replace('/api', '')}/${img.imagen}`}
              alt={img.titulo}
              className='discovery-carousel-image'
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            <div className='discovery-carousel-caption'>
              <h3>{img.titulo}</h3>
              <p>{img.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navegación */}
      <button
        className='discovery-carousel-control prev'
        onClick={handlePrev}
        aria-label="Anterior"
        disabled={imagenes.length <= 1}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        className='discovery-carousel-control next'
        onClick={handleNext}
        aria-label='Siguiente'
        disabled={imagenes.length <= 1}
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicadores */}
      {imagenes.length > 1 && (
        <div className="discovery-carousel-indicators">
          {imagenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`discovery-carousel-indicator ${idx === current ? 'active' : ''}`}
              aria-label={`Ir a la imagen ${idx + 1}`}
              aria-current={idx === current}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carrusel;