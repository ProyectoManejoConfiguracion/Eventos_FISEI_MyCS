import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../Styles/Evento.css"; // Asegúrate de tener tu CSS importado

const Evento = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ID_EVT: "",
    NOM_EVT: "",
    FEC_EVT: "",
    LUG_EVT: "",
    TIP_EVT: "",
    MOD_EVT: "",
    FOT_EVT: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, FOT_EVT: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await axios.post("http://localhost:3000/eventos", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/eventos");
    } catch (err) {
      setError("Error al registrar el evento. Verifica los campos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evento-container">
      <div className="evento-header">
        <h1>Registrar Evento</h1>
        <p>Llena el siguiente formulario para agregar un nuevo evento</p>
      </div>

      <form className="formulario" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-container">
          <div className="columna izquierda">
            <div className="form-group">
              <label>ID del Evento <span className="required">*</span></label>
              <input name="ID_EVT" value={formData.ID_EVT} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Nombre del Evento <span className="required">*</span></label>
              <input name="NOM_EVT" value={formData.NOM_EVT} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Fecha del Evento <span className="required">*</span></label>
              <input type="date" name="FEC_EVT" value={formData.FEC_EVT} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Campus del Evento <span className="required">*</span></label>
              <select name="LUG_EVT" id="{formData.LUG_EVT}" onChange={handleChange} required>
                <option value="">Seleccione un lugar</option>
                <option value="HUACHI">Huachi</option>
                <option value="INGAURCO">Ingaurco</option>
                <option value="QUEROCHACA">Querochaca</option>
              </select>
              
            </div>
          </div>

          <div className="columna derecha">
            <div className="form-group">
              <label>Tipo de Evento <span className="required">*</span></label>
              <select name="TIP_EVT" value={formData.TIP_EVT} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option value="GRATUITO">Gratuito</option>
                <option value="DE PAGO">De Pago</option>
              </select>
            </div>

            <div className="form-group">
              <label>Modalidad del Evento <span className="required">*</span></label>
              <select name="MOD_EVT" value={formData.MOD_EVT} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option value="PUBLICO">Público</option>
                <option value="PRIVADO">Privado</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fotografía del Evento <span className="required">*</span></label>
              <div className="file-input-container">
                <label className="file-label" htmlFor="FOT_EVT">Seleccionar imagen</label>
                <input
                  type="file"
                  id="FOT_EVT"
                  name="FOT_EVT"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="file-hint">Formatos aceptados: JPG, PNG. Máximo 2MB.</div>
              {preview && (
                <div className="imagen-preview">
                  <img src={preview} alt="Vista previa" />
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-submit">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Registrar Evento"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Evento;
