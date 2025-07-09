import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import "../Styles/Contactos.css";
import { BACK_URL } from "../../config";

const ICON_MAP = {
  Phone,
  Mail,
  MapPin
};

const Contactos = () => {
  const [banner, setBanner] = useState({ imagen: "", titulo: "CONTÁCTANOS" });
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const resBanner = await fetch(`${BACK_URL}/api/home?section=ImagenContactanos`);
        const dataBanner = await resBanner.json();
        if (Array.isArray(dataBanner) && dataBanner.length > 0) {
          setBanner({
            imagen: dataBanner[0].imagen ? `${BACK_URL}/${dataBanner[0].imagen.replace(/\\/g, "/")}` : "",
            titulo: dataBanner[0].titulo || "CONTÁCTANOS"
          });
        }

        const resTarjetas = await fetch(`${BACK_URL}/api/home?section=tarjetasContactanos`);
        const dataTarjetas = await resTarjetas.json();
        setTarjetas(Array.isArray(dataTarjetas) ? dataTarjetas : []);
      } catch (err) {
        setError("No se pudo cargar la información de contacto.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) return <div className="loading-contact">Cargando información de contacto...</div>;
  if (error) return <div className="error-contact">Error: {error}</div>;

  return (
    <div className="contact-container">
      <div className="contact-hero">
        {banner.imagen && <img src={banner.imagen} alt="Banner" className="hero-image" />}
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">{banner.titulo}</h1>
        </div>
      </div>
      <div className="main-content">
        <div className="cards-grid">
          {tarjetas.map(tarjeta => {
            const Icon = ICON_MAP[tarjeta.imagen] || Phone;
            return (
              <div className="contact-card" key={tarjeta.id}>
                <div className="card-content">
                  <div className="icon-wrapper icon-wrapper-blue">
                    <Icon className="icon" />
                  </div>
                  <div className="card-info">
                    <h4 className="card-title">{tarjeta.titulo}</h4>
                    {tarjeta.descripcion && tarjeta.descripcion.split("\n").map((linea, idx) => (
                      <p className="card-text" key={idx}>{linea}</p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
  );
};

export default Contactos;