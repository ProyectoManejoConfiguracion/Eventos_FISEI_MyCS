import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import "../Styles/Contactos.css";
import img from '../assets/facultad1.jpg';


const Contactos = () => {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    tipo: '',
    tema: '',
    mensaje: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        BACK_URL + "/Contacto.php",
        JSON.stringify(form),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert(response.data.message || 'Mensaje enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un problema al enviar tu mensaje.');
    }
  };

  return (
    <div className="contact-container">
      
      <div className="contact-hero">
        <img
          src={img}
          alt="Banner"
          className="hero-image"
        />
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
                <p className="card-text">(03) 285-1894</p>
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
                <p className="card-text">talleresfisei@uta.edu.ec</p>
                <p className="card-text">ctt.fisei@uta.edu.ec</p>
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
            <form className="formulario-container" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  className="input-field"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  className="input-field"
                  value={form.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="tipo"
                  placeholder="Teléfono"
                  className="input-field"
                  value={form.tipo}
                  onChange={handleChange}
                />
                <select
                  name="tema"
                  className="input-field"
                  value={form.tema}
                  onChange={handleChange}
                  required
                >
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
                value={form.mensaje}
                onChange={handleChange}
                required
              ></textarea>

              <button className="submit-button" type="submit">Enviar mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactos;
