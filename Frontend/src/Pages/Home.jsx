import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, Award, Globe } from 'lucide-react';
import Carrusel from "../Components/carrusel";
import '../Styles/Home.css';
import Features from '../Components/Home/DetalleFeature';
import Tecnologias from '../Components/Tecnologias';
import Categorias from '../Components/Home/Carreras';

// FUTURA CONEXIÓN: Aquí se implementará la conexión al backend cuando esté disponible
// Actualmente está comentada para usar solo datos locales
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
  { id: 1, number: '5,000+', text: 'Estudiantes Formados', icon: 'Users' },
  { id: 2, number: '120+', text: 'Eventos Anuales', icon: 'Calendar' },
  { id: 3, number: '85%', text: 'Tasa de Empleabilidad', icon: 'Award' },
  { id: 4, number: '40+', text: 'Empresas Colaboradoras', icon: 'Globe' }
];

const DEFAULT_COURSES = [
  {
    id: 1,
    title: 'Introducción a la Inteligencia Artificial',
    description: 'Aprende los fundamentos de IA y machine learning en este curso intensivo.',
    type: 'curso',
    fecha: '2023-11-15',
    lugar: 'Online',
    image: '/images/cursos/ia.jpg',
    featured: true,
    estado: 'abierto'
  },
  {
    id: 2,
    title: 'Hackathon de Desarrollo Web',
    description: 'Participa en nuestro evento anual de desarrollo web y compite por grandes premios.',
    type: 'evento',
    fecha: '2023-12-05',
    lugar: 'Campus Principal',
    image: '/images/cursos/hackathon.jpg',
    featured: true,
    estado: 'abierto'
  },
  {
    id: 3,
    title: 'Workshop de React',
    description: 'Aprende React desde cero en este workshop intensivo.',
    type: 'evento',
    fecha: '2023-12-10',
    lugar: 'Online',
    image: '/images/cursos/react.jpg',
    featured: true,
    estado: 'abierto'
  },
  {
    id: 4,
    title: 'Curso de Python',
    description: 'Domina Python para ciencia de datos y desarrollo web.',
    type: 'curso',
    fecha: '2023-12-15',
    lugar: 'Campus Principal',
    image: '/images/cursos/python.jpg',
    featured: true,
    estado: 'abierto'
  },
  {
    id: 5,
    title: 'Seminario de Blockchain',
    description: 'Descubre las aplicaciones de blockchain en diferentes industrias.',
    type: 'evento',
    fecha: '2023-12-20',
    lugar: 'Online',
    image: '/images/cursos/blockchain.jpg',
    featured: true,
    estado: 'abierto'
  },
  {
    id: 6,
    title: 'Curso de DevOps',
    description: 'Aprende las mejores prácticas de DevOps y automatización.',
    type: 'curso',
    fecha: '2023-12-25',
    lugar: 'Campus Principal',
    image: '/images/cursos/devops.jpg',
    featured: true,
    estado: 'abierto'
  },
  {
    id: 7,
    title: 'Workshop de UI/UX',
    description: 'Mejora tus habilidades de diseño de interfaces.',
    type: 'evento',
    fecha: '2023-12-30',
    lugar: 'Online',
    image: '/images/cursos/uiux.jpg',
    featured: true,
    estado: 'abierto'
  }
];

const DEFAULT_CONFIG = {
  coursesSection: {
    title: 'Eventos y Cursos Destacados',
    subtitle: 'Descubre las últimas oportunidades para desarrollar tus habilidades tecnológicas'
  },
  features: {
    title: 'Por qué elegirnos',
    subtitle: 'Ofrecemos la mejor formación tecnológica con un enfoque práctico'
  }
};

const DiscoveryHome = () => {
  const [coursesData, setCoursesData] = useState([]);
  const [statsData, setStatsData] = useState(DEFAULT_STATS);
  const [homeConfig, setHomeConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el usuario actual del localStorage
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al obtener usuario del localStorage:', error);
      return null;
    }
  };

  // Función para obtener eventos guardados del usuario
  const getSavedEvents = () => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) return null;

      const savedEvents = localStorage.getItem(`userEvents_${user.id}`);
      return savedEvents ? JSON.parse(savedEvents) : null;
    } catch (error) {
      console.error('Error al obtener eventos guardados:', error);
      return null;
    }
  };

  // Función para guardar eventos del usuario
  const saveUserEvents = (events) => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) {
        console.warn('No hay usuario logueado para guardar eventos');
        return;
      }

      // Guardar solo los IDs de los eventos (máximo 6)
      const eventIds = events.slice(0, 6).map(event => event.id);
      localStorage.setItem(`userEvents_${user.id}`, JSON.stringify(eventIds));
      
      console.log(`Eventos guardados para usuario ${user.id}:`, eventIds);
    } catch (error) {
      console.error('Error al guardar eventos:', error);
    }
  };

  // Función para obtener eventos abiertos desde la base de datos
  const fetchOpenEvents = async () => {
    try {
      // Simulación de llamada a la API (reemplaza con tu endpoint real)
      /*
      const response = await fetch(`${API_BASE_URL}/events?status=open&limit=6`);
      if (!response.ok) throw new Error('Error al obtener eventos');
      const events = await response.json();
      return events;
      */
      
      // Por ahora usamos datos mock filtrados
      const openEvents = DEFAULT_COURSES
        .filter(course => course.estado === 'abierto')
        .slice(0, 6);
      
      return openEvents;
    } catch (error) {
      console.error('Error al obtener eventos abiertos:', error);
      throw error;
    }
  };

  // Función para obtener eventos por IDs
  const fetchEventsByIds = async (eventIds) => {
    try {
      // Simulación de llamada a la API (reemplaza con tu endpoint real)
      /*
      const response = await fetch(`${API_BASE_URL}/events/by-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: eventIds })
      });
      if (!response.ok) throw new Error('Error al obtener eventos por IDs');
      const events = await response.json();
      return events;
      */
      
      // Por ahora filtramos de los datos mock
      const events = DEFAULT_COURSES.filter(course => 
        eventIds.includes(course.id)
      );
      
      return events;
    } catch (error) {
      console.error('Error al obtener eventos por IDs:', error);
      throw error;
    }
  };

  // Función principal para cargar datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener estadísticas (esto no cambia)
      setStatsData(DEFAULT_STATS);
      setHomeConfig(DEFAULT_CONFIG);

      // Verificar si hay eventos guardados para el usuario
      const savedEventIds = getSavedEvents();
      
      let eventsToShow = [];

      if (savedEventIds && savedEventIds.length > 0) {
        console.log('Cargando eventos guardados del usuario:', savedEventIds);
        // Si hay eventos guardados, cargarlos
        eventsToShow = await fetchEventsByIds(savedEventIds);
      } else {
        console.log('No hay eventos guardados, cargando eventos abiertos');
        // Si no hay eventos guardados, cargar eventos abiertos
        eventsToShow = await fetchOpenEvents();
        
        // Guardar estos eventos para el usuario si está logueado
        if (eventsToShow.length > 0) {
          saveUserEvents(eventsToShow);
        }
      }

      setCoursesData(eventsToShow);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
      // En caso de error, usar datos por defecto
      const fallbackEvents = DEFAULT_COURSES.slice(0, 6);
      setCoursesData(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar eventos guardados (útil para testing)
  const clearSavedEvents = () => {
    try {
      const user = getCurrentUser();
      if (user && user.id) {
        localStorage.removeItem(`userEvents_${user.id}`);
        console.log('Eventos guardados eliminados');
        // Recargar datos
        fetchData();
      }
    } catch (error) {
      console.error('Error al limpiar eventos guardados:', error);
    }
  };

  // Función para actualizar eventos del usuario
  const updateUserEvents = (newEvents) => {
    saveUserEvents(newEvents);
    setCoursesData(newEvents.slice(0, 6));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Procesar estadísticas con íconos
  const processedStats = statsData.map(stat => ({
    ...stat,
    icon: ICON_MAP[stat.icon] || Users
  }));

  // Filtrar solo cursos destacados (máximo 6)
  const featuredCourses = coursesData.slice(0, 6);

  if (loading) {
    return (
      <div className="discovery-container">
        <div className="loading-container">
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
            {processedStats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="discovery-section">
        <div className="section-container">
          <header className="section-header">
            <h2 className="section-title">
              {homeConfig.coursesSection?.title || 'Eventos y Cursos Destacados'}
            </h2>
            <p className="section-subtitle">
              {homeConfig.coursesSection?.subtitle || 'Descubre nuestras oportunidades de aprendizaje'}
            </p>
          </header>
          
          {/* Botones de control para testing 
          <div className="control-buttons" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={fetchData} className="btn-secondary">
              Recargar Eventos
            </button>
            <button onClick={clearSavedEvents} className="btn-secondary">
              Limpiar Eventos Guardados
            </button>
          </div>*/}
          
          <div className="courses-grid">
            {featuredCourses.length > 0 ? (
              featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="no-courses-message">
                <p>No hay cursos o eventos disponibles en este momento.</p>
                <button onClick={fetchData}>
                  Recargar
                </button>
              </div>
            )}
          </div>
          
          
        </div>
      </section>

      {/* Features Section */}
      <section className="discovery-section features-section">
        <Features 
          title={homeConfig.features?.title} 
          subtitle={homeConfig.features?.subtitle} 
        />
      </section>

      {/* Technologies Section
      <section className="discovery-section tech-section">
        <Tecnologias />
      </section> */}

      {/* Categories Section 
      <section className="discovery-section categories-section">
        <Categorias />
      </section>*/}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
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