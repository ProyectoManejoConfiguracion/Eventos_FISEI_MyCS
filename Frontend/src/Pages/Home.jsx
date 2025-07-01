import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, Award, Globe } from 'lucide-react';
import Carrusel from "../Components/carrusel";
import '../Styles/Home.css';
import Features from '../Components/Home/DetalleFeature';
import Tecnologias from '../Components/Tecnologias';
import Categorias from '../Components/Home/Carreras';

// CONFIGURACIÓN DE API: Preparado para conexión futura
const API_BASE_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000';

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

// Datos de eventos mock (para desarrollo)
const MOCK_EVENTS = [
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
  const [eventsData, setEventsData] = useState([]);
  const [statsData, setStatsData] = useState(DEFAULT_STATS);
  const [homeConfig, setHomeConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el usuario actual del localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al obtener usuario del localStorage:', error);
      return null;
    }
  };

  // Obtener eventos guardados del usuario
  const getSavedEventIds = () => {
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

  // Guardar IDs de eventos para el usuario actual
  const saveUserEventIds = (eventIds) => {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) return;

      localStorage.setItem(`userEvents_${user.id}`, JSON.stringify(eventIds));
      console.log(`Eventos guardados para usuario ${user.id}:`, eventIds);
    } catch (error) {
      console.error('Error al guardar eventos:', error);
    }
  };

  // Función para obtener eventos desde la API (simulada por ahora)
  const fetchEventsFromAPI = async () => {
    const response = await fetch(`${API_BASE_URL}/api/events?status=open&limit=6`);
    if (!response.ok) throw new Error('Error al obtener eventos');
    return await response.json();
  };

  // Función para obtener eventos por IDs (simulada por ahora)
  const fetchEventsByIds = async (eventIds) => {
    try {
      // SIMULACIÓN: Esta función será reemplazada con la llamada real a la API
      // En una implementación real, esto sería algo como:
      // const response = await fetch(`${API_BASE_URL}/events/by-ids`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ids: eventIds })
      // });
      // if (!response.ok) throw new Error('Error al obtener eventos por IDs');
      // return await response.json();
      
      // Por ahora, simulamos un delay para imitar la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtramos los eventos mock por ID
      const events = MOCK_EVENTS.filter(event => eventIds.includes(event.id));
      
      // Si no encontramos suficientes eventos, completamos hasta 6
      if (events.length < 6) {
        const remainingCount = 6 - events.length;
        const existingIds = events.map(e => e.id);
        const additionalEvents = MOCK_EVENTS
          .filter(event => !existingIds.includes(event.id) && event.estado === 'abierto')
          .slice(0, remainingCount);
        
        return [...events, ...additionalEvents];
      }
      
      return events;
    } catch (error) {
      console.error('Error al obtener eventos por IDs:', error);
      throw error;
    }
  };

  // Función principal para cargar datos
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar configuración y estadísticas (estáticas por ahora)
      setStatsData(DEFAULT_STATS);
      setHomeConfig(DEFAULT_CONFIG);

      // Verificar si hay eventos guardados para el usuario actual
      const savedEventIds = getSavedEventIds();
      
      let events = [];

      if (savedEventIds && savedEventIds.length > 0) {
        console.log('Cargando eventos guardados del usuario:', savedEventIds);
        // Cargar eventos guardados por IDs
        events = await fetchEventsByIds(savedEventIds);
      } else {
        console.log('No hay eventos guardados, cargando eventos recomendados');
        // Cargar eventos recomendados/destacados
        events = await fetchEventsFromAPI();
        
        // Guardar estos eventos para el usuario si está logueado
        if (events.length > 0 && getCurrentUser()) {
          saveUserEventIds(events.map(event => event.id));
        }
      }

      // Asegurarnos de que siempre tenemos exactamente 6 eventos
      if (events.length < 6) {
        // Si no tenemos suficientes eventos, completar con eventos adicionales
        const additionalEvents = await fetchEventsFromAPI();
        const existingIds = events.map(e => e.id);
        const newEvents = additionalEvents.filter(e => !existingIds.includes(e.id));
        
        events = [...events, ...newEvents].slice(0, 6);
      } else if (events.length > 6) {
        // Si tenemos más de 6 eventos, mostrar solo los primeros 6
        events = events.slice(0, 6);
      }

      setEventsData(events);
      
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      setError('Ha ocurrido un error al cargar los eventos. Por favor, inténtalo de nuevo más tarde.');
      
      // En caso de error, usar datos mock como fallback
      setEventsData(MOCK_EVENTS.slice(0, 6));
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
        loadEvents(); // Recargar eventos
      }
    } catch (error) {
      console.error('Error al limpiar eventos guardados:', error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadEvents();
  }, []);

  // Procesar estadísticas con íconos
  const processedStats = statsData.map(stat => ({
    ...stat,
    icon: ICON_MAP[stat.icon] || Users
  }));

  // Preparar skeleton loader para estado de carga
  if (loading) {
    return (
      <div className="discovery-container">
        <div className="loading-container">
          <p>Cargando contenido...</p>
          {/* Aquí podrías agregar un spinner o skeleton loader */}
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

      {/* Eventos Section */}
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
          
          {/* Contenedor de eventos (siempre muestra exactamente 6) */}
          <div className="courses-grid">
            {eventsData.length > 0 ? (
              eventsData.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="no-courses-message">
                <p>No hay eventos disponibles en este momento.</p>
                <button onClick={loadEvents} className="reload-button">
                  Intentar de nuevo
                </button>
              </div>
            )}
          </div>
          
          {/* Botón para ver más eventos (opcional) */}
          <div className="view-more-container">
            <button className="view-more-button">
              Ver todos los eventos
            </button>
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

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="close-error">×</button>
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

const EventCard = ({ event }) => {
  // Formatear fecha para mostrar día y mes
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return 'Fecha por confirmar';
    }
  };

  return (
    <article className="discovery-card">
      <div className="card-image-container">
        <img 
          src={event.image || event.imageUrl || '/placeholder-image.jpg'} 
          alt={event.title}
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
            {formatDate(event.fecha || event.date)}
          </span>
          <span className="card-type">
            {event.type === 'evento' || event.type === 'event' ? 'Evento' : 'Curso'}
          </span>
        </div>
        
        <h3 className="card-title">{event.title}</h3>
        <p className="card-description">{event.description}</p>
        
        <div className="card-footer">
          <span className="card-location">
            <MapPin size={14} />
            {event.lugar || event.location || 'Ubicación por confirmar'}
          </span>
          <button className="card-button">
            Inscribirse →
          </button>
        </div>
      </div>
    </article>
  );
};

export default DiscoveryHome;