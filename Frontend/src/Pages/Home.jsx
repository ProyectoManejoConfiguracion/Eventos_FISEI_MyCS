import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, Award, Globe } from 'lucide-react';
import Carrusel from "../Components/carrusel";
import '../Styles/Home.css';
import Features from '../Components/Home/DetalleFeature';
import Tecnologias from '../Components/Tecnologias';
import Categorias from '../Components/Home/Carreras';

// Cambiar por la URL de tu backend
//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mapeo de iconos
const ICON_MAP = {
  'Users': Users,
  'Calendar': Calendar,
  'Award': Award,
  'Globe': Globe,
  'MapPin': MapPin
};

// Datos por defecto como fallback
const DEFAULT_STATS = [
  { number: '5,000+', text: 'Estudiantes Formados', icon: 'Users' },
  { number: '120+', text: 'Eventos Anuales', icon: 'Calendar' },
  { number: '85%', text: 'Tasa de Empleabilidad', icon: 'Award' },
  { number: '40+', text: 'Empresas Colaboradoras', icon: 'Globe' }
];

const DEFAULT_CONFIG = {
  coursesSection: {
    title: 'Eventos y Cursos Destacados',
    subtitle: 'Descubre las últimas oportunidades para desarrollar tus habilidades tecnológicas'
  }
};

const DiscoveryHome = () => {
  const [coursesData, setCoursesData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [homeConfig, setHomeConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener datos del backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Realizar todas las peticiones en paralelo
      const [coursesRes, statsRes, configRes] = await Promise.all([
        // Filtrar solo eventos/cursos destacados para el home
        fetch(`${API_BASE_URL}/courses-events?featured=true`).catch(() => null),
        fetch(`${API_BASE_URL}/stats`).catch(() => null),
        fetch(`${API_BASE_URL}/home-config`).catch(() => null)
      ]);

      // Procesar respuesta de cursos/eventos destacados
      let courses = [];
      if (coursesRes && coursesRes.ok) {
        const coursesFromAPI = await coursesRes.json();
        // Doble filtro: por si el backend no filtra, filtrar en frontend también
        courses = coursesFromAPI.filter(course => 
          course.featured === true || course.destacado === true || course.isFeatured === true
        );
        
        // Limitar a máximo 6 elementos para el home (opcional)
        courses = courses.slice(0, 6);
      }

      // Procesar respuesta de estadísticas
      let stats = DEFAULT_STATS;
      if (statsRes && statsRes.ok) {
        const statsFromAPI = await statsRes.json();
        if (statsFromAPI && statsFromAPI.length > 0) {
          stats = statsFromAPI;
        }
      }

      // Procesar respuesta de configuración
      let config = DEFAULT_CONFIG;
      if (configRes && configRes.ok) {
        const configFromAPI = await configRes.json();
        if (configFromAPI) {
          config = { ...DEFAULT_CONFIG, ...configFromAPI };
        }
      }

      // Actualizar estados
      setCoursesData(courses);
      setStatsData(stats);
      setHomeConfig(config);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
      
      setStatsData(DEFAULT_STATS);
      setHomeConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Procesar estadísticas con íconos
  const processedStats = statsData.map(stat => ({
    ...stat,
    icon: ICON_MAP[stat.icon] || Users
  }));

  if (loading) {
    return (
      <div className="discovery-container">
        <div className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <p>Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discovery-container">
      {/* Hero Section */}
      <section className="discovery-hero">
         <Carrusel />
      </section>
      
      {/* Stats Section */}
      <section className="discovery-stats">
        <div className="stats-container">
          <div className="stats-grid">
            {processedStats.map((stat, index) => (
              <StatCard key={stat.id || index} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="discovery-section">
        <div className="section-container">
          <header className="section-header">
            <h2 className="section-title">
              {homeConfig.coursesSection?.title}
            </h2>
            <p className="section-subtitle">
              {homeConfig.coursesSection?.subtitle}
            </p>
          </header>
          
          <div className="courses-grid">
            {coursesData.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Mostrar mensaje si no hay cursos */}
          {coursesData.length === 0 && !loading && (
            <div className="no-courses-message" style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#666' 
            }}>
              <p>No hay cursos o eventos disponibles en este momento.</p>
              <button 
                onClick={fetchData}
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
                Recargar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="discovery-section features-section">
        <Features />
      </section>

      {/* Technologies Section */}
      <section className="discovery-section tech-section">
        {/*<Tecnologias />*/}
      </section>

      {/* Categories Section */}
      <section className="discovery-section categories-section">
       {/* <Categorias />*/}
      </section>

      {/* Error Message */}
      {error && (
        <div className="error-banner" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: '1rem',
              background: 'transparent',
              border: 'none',
              color: '#721c24',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ stat }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <stat.icon size={36} />
    </div>
    <div className="stat-number">{stat.number}</div>
    <div className="stat-text">{stat.text}</div>
  </div>
);

const CourseCard = ({ course }) => {
  // Función para formatear fecha de manera segura
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return 'Fecha TBD';
    }
  };

  return (
    <article className="discovery-card">
      <div className="card-image-container">
        <img 
          src={course.image || course.imageUrl || '/placeholder-image.jpg'} 
          alt={course.title}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      
      <div className="card-content">
        <div className="card-meta">
          <span className="card-date">
            {formatDate(course.fecha || course.date)}
          </span>
          <span className="card-type">
            {course.type === 'evento' || course.type === 'event' ? 'Evento' : 'Curso'}
          </span>
        </div>
        
        <h3 className="card-title">{course.title}</h3>
        <p className="card-description">{course.description}</p>
        
        <div className="card-footer">
          <span className="card-location">
            <MapPin size={14} />
            {course.lugar || course.location || 'Ubicación TBD'}
          </span>
          <button className="card-button">
            {course.buttonText || 
             (course.type === 'evento' || course.type === 'event' 
               ? 'Inscribirse →' 
               : 'Más información →')}
          </button>
        </div>
      </div>
    </article>
  );
};

export default DiscoveryHome;
