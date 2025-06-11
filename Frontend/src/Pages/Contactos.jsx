import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import "../Styles/Contactos.css";
import img from "../assets/facultad1.jpg";

const Contactos = () => {
  const [contactData, setContactData] = useState({
    TELF: "(03) 285-1894",
    EMAIL_A: "talleresfisei@uta.edu.ec",
    EMAIL_B: "ctt.fisei@uta.edu.ec"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('https://eventos-fisei-mycs.onrender.com/api/web');
        if (!response.ok) {
          throw new Error('No se pudo cargar la información de contacto');
        }
        const data = await response.json();
        
        setContactData({
          TELF: data.TELF || "(03) 285-1894",
          EMAIL_A: data.EMAIL_A || "talleresfisei@uta.edu.ec",
          EMAIL_B: data.EMAIL_B || "ctt.fisei@uta.edu.ec"
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching contact data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return <div className="loading-contact">Cargando información de contacto...</div>;
  }

  if (error) {
    return <div className="error-contact">Error: {error}</div>;
  }

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <img src={img} alt="Banner" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Contáctanos</h1>
        </div>
      </div>
      <div className="main-content">
        <div className="cards-grid">
          <div className="contact-card">
            <div className="card-content">
              <div className="icon-wrapper icon-wrapper-blue">
                <Phone className="icon" />
              </div>
              <div className="card-info">
                <h4 className="card-title">Llámanos</h4>
                <p className="card-text">{contactData.TELF}</p>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <div className="card-content">
              <div className="icon-wrapper icon-wrapper-green">
                <Mail className="icon" />
              </div>
              <div>
                <h4 className="card-title">Email</h4>
                <p className="card-text">{contactData.EMAIL_A}</p>
                <p className="card-text">{contactData.EMAIL_B}</p>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <div className="card-content">
              <div className="icon-wrapper icon-wrapper-purple">
                <MapPin className="icon" />
              </div>
              <div>
                <h4 className="card-title">Visítanos</h4>
                <p className="card-text">Av. Los Chasquis y Rio Guayllabamba</p>
              </div>
            </div>
          </div>

          <div className="formulario-section">
            <h3 className="section-title">Envíanos un mensaje</h3>
            <form className="formulario-container">
              <div className="input-group">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  className="input-field"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="tipo"
                  placeholder="Teléfono"
                  className="input-field"
                />
                <select name="tema" className="input-field" required>
                  <option value="">Seleccione un tema</option>
                  <option value="compra">Eventos</option>
                  <option value="venta">Congresos</option>
                  <option value="financiamiento">Cursos</option>
                  <option value="postventa">Webinar</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <textarea
                name="mensaje"
                placeholder="Mensaje"
                rows="5"
                className="input-field textarea"
                required
              ></textarea>

              <button className="submit-button" type="submit">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactos;