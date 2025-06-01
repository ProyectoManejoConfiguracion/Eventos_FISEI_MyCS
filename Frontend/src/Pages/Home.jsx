import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, MapPin, Users, Award, Globe, Cpu } from 'lucide-react';
import Carrusel from "../Components/carrusel"
import '../Styles/Home.css';
import eventos1 from '../assets/concurso.png';
import eventos2 from '../assets/robots.png';
import curso3 from '../assets/datos.png';

// Datos constantes movidos fuera del componente para evitar re-creaciones
const COURSES_DATA = [
  {
    id: 1,
    title: 'CONCURSO DE PROGRAMACIÓN',
    image: eventos1,
    fecha: '2023-10-01',
    lugar: 'Auditorio FISEI',
    description: 'Participa en nuestro concurso anual de programación y demuestra tus habilidades técnicas.',
    type: 'evento'
  },
  {
    id: 2,
    title: 'Fundamentos de Python Avanzado',
    image: eventos2,
    fecha: '2025-04-01',
    lugar: 'Auditorio FISEI',
    description: 'Domina Python desde conceptos básicos hasta técnicas avanzadas de programación.',
    type: 'curso'
  },
  {
    id: 3,
    title: 'Ciberseguridad en Dispositivos Finales',
    image: curso3,
    fecha: '2025-04-01',
    lugar: 'Auditorio FISEI',
    description: 'Aprende a proteger dispositivos contra amenazas cibernéticas modernas.',
    type: 'curso'
  }
];

const TECHNOLOGIES_DATA = [
  { name: "Java", image: "/api/placeholder/60/60", category: "backend" },
  { name: "JavaScript", image: "/api/placeholder/60/60", category: "frontend" },
  { name: "React", image: "/api/placeholder/60/60", category: "frontend" },
  { name: "Node.js", image: "/api/placeholder/60/60", category: "backend" },
  { name: "SQL", image: "/api/placeholder/60/60", category: "cloud" },
  { name: "Docker", image: "/api/placeholder/60/60", category: "devops" },
];

const CATEGORIES_DATA = [
  { id: 1, name: 'SOFTWARE', icon: 'laptop-code', color: '#3b82f6' },
  { id: 2, name: 'TELECOMUNICACIONES', icon: 'broadcast-tower', color: '#10b981' },
  { id: 3, name: 'TI', icon: 'server', color: '#f59e0b' },
  { id: 4, name: 'INDUSTRIAL', icon: 'cogs', color: '#ef4444' },
  { id: 5, name: 'ROBÓTICA', icon: 'robot', color: '#8b5cf6' }
];

const STATS_DATA = [
  { number: '5,000+', text: 'Estudiantes Formados', icon: Users },
  { number: '120+', text: 'Eventos Anuales', icon: Calendar },
  { number: '85%', text: 'Tasa de Empleabilidad', icon: Award },
  { number: '40+', text: 'Empresas Colaboradoras', icon: Globe }
];

const FEATURES_DATA = [
  {
    icon: '👨‍🏫',
    title: 'Profesores Expertos',
    description: 'Profesionales en activo con años de experiencia en la industria tecnológica.'
  },
  {
    icon: '💻',
    title: 'Infraestructura Moderna',
    description: 'Laboratorios completamente equipados con la tecnología más reciente.'
  },
  {
    icon: '🔄',
    title: 'Metodología Práctica',
    description: 'Aprendizaje basado en proyectos reales y casos de estudio actuales.'
  },
  /*{
    icon: '🌐',
    title: 'Red de Contactos',
    description: 'Conexión directa con empleadores y comunidades tecnológicas.'
  }*/
];

// Componente para las estadísticas
const StatCard = ({ stat }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <stat.icon size={24} />
    </div>
    <div className="stat-number">{stat.number}</div>
    <div className="stat-text">{stat.text}</div>
  </div>
);

// Componente para las tarjetas de curso/evento
const CourseCard = ({ course }) => (
  <article className="course-card">
    <div className="course-image-container">
      <img 
        src={course.image} 
        alt={course.title}
        className="course-image"
        loading="lazy"
      />
      <div className="course-type-badge">
        {course.type === 'evento' ? 'Evento' : 'Curso'}
      </div>
    </div>
    
    <div className="course-info">
      <h3 className="course-title">{course.title}</h3>
      
      <div className="course-meta">
        <span className="meta-item">
          <Calendar size={14} />
          {new Date(course.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <span className="meta-item">
          <MapPin size={14} />
          {course.lugar}
        </span>
      </div>
      
      <p className="course-description">{course.description}</p>
      
      <button 
        className="btn btn-secondary course-btn"
        aria-label={`Ver más información sobre ${course.title}`}
      >
        {course.type === 'evento' ? 'Inscríbete' : 'Más Información'}
      </button>
    </div>
  </article>
);

// Componente para tecnologías
const TechCard = ({ tech }) => (
  <div className="tech-card" title={tech.name}>
    <img 
      src={tech.image} 
      alt={`Logo de ${tech.name}`}
      className="tech-image"
      loading="lazy"
    />
    <p className="tech-name">{tech.name}</p>
  </div>
);

// Componente para categorías
const CategoryCard = ({ category }) => (
  <div 
    className="category-card"
    style={{ '--category-color': category.color }}
    role="button"
    tabIndex={0}
    onClick={() => console.log(`Categoría seleccionada: ${category.name}`)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        console.log(`Categoría seleccionada: ${category.name}`);
      }
    }}
  >
    <h4 className="category-name">{category.name}</h4>
  </div>
);

// Componente principal mejorado
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Memoizar datos que no cambian
  const coursesData = useMemo(() => COURSES_DATA, []);
  const technologiesData = useMemo(() => TECHNOLOGIES_DATA, []);
  
  // Funciones optimizadas con useCallback
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % coursesData.length);
  }, [coursesData.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + coursesData.length) % coursesData.length);
  }, [coursesData.length]);

  const handleNewsletterSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsNewsletterLoading(true);
    
    // Simulación de envío
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('¡Gracias por suscribirte!');
      setEmail('');
    } catch (error) {
      console.error('Error al suscribirse:', error);
      alert('Hubo un error. Por favor intenta de nuevo.');
    } finally {
      setIsNewsletterLoading(false);
    }
  }, [email]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" aria-label="Sección principal">
        <Carrusel/>
      </section>
      
      {/* Commitment Section */}
      <section className="commitment-section">
        <div className="commitment-container">
          <h2 className="commitment-title">Compromiso con el desarrollo tecnológico</h2>
          <p className="commitment-subtitle">CURSOS EVENTOS VIRTUALES Y PRESENCIALES</p>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section" aria-label="Estadísticas institucionales">
        <div className="container">
          <div className="stats-grid">
            {STATS_DATA.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses-section" aria-label="Eventos y cursos destacados">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">Eventos y Cursos Destacados</h2>
            <p className="section-subtitle">
              Descubre las últimas oportunidades para desarrollar tus habilidades tecnológicas
            </p>
          </header>
          
          <div className="courses-grid">
            {coursesData.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" aria-label="Por qué elegirnos">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">¿Por qué elegirnos?</h2>
            <p className="section-subtitle">
              Nuestro compromiso con la excelencia educativa nos distingue
            </p>
          </header>
          
          <div className="features-grid">
            {FEATURES_DATA.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="technologies-section" aria-label="Tecnologías que enseñamos">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">Tecnologías que enseñamos</h2>
            <p className="section-subtitle">
              Mantente a la vanguardia con las habilidades más demandadas en la industria
            </p>
          </header>
          
          <div className="tech-grid">
            {technologiesData.map((tech, index) => (
              <TechCard key={index} tech={tech} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
       <section class="categories-section">
        <div class="container categories-container">
            <header class="section-header">
                <h2 class="section-title">EXPLORA LOS EVENTOS POR FACULTADES</h2>
                <p class="section-subtitle">
                    Encuentra eventos que se ajusten a tus intereses y especialización académica
                </p>
            </header>
            
            <div class="categories-grid">
                <div class="category-card" onclick="selectCategory('SOFTWARE')">
                    <div class="category-icon">💻</div>
                    <h4 class="category-name">SOFTWARE</h4>
                </div>
                
                <div class="category-card" onclick="selectCategory('TELECOMUNICACIONES')">
                    <div class="category-icon">📡</div>
                    <h4 class="category-name">TELECOMUNICACIONES</h4>
                </div>
                
                <div class="category-card" onclick="selectCategory('TI')">
                    <div class="category-icon">🖥️</div>
                    <h4 class="category-name">TECNOLOGÍAS DE LA INFORMACIÓN</h4>
                </div>
                
                <div class="category-card" onclick="selectCategory('INDUSTRIAL')">
                    <div class="category-icon">⚙️</div>
                    <h4 class="category-name">INDUSTRIAL</h4>
                </div>
                
                <div class="category-card" onclick="selectCategory('ROBOTICA')">
                    <div class="category-icon">🤖</div>
                    <h4 class="category-name">ROBÓTICA</h4>
                </div>
            </div>
        </div>
    </section>

    </div>
  );
};

export default Home;