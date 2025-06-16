import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, data } from 'react-router-dom';
import '../../Styles/Contenido.css'; 
import { BACK_URL } from '../../../config'; // Asegúrate de que la URL del backend esté configurada correctamente

const Contenido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ID: '',
    TITLE: '',
    SUBTITLE: '',
    OBJETIVE: '',
    TELF: '',
    EMAIL_A: '',
    EMAIL_B: '',
    VISION: '',
    MISION: '',
    VALOR: '',
    DECANO: '',
    SUBDECANO: '',
    CTT: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACK_URL}/api/web`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el contenido');
        }
        const data = await response.json();
        setFormData(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${BACK_URL}/api/web/${formData.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
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
      <h1>Editar Contenido Web</h1>
      
      {success && <div className="success-message">¡Contenido actualizado exitosamente!</div>}

      <form onSubmit={handleSubmit} className="contenido-form">
        <div className="form-section">
          <h2>Información Principal</h2>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="TITLE"
              value={formData.TITLE}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Subtítulo</label>
            <textarea
              type="text"
              name="SUBTITLE"
              value={formData.SUBTITLE}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Objetivo</label>
            <textarea
              name="OBJETIVE"
              value={formData.OBJETIVE}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Información de Contacto</h2>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="TELF"
              value={formData.TELF}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Principal</label>
            <input
              type="email"
              name="EMAIL_A"
              value={formData.EMAIL_A}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Secundario</label>
            <input
              type="email"
              name="EMAIL_B"
              value={formData.EMAIL_B}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Misión, Visión y Valores</h2>
          <div className="form-group">
            <label>Misión</label>
            <textarea
              name="MISION"
              value={formData.MISION}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Visión</label>
            <textarea
              name="VISION"
              value={formData.VISION}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Valores (HTML permitido)</label>
            <textarea
              name="VALOR"
              value={formData.VALOR}
              onChange={handleChange}
              required
              rows={5}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Autoridades</h2>
          <div className="form-group">
            <label>Decano</label>
            <input
              type="text"
              name="DECANO"
              value={formData.DECANO}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Subdecano</label>
            <input
              type="text"
              name="SUBDECANO"
              value={formData.SUBDECANO}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Responsable CTT</label>
            <input
              type="text"
              name="CTT"
              value={formData.CTT}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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