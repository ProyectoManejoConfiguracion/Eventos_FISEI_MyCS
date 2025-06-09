import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock } from 'lucide-react';
import '../../Styles/Asistencia_Est.css';

const Asistencia = () => {
  const [activeTab, setActiveTab] = useState('cursos');

  // Datos de cursos (por días)
  const coursesData = [
    {
      id: 1,
      name: "Desarrollo Web Full Stack",
      attendedDays: 18,
      totalDays: 20,
      percentage: 90,
      type: "curso"
    },
    {
      id: 2,
      name: "Marketing Digital",
      attendedDays: 13,
      totalDays: 20,
      percentage: 65,
      type: "curso"
    },
    {
      id: 3,
      name: "Diseño UX/UI",
      attendedDays: 8,
      totalDays: 20,
      percentage: 40,
      type: "curso"
    }
  ];

  // Datos de eventos (por días)
  const eventsData = [
    {
      id: 1,
      name: "Conferencia de Tecnología 2024",
      attendedDays: 4,
      totalDays: 5,
      percentage: 80,
      type: "evento"
    },
    {
      id: 2,
      name: "Workshop de Emprendimiento",
      attendedDays: 3,
      totalDays: 4,
      percentage: 75,
      type: "evento"
    },
    {
      id: 3,
      name: "Seminario de Innovación",
      attendedDays: 1,
      totalDays: 2,
      percentage: 50,
      type: "evento"
    },
    {
      id: 4,
      name: "Hackathon Nacional",
      attendedDays: 2,
      totalDays: 3,
      percentage: 67,
      type: "evento"
    }
  ];

  const getProgressClass = (percentage) => {
    if (percentage >= 75) return 'progress-green';
    if (percentage >= 50) return 'progress-yellow';
    return 'progress-red';
  };

  const getPercentageClass = (percentage) => {
    if (percentage >= 75) return 'percentage-green';
    if (percentage >= 50) return 'percentage-yellow';
    return 'percentage-red';
  };

  const getCardClass = (percentage) => {
    if (percentage >= 75) return 'card-green';
    if (percentage >= 50) return 'card-yellow';
    return 'card-red';
  };

  const renderAttendanceItems = (data, type) => {
    return data.map((item) => (
      <div
        key={item.id}
        className={`course-card ${getCardClass(item.percentage)}`}
      >
        <div className="course-header">
          <div className="course-info">
            <div className="course-title-section">
              <h3 className="course-title">
                {item.name}
              </h3>
              <span className={`type-badge ${item.type === 'curso' ? 'badge-curso' : 'badge-evento'}`}>
                {item.type === 'curso' ? 'CURSO' : 'EVENTO'}
              </span>
            </div>
            <div className="course-stats">
              <Calendar className="calendar-icon" />
              <span className="stats-text">
                {item.attendedDays} de {item.totalDays} días asistidos
              </span>
            </div>
          </div>
          <div className={`percentage-badge ${getPercentageClass(item.percentage)}`}>
            {item.percentage}%
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className={`progress-fill ${getProgressClass(item.percentage)}`}
              style={{ width: `${item.percentage}%` }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <div className="progress-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="attendance-container">
      <div className="attendance-wrapper">
        {/* Header */}
        <div className="header-container">
          <h1 className="header-title">
            Control de Asistencia
          </h1>
          <p className="header-subtitle">Seguimiento de tu progreso académico y eventos</p>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'cursos' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('cursos')}
          >
            <BookOpen className="tab-icon" />
            <span>Cursos</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'eventos' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('eventos')}
          >
            <Clock className="tab-icon" />
            <span>Eventos</span>
          </button>
        </div>

        {/* Content */}
        <div className="courses-list">
          {activeTab === 'cursos' 
            ? renderAttendanceItems(coursesData, 'cursos')
            : renderAttendanceItems(eventsData, 'eventos')
          }
        </div>

      </div>
    </div>
  );
};

export default Asistencia;