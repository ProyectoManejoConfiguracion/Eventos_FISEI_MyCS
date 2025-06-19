import React, { useState, useEffect, useCallback } from 'react';
import '../../Styles/Features.css';
import { FaChalkboardTeacher } from "react-icons/fa";

// Hook personalizado para manejar datos del backend
const useFeaturesData = () => {
  const [featuresData, setFeaturesData] = useState(null);
  const [sectionContent, setSectionContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener datos del backend
  const fetchFeaturesData = useCallback(async () => {
    try {
      setLoading(true);
      
      // TODO: Reemplazar con la URL real del backend
      // const response = await fetch('/api/features-section');
      // const data = await response.json();
      
      // Simulación de datos del backend
      const mockData = {
        sectionContent: {
          id: "experiencia-discovery",
          title: "¿Por qué elegirnos?",
          subtitle: "Explora el ambiente único de nuestra comunidad educativa y vive la diferencia Discovery. Ofrecemos educación de calidad en un entorno diseñado para inspirar.",
          showSubtitle: false
        },
        features: [
          {
            id: 1,
            icon: "FaChalkboardTeacher", // Referencia al ícono
            iconSize: 24,
            title: "Profesores Expertos",
            description: "Aprende de profesionales en activo con años de experiencia en la industria tecnológica que te guiarán en tu desarrollo académico y profesional con metodologías innovadoras y un enfoque personalizado para cada estudiante.",
            imageUrl: "/assets/profesor.jpg",
            altText: "Profesores expertos enseñando en Discovery",
            order: 0,
            isActive: true,
            animationDelay: 0
          },
          {
            id: 2,
            icon: "🏢",
            iconSize: 24,
            title: "Infraestructura de Vanguardia",
            description: "Laboratorios equipados con tecnología de punta para que experimentes con las herramientas más modernas del mercado en un ambiente propicio para el aprendizaje y la innovación.",
            imageUrl: "/assets/facultad1.jpg",
            altText: "Instalaciones modernas y laboratorios de Discovery",
            order: 1,
            isActive: true,
            animationDelay: 200
          },
          {
            id: 3,
            icon: "🧠",
            iconSize: 24,
            title: "Aprendizaje Práctico",
            description: "Metodología basada en proyectos reales que te prepara para los desafíos del mundo laboral actual, desarrollando habilidades técnicas y blandas esenciales para tu éxito profesional.",
            imageUrl: "/assets/aprendizaje.jpg",
            altText: "Estudiantes aprendiendo de forma práctica",
            order: 2,
            isActive: true,
            animationDelay: 400
          }
        ],
        floatingElements: {
          showFloatingElements: true,
          elementsCount: 3
        }
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSectionContent(mockData.sectionContent);
      setFeaturesData(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching features data:', err);
      setError('Error al cargar los datos de características');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturesData();
  }, [fetchFeaturesData]);

  return {
    featuresData,
    sectionContent,
    loading,
    error,
    refetch: fetchFeaturesData
  };
};

// Función para renderizar íconos dinámicamente
const renderIcon = (iconName, size = 24) => {
  const iconMap = {
    'FaChalkboardTeacher': <FaChalkboardTeacher size={size} />,
    // Agregar más íconos según sea necesario
  };

  // Si es un emoji o texto, devolverlo directamente
  if (!iconMap[iconName]) {
    return iconName;
  }

  return iconMap[iconName];
};

// Componente de la sección
const FeaturesSection = () => {
  const { featuresData, sectionContent, loading, error, refetch } = useFeaturesData();

  // Componente de loading
  if (loading) {
    return (
      <section className="features-section">
        <div className="section-container">
          <div className="loading-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div className="loading-spinner">Cargando características...</div>
          </div>
        </div>
      </section>
    );
  }

  // Componente de error
  if (error) {
    return (
      <section className="features-section">
        <div className="section-container">
          <div className="error-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p className="error-message">{error}</p>
            <button 
              onClick={refetch}
              className="retry-button"
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay datos, no renderizar nada
  if (!featuresData || !sectionContent) {
    return null;
  }

  // Filtrar y ordenar características activas
  const activeFeatures = featuresData.features
    .filter(feature => feature.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="features-section" id={sectionContent.id}>
      {/* Elementos flotantes dinámicos */}
      {featuresData.floatingElements?.showFloatingElements && (
        <div className="floating-elements" aria-hidden="true">
          {Array.from({ length: featuresData.floatingElements.elementsCount }, (_, index) => (
            <div 
              key={index} 
              className={`floating-circle floating-circle--${index + 1}`}
            ></div>
          ))}
        </div>
      )}

      <div className="section-container">
        <header className="section-header">
          <h2 className="section-title">
            {sectionContent.title}
          </h2>
          {sectionContent.showSubtitle && sectionContent.subtitle && (
            <p className="section-subtitle">
              {sectionContent.subtitle}
            </p>
          )}
        </header>
        
        {/* Grid de características en zigzag */}
        <div className="features-grid">
          {activeFeatures.map((feature, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <article 
                key={feature.id} 
                className={`feature-row ${isEven ? 'feature-row--normal' : 'feature-row--reverse'}`}
                data-aos="fade-up"
                data-aos-delay={feature.animationDelay}
              >
                {/* Contenido de texto */}
                <div className="feature-content">
                  <div className="feature-item">
                    {/* Header con ícono y título en línea */}
                    <div className="feature-header">
                      <div className="feature-icon" aria-hidden="true">
                        {renderIcon(feature.icon, feature.iconSize)}
                      </div>
                      <h3 className="feature-title">{feature.title}</h3>
                    </div>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>

                {/* Imagen */}
                <div className="feature-image-container">
                  <img 
                    src={feature.imageUrl} 
                    alt={feature.altText || feature.title}
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
