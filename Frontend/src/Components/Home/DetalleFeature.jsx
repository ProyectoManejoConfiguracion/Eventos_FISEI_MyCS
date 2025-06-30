import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../../Styles/Features.css';
import { FaChalkboardTeacher, FaBuilding, FaBrain, FaArrowRight } from 'react-icons/fa';

// Configuración de iconos centralizada
const ICON_MAP = {
  'FaChalkboardTeacher': FaChalkboardTeacher,
  'FaBuilding': FaBuilding,
  'FaBrain': FaBrain,
};

// Hook personalizado para manejar datos del backend
const useFeaturesData = () => {
  const [state, setState] = useState({
    featuresData: null,
    sectionContent: null,
    loading: true,
    error: null
  });

  const fetchFeaturesData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const defaultData = {
        sectionContent: {
          id: "experiencia-discovery",
          title: "¿Por qué elegirnos?",
          subtitle: "Explora el ambiente único de nuestra comunidad educativa y vive la diferencia Discovery.",
          showSubtitle: true,
        },
        features: [
          {
            id: 1,
            icon: "FaChalkboardTeacher",
            iconSize: 28,
            title: "Profesores Expertos",
            description: "Aprende de profesionales en activo con años de experiencia en la industria.",
            imageUrl: "/default-images/profesor.jpg",
            altText: "Profesores expertos enseñando",
            ctaText: "Conoce al equipo",
            ctaLink: "/equipo",
            order: 0,
            isActive: true,
            animationDelay: 0,
          },
          {
            id: 2,
            icon: "FaBuilding",
            iconSize: 28,
            title: "Infraestructura Moderna",
            description: "Laboratorios equipados con tecnología de punta para tu aprendizaje.",
            imageUrl: "/default-images/facultad.jpg",
            altText: "Instalaciones modernas",
            ctaText: "Ver instalaciones",
            ctaLink: "/instalaciones",
            order: 1,
            isActive: true,
            animationDelay: 200
          },
          {
            id: 3,
            icon: "FaBrain",
            iconSize: 28,
            title: "Aprendizaje Práctico",
            description: "Metodología basada en proyectos reales para tu desarrollo profesional.",
            imageUrl: "/default-images/aprendizaje.jpg",
            altText: "Estudiantes aprendiendo",
            ctaText: "Ver metodología",
            ctaLink: "/metodologia",
            order: 2,
            isActive: true,
            animationDelay: 400
          }
        ],
        floatingElements: {
          showFloatingElements: true,
          elementsCount: 3
        },
        ctaSection: {
          title: "¿Listo para comenzar tu transformación?",
          primaryButtonText: "Conoce sobre nosotros",
          primaryButtonLink: "/nosotros",
          secondaryButtonText: "Solicitar Informacion",
          secondaryButtonLink: "/contactos",
          showCta: true
        }
      };

      // Simular respuesta del backend
      const apiData = defaultData;
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setState({
        featuresData: apiData,
        sectionContent: apiData.sectionContent,
        loading: false,
        error: null
      });
      
    } catch (err) {
      console.error('Error:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los datos. Mostrando información por defecto.'
      }));
    }
  }, []);

  useEffect(() => {
    fetchFeaturesData();
  }, [fetchFeaturesData]);

  return { ...state, refetch: fetchFeaturesData };
};

const FeatureIcon = React.memo(({ iconName, size = 24, className = "" }) => {
  const IconComponent = ICON_MAP[iconName];
  return IconComponent ? <IconComponent size={size} className={className} /> : null;
});

const FeatureImage = React.memo(({ src, alt, title }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="feature-image-container">
      {!imageLoaded && !imageError && (
        <div className="image-placeholder">
          <div className="loading-spinner">Cargando...</div>
        </div>
      )}
      {imageError ? (
        <div className="image-error">
          <span>Error al cargar imagen</span>
        </div>
      ) : (
        <img 
          src={src}
          alt={alt || title}
          className={`feature-image ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
});

const FeatureCTA = React.memo(({ text, link }) => {
  if (!text) return null;
  
  return (
    <a 
      href={link}
      className="feature-cta"
      aria-label={text}
    >
      {text}
      <FaArrowRight size={14} />
    </a>
  );
});

const FeatureCard = React.memo(({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, feature.animationDelay);
    return () => clearTimeout(timer);
  }, [feature.animationDelay]);

  return (
    <article 
      className={`feature-card ${index % 2 !== 0 ? 'feature-card--reverse' : ''} ${isVisible ? 'visible' : ''}`}
      aria-labelledby={`feature-title-${feature.id}`}
    >
      <div className="feature-content">
        <div className="feature-header">
          <div className="feature-icon">
            <FeatureIcon iconName={feature.icon} size={feature.iconSize} />
          </div>
          <h3 id={`feature-title-${feature.id}`}>{feature.title}</h3>
        </div>
        <p className="feature-description">{feature.description}</p>
        
      </div>

      <FeatureImage
        src={feature.imageUrl}
        alt={feature.altText}
        title={feature.title}
      />
    </article>
  );
});

const FloatingElements = React.memo(({ count }) => {
  const elements = useMemo(() => 
    Array.from({ length: count }, (_, index) => (
      <div 
        key={index} 
        className="floating-circle"
        style={{
          '--delay': `${index * 2}s`,
          '--size': `${20 + (index * 10)}px`,
          '--position': `${10 + (index * 20)}%`
        }}
        aria-hidden="true"
      />
    )), [count]);

  return <div className="floating-elements">{elements}</div>;
});

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Cargando características...</p>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="error-container">
    <div className="error-icon">⚠️</div>
    <h3>Algo salió mal</h3>
    <p>{error}</p>
    <button onClick={onRetry} className="retry-button">
      Reintentar
    </button>
  </div>
);

const CTASection = React.memo(({ ctaData }) => {
  if (!ctaData?.showCta) return null;

  return (
    <div className="section-cta">
      <h3>{ctaData.title}</h3>
      <div className="cta-buttons">
        <a href={ctaData.primaryButtonLink} className="btn btn-primary">
          {ctaData.primaryButtonText}
        </a>
        {/*<a href={ctaData.secondaryButtonLink} className="btn btn-secondary">
          {ctaData.secondaryButtonText}
        </a> */}
      </div>
    </div>
  );
});

const FeaturesSection = () => {
  const { featuresData, sectionContent, loading, error, refetch } = useFeaturesData();

  const activeFeatures = useMemo(() => {
    return featuresData?.features?.filter(f => f.isActive).sort((a, b) => a.order - b.order) || [];
  }, [featuresData?.features]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!featuresData || !sectionContent) return null;

  return (
    <section className="features-section" id={sectionContent.id}>
      {featuresData.floatingElements?.showFloatingElements && (
        <FloatingElements count={featuresData.floatingElements.elementsCount} />
      )}

      <div className="section-container">
        <header className="section-header">
          <h2>{sectionContent.title}</h2>
          {sectionContent.showSubtitle && <p>{sectionContent.subtitle}</p>}
        </header>
        
        <div className="features-grid">
          {activeFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        <CTASection ctaData={featuresData.ctaSection} />
      </div>
    </section>
  );
};

export default FeaturesSection;