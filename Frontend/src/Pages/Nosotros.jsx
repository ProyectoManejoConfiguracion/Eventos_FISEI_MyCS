import React, { useState, useEffect } from 'react';
import { Users, Target, Eye, Heart, Award, BookOpen, Building, Calendar, GraduationCap } from 'lucide-react';
import '../Styles/Nosotros.css';
import US from '../assets/arduino.png';
import Fisei from '../assets/fisei.png';

const AboutFaculty = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://eventos-fisei-mycs.onrender.com/api/web');
        if (!response.ok) {
          throw new Error('No se pudo cargar el contenido');
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const authorities = [
    {
      name: content?.DECANO || "Ing. Franklin Mayorga, Mg.",
      position: "Decano",
      description: "FISEI"
    },
    {
      name: content?.SUBDECANO || "Ing. Luis Morales, Mg.", 
      position: "Subdecano", 
      description: "FISEI"
    },
    {
      name: content?.CTT || "Ing. Daniel Jerez, Mg.",
      position: "Responsable",
      description: "CTT"
    }
  ];

  const achievements = [
    {
      title: "Eventos Especializados",
      description: "Organizamos conferencias, seminarios y talleres con expertos del sector",
      icon: Calendar
    },
    {
      title: "Cursos de Calidad",
      description: "Ofrecemos cursos actualizados y certificaciones reconocidas",
      icon: GraduationCap
    },
    {
      title: "Red de Profesionales",
      description: "Conectamos estudiantes con profesionales y empresas líderes",
      icon: Users
    }
  ];

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="about-faculty">
      {/* Hero Section */}
      <div className='us-container'>
        <div className="hero-section">
          <img src={US} alt="Eventos y Cursos" className="hero-imagen" />
          <div className='hero-overlay'></div>
          <div className="hero-content">
            <h1 className="hero-title">{content?.TITLE || "Nosotros"}</h1>
            <p className="hero-subtitle">
              {content?.SUBTITLE || "Descubre nuestros eventos académicos y cursos especializados de la facultad"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        {/* Achievements Section */}
        <div className="achievements-grid">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div key={index} className="achievement-card">
                <IconComponent className="achievement-icon" />
                <h4 className="achievement-title">{achievement.title}</h4>
                <p className="achievement-description">{achievement.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mission, Vision, Values */}
        <div className="mvv-grid">
          <div className="mvv-card mission-card">
            <div className="mvv-header">
              <Target className="mvv-icon mission-icon" />
              <h3 className="mvv-title">Misión</h3>
            </div>
            <p className="mvv-text">
              {content?.MISION || "Proporcionar eventos académicos de calidad y cursos especializados que complementen la formación profesional..."}
            </p>
          </div>

          <div className="mvv-card vision-card">
            <div className="mvv-header">
              <Eye className="mvv-icon vision-icon" />
              <h3 className="mvv-title">Visión</h3>
            </div>
            <p className="mvv-text">
              {content?.VISION || "Ser la plataforma líder de eventos y cursos especializados de la región..."}
            </p>
          </div>

          <div className="mvv-card values-card">
            <div className="mvv-header">
              <Heart className="mvv-icon values-icon" />
              <h3 className="mvv-title">Valores</h3>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content?.VALOR || `
              <li>• Excelencia en contenidos</li>
              <li>• Actualización constante</li>
              <li>• Accesibilidad e inclusión</li>
              <li>• Networking profesional</li>
              <li>• Innovación educativa</li>
            `}} />
          </div>
        </div>

        {/* Objective */}
        <div className="objective-section">
          <h3 className="objective-title">Objetivo Principal</h3>
          <p className="objective-text">
            {content?.OBJETIVE || "Ofrecer una plataforma integral de eventos académicos y cursos especializados..."}
          </p>
        </div>

        {/* Authorities - ya usa los datos dinámicos */}
        <div className="authorities-section">
          <h3 className="section-title">Autoridades</h3>
          <div className="authorities-grid">
            {authorities.map((authority, index) => (
              <div key={index} className="authority-card">
                <h4 className="authority-name">{authority.name}</h4>
                <p className="authority-position">{authority.position}</p>
                <p className="authority-description">{authority.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History (sección estática que no requiere datos dinámicos) */}
        <div className="history-section">
          <h3 className="section-title">Nuestra Historia</h3>
          <div className="history-content">
            <div className="history-text">
              <p className="history-paragraph">
                El 20 de octubre de 2002 se crea el Centro de Transferencia y Desarrollo de Tecnologías 
                mediante resolución 1452-2002-CU-P en la áreas de Ingenierías en Sistemas, Electrónica e 
                Industrial de la Universidad Técnica de Ambato...
              </p>
              <p className="history-paragraph">
                Nuestro compromiso es mantener actualizada la oferta formativa, 
                incorporando las últimas tendencias tecnológicas y metodológicas 
                del sector académico y empresarial.
              </p>
            </div>
            <div className="history-image-container">
              <img 
                src={Fisei} 
                alt="Trayectoria de Eventos" 
                className="history-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="history-image-placeholder" style={{display: 'none'}}>
                <Building className="history-placeholder" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutFaculty;