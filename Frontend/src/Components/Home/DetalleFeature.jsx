import React, { useEffect, useState, useMemo } from 'react';
import '../../Styles/Features.css';
import { FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';
import {BACK_URL } from '../../../config';

const FeatureImage = React.memo(({ src, alt, title }) => (
  <div className="feature-image-container">
    <img
      src={src}
      alt={alt || title}
      className="feature-image"
      loading="lazy"
    />
  </div>
));

const FeatureCTA = React.memo(({ text, link }) => {
  if (!text) return null;
  return (
    <a href={link} className="feature-cta" aria-label={text}>
      {text}
      <FaArrowRight size={14} />
    </a>
  );
});

const FeatureCard = React.memo(({ feature, index }) => (
  <article
    className={`feature-card ${index % 2 !== 0 ? 'feature-card--reverse' : ''} visible`}
    aria-labelledby={`feature-title-${feature.id}`}
  >
    <div className="feature-content">
      <div className="feature-header">
        <div className="feature-icon">
          <FaChalkboardTeacher size={28} />
        </div>
        <h3 id={`feature-title-${feature.id}`}>{feature.titulo}</h3>
      </div>
      <p className="feature-description">{feature.descripcion}</p>
    </div>
    {feature.imagen &&
      <FeatureImage
        src={`${BACK_URL}/${feature.imagen}`}
        alt={feature.titulo}
        title={feature.titulo}
      />
    }
  </article>
));

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

const FloatingElements = React.memo(({ count }) => {
  const elements = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="floating-circle"
          style={{
            '--delay': `${index * 2}s`,
            '--size': `${20 + index * 10}px`,
            '--position': `${10 + index * 20}%`
          }}
          aria-hidden="true"
        />
      )),
    [count]
  );
  return <div className="floating-elements">{elements}</div>;
});

const DetalleFeature = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACK_URL}/api/home?section=feature`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar las características');
        return res.json();
      })
      .then(data => {
        setFeatures(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => {
        setFeatures([]);
        setError('No se pudo cargar la información de características');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  if (!features.length) return <div>No hay características para mostrar.</div>;

  const sectionContent = {
    id: "experiencia-discovery",
    title: "¿Por qué elegirnos?",
    subtitle: "Explora el ambiente único de nuestra comunidad educativa y vive la diferencia Discovery.",
    showSubtitle: true,
  };

  return (
    <section className="features-section" id={sectionContent.id}>
      <div className="section-container">
        <header className="section-header">
          <h2>{sectionContent.title}</h2>
          {sectionContent.showSubtitle && <p>{sectionContent.subtitle}</p>}
        </header>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetalleFeature;