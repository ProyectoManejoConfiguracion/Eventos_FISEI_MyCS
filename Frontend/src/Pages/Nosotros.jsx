import React from 'react';
import { Users, Target, Eye, Heart, Award, BookOpen, Building, Calendar, GraduationCap } from 'lucide-react';
import '../Styles/Nosotros.css';
import US from '../assets/arduino.png';
import Decano from '../assets/decano.png';
import Subdecano from '../assets/subdecano.png';
import CTT from '../assets/ctt.png';
import Fisei from '../assets/fisei.jpg';

const AboutFaculty = () => {
  const authorities = [
    {
      name: "Ing. Franklin Mayorga, Mg.",
      position: "Decano",
      image: Decano,
      description: "FISEI"
    },
    {
      name: "Ing. Luis Morales, Mg.",
      position: "Subdecano", 
      image: Subdecano,
      description: "FISEI"
    },
    {
      name: "Ing. Daniel Jerez, Mg.",
      position: "Responsable",
      image: CTT,
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

  return (
    <div className="about-faculty">
      {/* Hero Section */}
      <div className='us-container'>
        <div className="hero-section">
          <img src={US} alt="Eventos y Cursos" className="hero-imagen" />
          <div className='hero-overlay'></div>
          <div className="hero-content">
            <h1 className="hero-title">Nosotros</h1>
            <p className="hero-subtitle">
              Descubre nuestros eventos académicos y cursos especializados de la facultad
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
              Proporcionar eventos académicos de calidad y cursos especializados que 
              complementen la formación profesional, conectando a estudiantes y 
              profesionales con las últimas tendencias del sector.
            </p>
          </div>

          <div className="mvv-card vision-card">
            <div className="mvv-header">
              <Eye className="mvv-icon vision-icon" />
              <h3 className="mvv-title">Visión</h3>
            </div>
            <p className="mvv-text">
              Ser la plataforma líder de eventos y cursos especializados de la región, 
              reconocida por la calidad de sus contenidos y su contribución al desarrollo 
              profesional continuo.
            </p>
          </div>

          <div className="mvv-card values-card">
            <div className="mvv-header">
              <Heart className="mvv-icon values-icon" />
              <h3 className="mvv-title">Valores</h3>
            </div>
            <ul className="values-list">
              <li>• Excelencia en contenidos</li>
              <li>• Actualización constante</li>
              <li>• Accesibilidad e inclusión</li>
              <li>• Networking profesional</li>
              <li>• Innovación educativa</li>
            </ul>
          </div>
        </div>

        {/* Objective */}
        <div className="objective-section">
          <h3 className="objective-title">Objetivo Principal</h3>
          <p className="objective-text">
            Ofrecer una plataforma integral de eventos académicos y cursos especializados 
            que fortalezcan las competencias profesionales y fomenten el intercambio de 
            conocimientos entre la comunidad académica y el sector productivo.
          </p>
        </div>

        {/* Authorities */}
        <div className="authorities-section">
          <h3 className="section-title">Autoridades</h3>
          <div className="authorities-grid">
            {authorities.map((authority, index) => (
              <div key={index} className="authority-card">
                <div className="authority-image">
                  <img 
                    src={authority.image} 
                    alt={authority.name}
                    className="authority-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Users className="authority-placeholder" style={{display: 'none'}} />
                </div>
                <h4 className="authority-name">{authority.name}</h4>
                <p className="authority-position">{authority.position}</p>
                <p className="authority-description">{authority.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="history-section">
          <h3 className="section-title">Nuestra Historia</h3>
          <div className="history-content">
            <div className="history-text">
              <p className="history-paragraph">
                El 20 de octubre de 2002 se crea el Centro de Transferencia y Desarrollo de Tecnologías 
                mediante resolución 1452-2002-CU-P en la áreas de Ingenierías en Sistemas, Electrónica e 
                Industrial de la Universidad Técnica de Ambato, para proveer servicios a la comunidad mediante
                 la realización de trabajos y proyectos específicos , asesorías, estudios, investigaciones, 
                 cursos de entrenamiento, seminarios y otras actividades de servicios a los sectores sociales 
                 y productivos en las áreas de Ingeniería en Sistemas computacionales e Informáticos, Ingeniería 
                 Electrónica y Comunicaciones e Ingeniería Industrial en Procesos de Automatización.


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

        {/* Programs 
        <div className="programs-section">
          <h3 className="section-title">Nuestra Oferta</h3>
          <div className="programs-grid">
            <div className="program-card pregrado">
              <h4 className="program-title">Eventos</h4>
              <ul className="program-list">
                <li>• Conferencias magistrales</li>
                <li>• Seminarios especializados</li>
                <li>• Talleres prácticos</li>
                <li>• Simposios académicos</li>
              </ul>
            </div>
            <div className="program-card posgrado">
              <h4 className="program-title">Cursos</h4>
              <ul className="program-list">
                <li>• Certificaciones profesionales</li>
                <li>• Cursos en línea</li>
                <li>• Programas intensivos</li>
                <li>• Capacitación empresarial</li>
              </ul>
            </div>
            <div className="program-card educacion-continua">
              <h4 className="program-title">Servicios</h4>
              <ul className="program-list">
                <li>• Consultoría académica</li>
                <li>• Asesoría en proyectos</li>
                <li>• Networking profesional</li>
                <li>• Bolsa de empleo</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AboutFaculty;