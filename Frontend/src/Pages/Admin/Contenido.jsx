import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Styles/Contenido.css'; 
import { BACK_URL } from '../../../config';

const Contenido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Sección Home
    HOME_HERO_TITLE: '',
    HOME_HERO_SUBTITLE: '',
    HOME_HERO_IMAGE: '',
    STAT_1_NUM: '5,000+',
    STAT_1_TEXT: 'Estudiantes Formados',
    STAT_2_NUM: '120+',
    STAT_2_TEXT: 'Eventos Anuales',
    STAT_3_NUM: '85%',
    STAT_3_TEXT: 'Tasa de Empleabilidad',
    STAT_4_NUM: '40+',
    STAT_4_TEXT: 'Empresas Colaboradoras',
    HOME_EVENTS_TITLE: 'Eventos y Cursos Destacados',
    HOME_EVENTS_SUBTITLE: 'Descubre las últimas oportunidades para desarrollar tus habilidades tecnológicas',
    HOME_FEATURES_TITLE: 'Por qué elegirnos',
    HOME_FEATURES_SUBTITLE: 'Ofrecemos la mejor formación tecnológica con un enfoque práctico',
    HOME_FEATURES_CONTENT: '', // HTML permitido para características
    
    // Sección Nosotros
    ABOUT_TITLE: 'Nosotros',
    ABOUT_SUBTITLE: 'Descubre nuestros eventos académicos y cursos especializados de la facultad',
    ABOUT_IMAGE: '',
    ABOUT_MISION: '',
    ABOUT_VISION: '',
    ABOUT_HISTORY: `El 20 de octubre de 2002 se crea el Centro de Transferencia y Desarrollo de Tecnologías 
    mediante resolución 1452-2002-CU-P en la áreas de Ingenierías en Sistemas, Electrónica e 
    Industrial de la Universidad Técnica de Ambato...`,
    ABOUT_IMAGE_HISTORY: '',
    ABOUT_DECANO: '',
    ABOUT_SUBDECANO: '',
    ABOUT_CTT: '',
    
    // Sección Eventos
    EVENTS_TITLE: 'Cursos y Eventos',
    EVENTS_SUBTITLE: 'Descubre nuestros eventos académicos y cursos especializados de cada facultad',
    EVENTS_HERO_IMAGE: '',
    EVENTS_CATEGORIES: 'CONFERENCIAS,CURSO,CONGRESO,WEBINAR,SOCIALIZACIONES,TALLERES,SEMINARIOS,OTROS',
    
    // Sección Contactos
    CONTACT_TITLE: 'Contáctanos',
    CONTACT_HERO_IMAGE: '',
    CONTACT_PHONE: '(03) 285-1894',
    CONTACT_EMAIL_1: 'talleresfisei@uta.edu.ec',
    CONTACT_EMAIL_2: 'ctt.fisei@uta.edu.ec',
    CONTACT_ADDRESS: 'Av. Los Chasquis y Rio Guayllabamba',
    CONTACT_FORM_TITLE: 'Envíanos un mensaje',
    CONTACT_FORM_OPTIONS: 'Eventos,Congresos,Cursos,Webinar,Otro'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [imagePreview, setImagePreview] = useState({
    HOME_HERO_IMAGE: null,
    ABOUT_IMAGE: null,
    ABOUT_IMAGE_HISTORY: null,
    EVENTS_HERO_IMAGE: null,
    CONTACT_HERO_IMAGE: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACK_URL}/api/web`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el contenido');
        }
        const data = await response.json();
        setFormData(data);
        
        // Configurar previsualizaciones de imágenes si existen
        if (data.HOME_HERO_IMAGE) {
          setImagePreview(prev => ({
            ...prev,
            HOME_HERO_IMAGE: `${BACK_URL}/${data.HOME_HERO_IMAGE}`
          }));
        }
        // Repetir para otras imágenes...
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Previsualización local
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => ({
          ...prev,
          [fieldName]: reader.result
        }));
      };
      reader.readAsDataURL(file);
      
      // Para enviar al backend (se manejará en handleSubmit)
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Agregar todos los campos al FormData
      for (const key in formData) {
        if (key.endsWith('_IMAGE') && typeof formData[key] === 'object') {
          // Es un archivo de imagen
          formDataToSend.append(key, formData[key]);
        } else {
          // Es texto normal
          formDataToSend.append(key, formData[key]);
        }
      }
      
      const response = await fetch(`${BACK_URL}/api/web/${formData.ID}`, {
        method: 'PUT',
        body: formDataToSend
        // No establezcas Content-Type, el navegador lo hará automáticamente con FormData
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el contenido');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando contenido...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="contenido-container">
      <h1>Editor de Contenido Web</h1>
      
      <div className="content-sections-tabs">
        <button 
          className={activeSection === 'home' ? 'active' : ''}
          onClick={() => setActiveSection('home')}
        >
          Home
        </button>
        <button 
          className={activeSection === 'about' ? 'active' : ''}
          onClick={() => setActiveSection('about')}
        >
          Nosotros
        </button>
        <button 
          className={activeSection === 'events' ? 'active' : ''}
          onClick={() => setActiveSection('events')}
        >
          Eventos
        </button>
        <button 
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={() => setActiveSection('contact')}
        >
          Contactos
        </button>
      </div>
      
      {success && <div className="success-message">¡Contenido actualizado exitosamente!</div>}

      <form onSubmit={handleSubmit} className="contenido-form">
        {/* Sección Home */}
        {activeSection === 'home' && (
          <>
            <div className="form-section">
              <h2>Hero Section</h2>
              <div className="form-group">
                <label>Título Principal</label>
                <input
                  type="text"
                  name="HOME_HERO_TITLE"
                  value={formData.HOME_HERO_TITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <textarea
                  name="HOME_HERO_SUBTITLE"
                  value={formData.HOME_HERO_SUBTITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Imagen Hero (1920x1080px recomendado)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'HOME_HERO_IMAGE')}
                />
                {imagePreview.HOME_HERO_IMAGE && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview.HOME_HERO_IMAGE} 
                      alt="Previsualización" 
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-section">
              <h2>Estadísticas</h2>
              <div className="stats-grid">
                {[1, 2, 3, 4].map(num => (
                  <div className="form-group" key={num}>
                    <label>Estadística {num} - Número</label>
                    <input
                      type="text"
                      name={`STAT_${num}_NUM`}
                      value={formData[`STAT_${num}_NUM`]}
                      onChange={handleChange}
                    />
                    <label>Estadística {num} - Texto</label>
                    <input
                      type="text"
                      name={`STAT_${num}_TEXT`}
                      value={formData[`STAT_${num}_TEXT`]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h2>Sección de Eventos</h2>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="HOME_EVENTS_TITLE"
                  value={formData.HOME_EVENTS_TITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <textarea
                  name="HOME_EVENTS_SUBTITLE"
                  value={formData.HOME_EVENTS_SUBTITLE}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2>Sección de Características</h2>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="HOME_FEATURES_TITLE"
                  value={formData.HOME_FEATURES_TITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <textarea
                  name="HOME_FEATURES_SUBTITLE"
                  value={formData.HOME_FEATURES_SUBTITLE}
                  onChange={handleChange}
                />
              </div>
              
            </div>
          </>
        )}

        {/* Sección Nosotros */}
        {activeSection === 'about' && (
          <>
            <div className="form-section">
              <h2>Hero Section</h2>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="ABOUT_TITLE"
                  value={formData.ABOUT_TITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <textarea
                  name="ABOUT_SUBTITLE"
                  value={formData.ABOUT_SUBTITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Imagen Hero (1920x1080px recomendado)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'ABOUT_IMAGE')}
                />
                {imagePreview.ABOUT_IMAGE && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview.ABOUT_IMAGE} 
                      alt="Previsualización" 
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2>Misión, Visión y Valores</h2>
              <div className="form-group">
                <label>Misión</label>
                <textarea
                  name="ABOUT_MISION"
                  value={formData.ABOUT_MISION}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Visión</label>
                <textarea
                  name="ABOUT_VISION"
                  value={formData.ABOUT_VISION}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
            </div>

            <div className="form-section">
              <h2>Historia</h2>
              <div className="form-group">
                <label>Texto de Historia</label>
                <textarea
                  name="ABOUT_HISTORY"
                  value={formData.ABOUT_HISTORY}
                  onChange={handleChange}
                  rows={8}
                />
              </div>
              <div className="form-group">
                <label>Imagen de Historia (800x600px recomendado)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'ABOUT_IMAGE_HISTORY')}
                />
                {imagePreview.ABOUT_IMAGE_HISTORY && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview.ABOUT_IMAGE_HISTORY} 
                      alt="Previsualización" 
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2>Autoridades</h2>
              <div className="form-group">
                <label>Decano</label>
                <input
                  type="text"
                  name="ABOUT_DECANO"
                  value={formData.ABOUT_DECANO}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Subdecano</label>
                <input
                  type="text"
                  name="ABOUT_SUBDECANO"
                  value={formData.ABOUT_SUBDECANO}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Responsable CTT</label>
                <input
                  type="text"
                  name="ABOUT_CTT"
                  value={formData.ABOUT_CTT}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {/* Sección Eventos */}
        {activeSection === 'events' && (
          <>
            <div className="form-section">
              <h2>Hero Section</h2>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="EVENTS_TITLE"
                  value={formData.EVENTS_TITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <textarea
                  name="EVENTS_SUBTITLE"
                  value={formData.EVENTS_SUBTITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Imagen Hero (1920x1080px recomendado)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'EVENTS_HERO_IMAGE')}
                />
                {imagePreview.EVENTS_HERO_IMAGE && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview.EVENTS_HERO_IMAGE} 
                      alt="Previsualización" 
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2>Configuración General</h2>
              <div className="form-group">
                <label>Categorías de Eventos (separadas por comas)</label>
                <input
                  type="text"
                  name="EVENTS_CATEGORIES"
                  value={formData.EVENTS_CATEGORIES}
                  onChange={handleChange}
                />
                <small>Estas categorías aparecerán en los filtros del buscador</small>
              </div>
              
              {/* FUTURA CONEXIÓN: Aquí se puede agregar gestión de banners o eventos destacados */}
              {/* <div className="form-group">
                <label>Eventos Destacados</label>
                <select multiple className="input-field">
                  <option>Evento 1</option>
                  <option>Evento 2</option>
                </select>
                <small>Selecciona los eventos que aparecerán destacados</small>
              </div> */}
            </div>
          </>
        )}

        {/* Sección Contactos */}
        {activeSection === 'contact' && (
          <>
            <div className="form-section">
              <h2>Hero Section</h2>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="CONTACT_TITLE"
                  value={formData.CONTACT_TITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Imagen Hero (1920x1080px recomendado)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'CONTACT_HERO_IMAGE')}
                />
                {imagePreview.CONTACT_HERO_IMAGE && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview.CONTACT_HERO_IMAGE} 
                      alt="Previsualización" 
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="CONTACT_PHONE"
                  value={formData.CONTACT_PHONE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email Principal</label>
                <input
                  type="email"
                  name="CONTACT_EMAIL_1"
                  value={formData.CONTACT_EMAIL_1}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email Secundario</label>
                <input
                  type="email"
                  name="CONTACT_EMAIL_2"
                  value={formData.CONTACT_EMAIL_2}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="CONTACT_ADDRESS"
                  value={formData.CONTACT_ADDRESS}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Formulario de Contacto</h2>
              <div className="form-group">
                <label>Título del Formulario</label>
                <input
                  type="text"
                  name="CONTACT_FORM_TITLE"
                  value={formData.CONTACT_FORM_TITLE}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Opciones del Select (separadas por comas)</label>
                <input
                  type="text"
                  name="CONTACT_FORM_OPTIONS"
                  value={formData.CONTACT_FORM_OPTIONS}
                  onChange={handleChange}
                />
              </div>
              
              {/* FUTURA CONEXIÓN: Aquí se puede agregar configuración de campos adicionales */}
              {/* <div className="form-group">
                <label>Campos Adicionales</label>
                <div className="additional-fields">
                  <button type="button" className="add-field-btn">
                    + Añadir Campo Personalizado
                  </button>
                </div>
              </div> */}
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contenido;