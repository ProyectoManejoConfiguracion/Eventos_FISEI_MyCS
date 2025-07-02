import React, { useState, useEffect } from 'react';
import {
  Users, Target, Eye, Heart, Award, BookOpen, Building, Calendar, GraduationCap
} from 'lucide-react';
import '../Styles/Nosotros.css';
import { BACK_URL } from '../../config';

const ICON_MAP = {
  Calendar,
  GraduationCap,
  Users,
  Target,
  Eye,
  Heart,
  Award,
  BookOpen,
  Building
};

const AboutFaculty = () => {
  const [imagenNosotros, setImagenNosotros] = useState({
    imagen: null,
    titulo: '',
    descripcion: ''
  });

  const [tarjetasNosotros, setTarjetasNosotros] = useState([]);

  const [mensajeNosotros1, setMensajeNosotros1] = useState({
    titulo: '',
    descripcion: ''
  });

  const [autoridadesNosotros, setAutoridadesNosotros] = useState([]);

  const [mensajeNosotros2, setMensajeNosotros2] = useState({
    titulo: '',
    descripcion: '',
    imagen: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${BACK_URL}/api/home?section=ImagenNosotros`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const registro = data[0];
          setImagenNosotros({
            imagen: registro.imagen ? `${BACK_URL}/${registro.imagen.replace(/\\/g, "/")}` : null,
            titulo: registro.titulo || '',
            descripcion: registro.descripcion || ''
          });
        }
      })
      .catch(() => setImagenNosotros({
        imagen: null,
        titulo: '',
        descripcion: ''
      }));

    fetch(`${BACK_URL}/api/home?section=tarjetasNosotros`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTarjetasNosotros(data);
        }
      })
      .catch(() => setTarjetasNosotros([]));

    fetch(`${BACK_URL}/api/home?section=mensajeNosotros1`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMensajeNosotros1({
            titulo: data[0].titulo || '',
            descripcion: data[0].descripcion || ''
          });
        }
      })
      .catch(() => setMensajeNosotros1({ titulo: '', descripcion: '' }));

    fetch(`${BACK_URL}/api/home?section=autoridadesNosotros`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAutoridadesNosotros(data);
        }
      })
      .catch(() => setAutoridadesNosotros([]));

    fetch(`${BACK_URL}/api/home?section=mensajeNosotros2`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMensajeNosotros2({
            titulo: data[0].titulo || '',
            descripcion: data[0].descripcion || '',
            imagen: data[0].imagen ? `${BACK_URL}/${data[0].imagen.replace(/\\/g, "/")}` : ''
          });
        }
      })
      .catch(() => setMensajeNosotros2({ titulo: '', descripcion: '', imagen: '' }));

    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="about-faculty">
      {/* Hero Section - ImagenNosotros */}
      <div className='us-container'>
        <div className="hero-section">
          {imagenNosotros.imagen &&
            <img src={imagenNosotros.imagen} alt="Nosotros" className="hero-imagen" />
          }
          <div className='hero-overlay'></div>
          <div className="hero-content">
            <h1 className="hero-title">{imagenNosotros.titulo || "Nosotros"}</h1>
            <p className="hero-subtitle">
              {imagenNosotros.descripcion || "Descubre nuestros eventos académicos y cursos especializados de la facultad"}
            </p>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Segunda sección: tarjetasNosotros */}
        {tarjetasNosotros.length > 0 &&
          <div className="achievements-grid">
            {tarjetasNosotros.map((card, index) => {
              const IconComponent = ICON_MAP[card.imagen] || Award;
              return (
                <div key={index} className="achievement-card">
                  <IconComponent className="achievement-icon" />
                  <h4 className="achievement-title">{card.titulo}</h4>
                  <p className="achievement-description">{card.descripcion}</p>
                </div>
              );
            })}
          </div>
        }

        {/* Tercera sección: mensajeNosotros1 (Objetivo Principal) */}
        {(mensajeNosotros1.titulo || mensajeNosotros1.descripcion) &&
          <div className="objective-section">
            <h3 className="objective-title">{mensajeNosotros1.titulo || "Objetivo Principal"}</h3>
            <p className="objective-text">
              {mensajeNosotros1.descripcion || "Ofrecer una plataforma integral de eventos académicos y cursos especializados..."}
            </p>
          </div>
        }

        {/* Cuarta sección: autoridadesNosotros */}
        {autoridadesNosotros.length > 0 &&
  <div className="authorities-section">
    <h3 className="section-title">Autoridades</h3>
    <div className="authorities-grid">
      {autoridadesNosotros.map((auth, index) => (
        <div key={index} className="authority-card">
          <div className="authority-image">
            {auth.imagen ? (
              <img
                src={`${BACK_URL}/${auth.imagen.replace(/\\/g, "/")}`}
                alt={auth.descripcion}
                className="authority-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <Users className="authority-placeholder" />
            )}
          </div>
          <h4 className="authority-name">{auth.descripcion}</h4>
          <p className="authority-position">{auth.titulo}</p>
        </div>
      ))}
    </div>
  </div>
}

        {/* Quinta sección: mensajeNosotros2 (Historia) */}
        {(mensajeNosotros2.titulo || mensajeNosotros2.descripcion || mensajeNosotros2.imagen) &&
          <div className="history-section">
            <h3 className="section-title">{mensajeNosotros2.titulo || "Nuestra Historia"}</h3>
            <div className="history-content">
              {mensajeNosotros2.imagen &&
                <div className="history-image-container">
                  <img
                    src={mensajeNosotros2.imagen}
                    alt="Historia"
                    className="history-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="history-image-placeholder" style={{ display: 'none' }}>
                    <Building className="history-placeholder" />
                  </div>
                </div>
              }
              <div className="history-text">
                <p className="history-paragraph">
                  {mensajeNosotros2.descripcion}
                </p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default AboutFaculty;