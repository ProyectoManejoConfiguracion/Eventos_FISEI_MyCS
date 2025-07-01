import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, Award, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Carrusel from "../Components/carrusel";
import '../Styles/Home.css';
import Features from '../Components/Home/DetalleFeature';
import Tecnologias from '../Components/Tecnologias';
import Categorias from '../Components/Home/Carreras';

const API_BASE_URL = import.meta.env.VITE_BACK_URL;

const ICON_MAP = {
  'Users': Users,
  'Calendar': Calendar,
  'Award': Award,
  'Globe': Globe,
  'MapPin': MapPin
};

/*const DEFAULT_STATS = [
  { id: 1, number: '5,000+', text: 'Estudiantes Formados', icon: 'Users' },
  { id: 2, number: '120+', text: 'Eventos Anuales', icon: 'Calendar' },
  { id: 3, number: '85%', text: 'Tasa de Empleabilidad', icon: 'Award' },
  { id: 4, number: '40+', text: 'Empresas Colaboradoras', icon: 'Globe' }
];*/

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
  const [statsData, setStatsData] = useState([]);
  const [homeConfig, setHomeConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEventsFromAPI = async () => {
    const response = await fetch(`${API_BASE_URL}/api/eventos`);
    if (!response.ok) throw new Error('Error al obtener eventos');
    const data = await response.json();
    return data.filter(event => event.EST_VIS === 'VISIBLE');
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      setHomeConfig(DEFAULT_CONFIG);

      const events = await fetchEventsFromAPI();
      setEventsData(events.slice(0, 6));
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      setError('Ha ocurrido un error al cargar los eventos. Por favor, inténtalo de nuevo más tarde.');
      setEventsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/home?section=stats`)
      .then(res => res.json())
      .then(data => setStatsData(data))
      .catch(() => setStatsData([]));
  }, []);

  const processedStats = statsData.map(stat => ({
    ...stat,
    icon: ICON_MAP[stat.icon] || Users
  }));

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
            {statsData.map((stat) => (
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
          
          {/* Contenedor de eventos */}
          <div className="courses-grid">
            {eventsData.length > 0 ? (
              eventsData.map(event => (
                <EventCard key={event.ID_EVT} event={event} />
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
            <button
              className="view-more-button"
              onClick={() => navigate("/eventos")}
            >
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
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ stat }) => {
  const Icon = ICON_MAP[stat.imagen] || Users;
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={36} />
      </div>
      <div className="stat-number">{stat.titulo}</div>
      <div className="stat-text">{stat.descripcion}</div>
    </div>
  );
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();

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
          src={event.FOT_EVT ? `${API_BASE_URL}/${event.FOT_EVT}` : '/placeholder-image.jpg'} 
          alt={event.NOM_EVT}
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
            {formatDate(event.FEC_EVT)}
          </span>
          <span className="card-type">
            {event.TIP_EVT === 'CURSO' ? 'Curso' : 'Evento'}
          </span>
        </div>
        <h3 className="card-title">{event.NOM_EVT}</h3>
        <p className="card-description">{event.DES_EVT}</p>
        <div className="card-footer">
          <span className="card-location">
            <MapPin size={14} />
            {event.LUG_EVT}
          </span>
          <button
            className="card-button"
            onClick={() => navigate("/eventos", { state: { eventoSeleccionado: event } })}
          >
            Inscribirse →
          </button>
        </div>
      </div>
    </article>
  );
};

export default DiscoveryHome;