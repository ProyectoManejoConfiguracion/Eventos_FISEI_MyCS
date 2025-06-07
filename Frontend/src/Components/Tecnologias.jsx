import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaJava, FaReact, FaNodeJs } from 'react-icons/fa';
import { IoLogoJavascript } from "react-icons/io";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiBlazor } from "react-icons/si";
import '../Styles/Tecnologias.css';

const technologies = [
  { name: "Java", icon: FaJava, color: ' #5382A1', category: "backend" },
  { name: "JavaScript", icon: IoLogoJavascript, color: "#F7DF1E", category: "frontend" },
  { name: "React", icon: FaReact, color: "#61DAFB", category: "frontend" },
  { name: "Node.js", icon: FaNodeJs, color: "#339933", category: "backend" },
  { name: "SQL", icon: BiLogoPostgresql, color: "#336791", category: "database" },
  { name: "Blazor", icon: SiBlazor, color: "#512BD4", category: "framework" },
];

const TechnologiesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % technologies.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + technologies.length) % technologies.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="technologies-section">
      <div className="technologies-container">
        {/* Header */}
        <header className="technologies-header">
          <div className="technologies-title-container">
            <h1 className="technologies-title">
              EXPLORA<br />
              <span className="technologies-gradient-title">NUESTRAS TECNOLOGÍAS</span>
            </h1>
          </div>

          {/* Buttons */}
          <div className="technologies-nav-buttons">
            <button
              onClick={prevSlide}
              className="technologies-nav-button"
              aria-label="Anterior tecnología"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="technologies-nav-button"
              aria-label="Siguiente tecnología"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </header>

        {/* Carousel */}
        <div
          className="technologies-carousel-container"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="technologies-carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (50 / 1)}%)`,
              width: `${(technologies.length / 4) * 10}%`
            }}
          >
            {technologies.map(({ name, icon: Icon, color, category }, index) => (
              <div key={`${name}-${index}`} className="technologies-carousel-slide">
                <div className="technologies-card-perspective">
                  <div className="technologies-card" style={{ background: color }}>
                    <div className="technologies-card-decorator-1" />
                    <div className="technologies-card-decorator-2" />
                    <div className="technologies-card-decorator-3" />

                    <div className="technologies-card-icon-container">
                      <Icon size={48} className="technologies-card-icon" />
                    </div>

                    <h3 className="technologies-card-title">{name}</h3>
                    <div className="technologies-card-badge">{category}</div>
                    <div className="technologies-card-hover-overlay" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="technologies-footer">
          <p className="technologies-footer-text">
            Domina las herramientas más demandadas en la industria
          </p>
        </footer>
      </div>
    </section>
  );
};

export default TechnologiesCarousel;
