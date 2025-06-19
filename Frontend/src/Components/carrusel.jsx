import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../styles/carrusel.css";

function Carrusel() {
  const [currentImagen, setCurrentImagen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [carouselConfig, setCarouselConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  // 🔗 CONFIGURACIÓN PARA CONEXIÓN CON BACKEND
  const API_CONFIG = {
    // Cambiar esta URL por la de tu API
    //baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    endpoints: {
      carouselData: '/carousel/slides',
      carouselConfig: '/carousel/config'
    }
  };

  // 📊 DATOS POR DEFECTO (fallback si no hay conexión)
  const defaultImagenes = [
    { 
      id: 1,
      img: "/assets/carusel1.jpg", 
      label: "EVENTOS Y CURSOS", 
      desc: 'Incentivar la investigación en los campos afines',
      buttonText: 'Ver más',
      redirectUrl: '/Eventos'
    },
    { 
      id: 2,
      img: "/assets/carusel2.png", 
      label: 'EVENTOS Y CURSOS', 
      desc: 'Disponibilidad para todas la personas',
      buttonText: 'Ver más',
      redirectUrl: '/Eventos'
    },
    { 
      id: 3,
      img: "/assets/carusel3.jpg", 
      label: 'EVENTOS Y CURSOS', 
      desc: 'Compromiso con el desarrollo Tecnológico',
      buttonText: 'Ver más',
      redirectUrl: '/Eventos'
    }
  ];

  const defaultConfig = {
    autoPlayInterval: 5000,
    transitionDuration: 500,
    enableAutoPlay: true,
    enableKeyboardNavigation: true,
    enableMousePause: true,
    height: '100vh'
  };

  // 🌐 FUNCIÓN PARA CARGAR DATOS DESDE EL BACKEND
  const fetchCarouselData = async () => {
    try {
      setLoading(true);
      
      // Cargar slides del carrusel
      const slidesResponse = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carouselData}`);
      const configResponse = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carouselConfig}`);
      
      if (slidesResponse.ok) {
        const slidesData = await slidesResponse.json();
        setImagenes(slidesData.slides || defaultImagenes);
      } else {
        console.warn('No se pudieron cargar los slides, usando datos por defecto');
        setImagenes(defaultImagenes);
      }

      if (configResponse.ok) {
        const configData = await configResponse.json();
        setCarouselConfig({ ...defaultConfig, ...configData });
      } else {
        console.warn('No se pudo cargar la configuración, usando configuración por defecto');
        setCarouselConfig(defaultConfig);
      }

    } catch (error) {
      console.error('Error al cargar datos del carrusel:', error);
      setError('Error al cargar el contenido');
      // Usar datos por defecto en caso de error
      setImagenes(defaultImagenes);
      setCarouselConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 FUNCIÓN PARA REFRESCAR DATOS (útil para admin panel)
  const refreshCarouselData = () => {
    fetchCarouselData();
  };

  // 📱 FUNCIONES DE NAVEGACIÓN
  const cambiarSlide = useCallback((index) => {
    if (isTransitioning || imagenes.length === 0) return;
    setIsTransitioning(true);
    setCurrentImagen(index);
    setTimeout(() => setIsTransitioning(false), carouselConfig.transitionDuration || 500);
  }, [isTransitioning, imagenes.length, carouselConfig.transitionDuration]);

  const handleNext = useCallback(() => {
    if (imagenes.length === 0) return;
    cambiarSlide((currentImagen + 1) % imagenes.length);
  }, [currentImagen, imagenes.length, cambiarSlide]);

  const handlePrev = useCallback(() => {
    if (imagenes.length === 0) return;
    cambiarSlide((currentImagen - 1 + imagenes.length) % imagenes.length);
  }, [currentImagen, imagenes.length, cambiarSlide]);

  const handleDotClick = (index) => cambiarSlide(index);

  // 🔗 FUNCIÓN PARA MANEJAR CLICS EN IMÁGENES (URLs editables desde backend)
  const handleImageClick = (slide) => {
    if (slide.redirectUrl) {
      window.location.href = slide.redirectUrl;
    }
  };

  // ⏱️ EFECTO PARA AUTO-PLAY
  useEffect(() => {
    if (!isPaused && carouselConfig.enableAutoPlay && imagenes.length > 0) {
      timerRef.current = setInterval(handleNext, carouselConfig.autoPlayInterval || 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [handleNext, isPaused, carouselConfig.enableAutoPlay, carouselConfig.autoPlayInterval, imagenes.length]);

  // ⌨️ EFECTO PARA NAVEGACIÓN CON TECLADO
  useEffect(() => {
    if (!carouselConfig.enableKeyboardNavigation) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, carouselConfig.enableKeyboardNavigation]);

  // 🚀 CARGAR DATOS AL MONTAR EL COMPONENTE
  useEffect(() => {
    fetchCarouselData();
  }, []);

  // 💫 ESTADO DE CARGA
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

  // ❌ ESTADO DE ERROR
  if (error) {
    return (
      <div className="discovery-carousel error-state">
        <div className="carousel-error">
          <p>{error}</p>
          <button onClick={refreshCarouselData} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // 📷 RENDERIZADO PRINCIPAL
  return (
    <div 
      className='discovery-carousel'
      ref={carouselRef}
      onMouseEnter={() => carouselConfig.enableMousePause && setIsPaused(true)}
      onMouseLeave={() => carouselConfig.enableMousePause && setIsPaused(false)}
      role='region'
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
      style={{ height: carouselConfig.height || '100vh' }}
    >    
      <div 
        className='discovery-carousel-track' 
        style={{ 
          transform: `translateX(-${currentImagen * 100}%)`,
          transitionDuration: `${carouselConfig.transitionDuration || 500}ms`
        }}
      >
        {imagenes.map((imagen, index) => (
          <div 
            className={`discovery-carousel-slide ${index === currentImagen ? 'active' : ''}`}
            key={imagen.id || index}
            aria-hidden={index !== currentImagen}
            onClick={() => handleImageClick(imagen)}
            style={{ cursor: imagen.redirectUrl ? 'pointer' : 'default' }}
          >
            <img 
              src={imagen.img} 
              alt={imagen.label || `Slide ${index + 1}`}
              className='discovery-carousel-image'
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className='discovery-carousel-caption'>
              <h3>{imagen.label}</h3>
              <p>{imagen.desc}</p>
              {imagen.buttonText && imagen.redirectUrl && (
                <button 
                  className="discovery-carousel-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(imagen);
                  }}
                >
                  {imagen.buttonText}
                </button>
              )}
            </div> 
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      <button 
        className='discovery-carousel-control prev' 
        onClick={(e) => { e.stopPropagation(); handlePrev() }} 
        aria-label="Anterior"
        disabled={imagenes.length <= 1}
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        className='discovery-carousel-control next' 
        onClick={(e) => { e.stopPropagation(); handleNext() }} 
        aria-label='Siguiente'
        disabled={imagenes.length <= 1}
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicadores */}
      {imagenes.length > 1 && (
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
      )}

      {/* Información de depuración (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="carousel-debug-info">
          <button onClick={refreshCarouselData} className="refresh-button">
            🔄 Refrescar datos
          </button>
          <span>Slides: {imagenes.length}</span>
        </div>
      )}
    </div>
  );
}

export default Carrusel;
