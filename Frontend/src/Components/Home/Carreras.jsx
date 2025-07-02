import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Carreras.css';

// Importaciones de imágenes por defecto (solo como fallback)
import softwareImg from '../../assets/Software.jpg';
import telecomImg from '../../assets/Telecomunicaciones.png';
import tiImg from '../../assets/TI.png';
import industrialImg from '../../assets/industrial.jpg';
import roboticaImg from '../../assets/robotica.jpg';

// Mapeo de imágenes por defecto para fallback
const DEFAULT_IMAGES = {
  software: softwareImg,
  telecomunicaciones: telecomImg,
  ti: tiImg,
  industrial: industrialImg,
  robotica: roboticaImg
};

// Reemplazar 
const CategoriesService = {
  // Simula obtener categorías desde el backend
  async getCategories() {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: [
        { 
          id: 1, 
          name: 'SOFTWARE', 
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=350&fit=crop',
          imageAlt: 'Desarrollo de Software',
          imageFallback: 'software',
          route: '/cursos?carrera=software',
          isActive: true,
          description: 'Desarrollo de aplicaciones y sistemas',
          order: 1
        },
        { 
          id: 2, 
          name: 'TELECOMUNICACIONES', 
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=350&fit=crop',
          imageAlt: 'Telecomunicaciones y Redes',
          imageFallback: 'telecomunicaciones',
          route: '/cursos?carrera=telecomunicaciones',
          isActive: true,
          description: 'Redes y comunicaciones',
          order: 2
        },
        { 
          id: 3, 
          name: 'TI', 
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=350&fit=crop',
          imageAlt: 'Tecnologías de la Información',
          imageFallback: 'ti',
          route: '/cursos?carrera=ti',
          isActive: true,
          description: 'Tecnologías de la información',
          order: 3
        },
        { 
          id: 4, 
          name: 'INDUSTRIAL', 
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=350&fit=crop',
          imageAlt: 'Ingeniería Industrial',
          imageFallback: 'industrial',
          route: '/cursos?carrera=industrial',
          isActive: true,
          description: 'Ingeniería de procesos',
          order: 4
        },
        { 
          id: 5, 
          name: 'ROBÓTICA', 
          image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=350&fit=crop',
          imageAlt: 'Robótica y Automatización',
          imageFallback: 'robotica',
          route: '/cursos?carrera=robotica',
          isActive: true,
          description: 'Automatización y robótica',
          order: 5
        }
      ]
    };
  },

  
  async getSectionConfig() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        title: 'Explora por Carreras',
        subtitle: 'Descubre eventos y cursos relacionados con tu área de estudio',
        isVisible: true,
        gridColumns: 5 // Para CSS Grid
      }
    };
  }
};

// Hook personalizado para manejar datos del backend
const useBackendData = () => {
  const [categories, setCategories] = useState([]);
  const [sectionConfig, setSectionConfig] = useState({
    title: 'Explora por Carreras',
    subtitle: 'Descubre eventos y cursos relacionados con tu área de estudio',
    isVisible: true,
    gridColumns: 5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch paralelo de categorías y configuración
        const [categoriesResponse, configResponse] = await Promise.all([
          CategoriesService.getCategories(),
          CategoriesService.getSectionConfig()
        ]);

        if (categoriesResponse.success) {
          // Filtrar solo categorías activas y ordenar
          const activeCategories = categoriesResponse.data
            .filter(cat => cat.isActive)
            .sort((a, b) => a.order - b.order);
          setCategories(activeCategories);
        }

        if (configResponse.success) {
          setSectionConfig(configResponse.data);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, sectionConfig, loading, error };
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const handleClick = () => {
    // Usar la ruta configurada desde el backend
    navigate(category.route || "/");
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Obtener imagen: URL del backend > imagen local por fallback > imagen por defecto
  const getImageSrc = () => {
    if (imageError) {
      return category.imageFallback && DEFAULT_IMAGES[category.imageFallback] 
        ? DEFAULT_IMAGES[category.imageFallback]
        : DEFAULT_IMAGES.software; // Imagen por defecto
    }
    return category.image;
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="category-image-container">
        {imageLoading && (
          <div className="image-loading-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img 
          src={getImageSrc()} 
          alt={category.imageAlt || category.name}
          className="category-image"
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
        <div className="image-overlay"></div>
      </div>
      <h3 className="category-title">{category.name}</h3>
      {category.description && (
        <p className="category-description">{category.description}</p>
      )}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="categories-grid">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="category-card loading-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-title"></div>
      </div>
    ))}
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <p className="error-message">{message}</p>
    <button onClick={onRetry} className="retry-button">
      Reintentar
    </button>
  </div>
);

const CategoriesSection = () => {
  const { categories, sectionConfig, loading, error } = useBackendData();

  // No renderizar si la sección está desactivada desde el backend
  if (!sectionConfig.isVisible) {
    return null;
  }

  if (loading) {
    return (
      <section className="categories-section">
        <div className="section-container">
          <header className="section-header">
            <div className="skeleton-title-large"></div>
            <div className="skeleton-subtitle"></div>
          </header>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="categories-section">
        <div className="section-container">
          <ErrorMessage 
            message={error} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section">
      <div className="section-container">
        <header className="section-header">
          <h2 className="section-title">{sectionConfig.title}</h2>
          <p className="section-subtitle">{sectionConfig.subtitle}</p>
        </header>
        
        <div 
          className="categories-grid"
          style={{ 
            gridTemplateColumns: `repeat(${Math.min(sectionConfig.gridColumns, categories.length)}, 1fr)` 
          }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
