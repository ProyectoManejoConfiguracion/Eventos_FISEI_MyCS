import React, { useMemo } from 'react';
import { MapPin, Users, Calendar, Award, Globe } from 'lucide-react';
import Carrusel from "../Components/carrusel";
import '../Styles/Home.css';
import eventos1 from '../assets/concurso.png';
import eventos2 from '../assets/robots.png';
import curso3 from '../assets/datos.png';
import Features from '../Components/Home/DetalleFeature';
import Tecnologias from '../Components/Tecnologias';
import Categorias from '../Components/Home/Carreras';

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

const STATS_DATA = [
  { number: '5,000+', text: 'Estudiantes Formados', icon: Users },
  { number: '120+', text: 'Eventos Anuales', icon: Calendar },
  { number: '85%', text: 'Tasa de Empleabilidad', icon: Award },
  { number: '40+', text: 'Empresas Colaboradoras', icon: Globe }
];

const DiscoveryHome = () => {
  const coursesData = useMemo(() => COURSES_DATA, []);

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
            {STATS_DATA.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section 
      <section className="discovery-section">
        <div className="section-container">
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
      */}

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
        <Categorias />
      </section>
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
  const CourseCard = ({ course }) => (
  <article className="discovery-card">
    <div className="card-image-container">
      <img 
        src={course.image} 
        alt={course.title}
        className="card-image"
        loading="lazy"
      />
    </div>
    
    <div className="card-content">
      <div className="card-meta">
        <span className="card-date">
          {new Date(course.fecha).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
          })}
        </span>
        <span className="card-type">{course.type === 'evento' ? 'Evento' : 'Curso'}</span>
      </div>
      
      <h3 className="card-title">{course.title}</h3>
      <p className="card-description">{course.description}</p>
      
      <div className="card-footer">
        <span className="card-location">
          <MapPin size={14} />
          {course.lugar}
        </span>
        <button className="card-button">
          {course.type === 'evento' ? 'Inscribirse →' : 'Más información →'}
        </button>
      </div>
    </div>
  </article>
  );



export default DiscoveryHome;