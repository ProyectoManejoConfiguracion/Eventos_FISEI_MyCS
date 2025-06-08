import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Styles/Evento.css"; // Asegúrate de tener tu CSS importado

const Evento = () => {

  const navigate = useNavigate();

  const [autoridades, setAutoridades] = useState([]);

  const [personas, setPersonas] = useState([]);

  const [imagenPreview, setImagenPreview] = useState(null);

  const [formData, setFormData] = useState({
    ID_EVT: "",
    NOM_EVT: "",
    FEC_EVT: "",
    LUG_EVT: "",
    TIP_EVT: "",
    MOD_EVT: "",
    FOT_EVT: null,
    DES_EVT: "",
    SUB_EVT: "",

    // Detalle

    ID_AUT: "",
    CUP_DET: "",
    NOT_DET: "",
    HOR_DET: "",
    ARE_DET: "",
    CAT_DET: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };






  const handleAutoridadChange = async (e) => {
    const idautoridad = e.target.value;

    setFormData(prev => ({
      ...prev,
      ID_AUT: idautoridad
    }));
  }


  useEffect(() => {
    // Cargar autoridades al iniciar
    fetch('http://localhost:3000/api/autoridades')
      .then((res) => res.json())
      .then((data) => setAutoridades(data))
      .catch((err) => console.error('Error cargando autoridades:', err));
  }, []);

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      // Validar tipo y tamaño de archivo
      const tiposPermitidos = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!tiposPermitidos.includes(archivo.type)) {
        setError("Solo se permiten imágenes (JPEG, PNG, GIF)");
        return;
      }

      if (archivo.size > maxSize) {
        setError("La imagen no puede ser mayor a 5MB");
        return;
      }

      const lector = new FileReader();
      lector.onloadend = () => {
        setImagenPreview(lector.result);
      };
      lector.readAsDataURL(archivo);

      setFormData({
        ...formData,
        FOT_EVT: archivo
      });
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    if (!formData.ID_EVT || !formData.NOM_EVT || !formData.FEC_EVT || !formData.LUG_EVT) {
      setError("Completa todos los campos obligatorios antes de enviar.");
      setLoading(false);
      return;
    }

    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const data = new FormData();

      data.append("ID_EVT", formData.ID_EVT);
      data.append("NOM_EVT", formData.NOM_EVT);
      data.append("FEC_EVT", formData.FEC_EVT);
      data.append("LUG_EVT", formData.LUG_EVT);
      data.append("TIP_EVT", formData.TIP_EVT);
      data.append("MOD_EVT", formData.MOD_EVT);
      data.append("DES_EVT", formData.DES_EVT);
      data.append("SUB_EVT", formData.SUB_EVT);

        if (formData.FOT_EVT) {
    data.append('FOT_EVT', formData.FOT_EVT);
    alert("Imagen cargada correctamente");
  }

      const response = await axios.post("http://localhost:3000/api/eventos", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 201 || response.status !== 200) {
        throw new Error("Error al registrar el evento");
        return;
      }
      // Evento registrado exitosamente, ahora registrar el detalle del evento

      // INSERTAR DETALLE_EVENTOS (sin imagen)



      const response2 = await axios.post("http://localhost:3000/api/detalle_eventos", {
        ID_EVT: formData.ID_EVT,
        ID_AUT: formData.ID_AUT,
        CUP_DET: formData.CUP_DET,
        NOT_DET: formData.NOT_DET,
        HOR_DET: formData.HOR_DET,
        ARE_DET: formData.ARE_DET,
        CAT_DET: formData.CAT_DET,
      });

      if (!response2.status === 201 || !response2.status === 200) {
        throw new Error("Error al registrar el detalle del evento");
        return;
      }
      alert("Evento registrado exitosamente");

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
              <label>Subtitulo del evento <span className="required">*</span></label>
              <textarea className="form-group"
                name="SUB_EVT"
                value={formData.SUB_EVT}
                onChange={handleChange}
                required
                cols={30} // Puedes ajustar el número de columnas
                rows={10} // Puedes ajustar el número de filas
              ></textarea>

            </div>

            <div className="form-group">
              <label>Fecha del Evento <span className="required">*</span></label>
              <input type="date" name="FEC_EVT" value={formData.FEC_EVT} onChange={handleChange} required />
            </div>
            <br />

            <div className="form-group">
              <label>Campus del Evento <span className="required">*</span></label>
              <select name="LUG_EVT" id={formData.LUG_EVT} onChange={handleChange} required>
                <option value="">Seleccione un lugar</option>
                <option value="HUACHI">Huachi</option>
                <option value="INGAURCO">Ingaurco</option>
                <option value="QUEROCHACA">Querochaca</option>
              </select>

              <div className="form-group">
                <label>Cédula de Autoridad a Cargo <span className="required">*</span></label>
                <select
                  name="ID_AUT"
                  value={formData.ID_AUT}
                  onChange={handleAutoridadChange}
                  required
                >
                  <option value="">Seleccione una Autoridad</option>
                  {autoridades.map((autoridad) => (
                    <option key={autoridad.ID_AUT} value={autoridad.ID_AUT}>
                      {autoridad.ID_AUT}
                    </option>
                  ))}
                </select>


              </div>

              <div className="form-group">
                <label>Cupos del Evento <span className="required">*</span></label>
                <input type="number" name="CUP_DET" value={formData.CUP_DET} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Nota Requerida para Aprobar <span className="required">*</span></label>
                <input type="number" step="0.01" name="NOT_DET" value={formData.NOT_DET} onChange={handleChange} required />
              </div>

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
                <label className="file-label" htmlFor="foto">Seleccionar imagen</label>
                <input
                  type="file"
                  id="foto"
                  accept="image/*"
                  onChange={manejarCambioImagen}
                  required
                />
              </div>
              <div className="file-hint">Formatos aceptados: JPG, PNG. Máximo 2MB.</div>
            {imagenPreview && (
              <div className="imagen-preview">
                <img src={imagenPreview} alt="Vista previa" />
              </div>
            )}
            </div>
            <div className="form-group">
              <label>Descripción del Evento <span className="required">*</span></label>
              <textarea className="form-group"
                name="DES_EVT"
                value={formData.DES_EVT}
                onChange={handleChange}
                required
                cols={80} // Puedes ajustar el número de columnas
                rows={6} // Puedes ajustar el número de filas
              ></textarea>
            </div>

            <br />
            <div className="form-group">
              <label>Horas del Evento <span className="required">*</span></label>
              <input type="number" step="0.01" name="HOR_DET" value={formData.HOR_DET} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Área del Evento <span className="required">*</span></label>
              <select name="ARE_DET" value={formData.ARE_DET} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option>SALUD Y SERVICIOS SOCIALES</option>
                <option>CIENCIAS NATURALES Y MATEMATICAS</option>
                <option>TECNOLOGIA E INGENIERIA</option>
                <option>ARTES Y HUMANIDADES</option>
                <option>CIENCIAS SOCIALES,COMUNICACION Y DERECHO</option>
                <option>ADMINISTRACION Y NEGOCIOS</option>
                <option>EDUCACION</option>
                <option>SERVICIOS GENERALES</option>
              </select>
            </div>

            <div className="form-group">
              <label>Categoría del Evento <span className="required">*</span></label>
              <select name="CAT_DET" value={formData.CAT_DET} onChange={handleChange} required>
                <option value="">Seleccione una opción</option>
                <option>CURSO</option>
                <option>CONGRESO</option>
                <option>WEBINAR</option>
                <option>CONFERENCIAS</option>
                <option>SOCIALIZACIONES</option>
                <option>TALLERES</option>
                <option>SEMINARIOS</option>
                <option>OTROS</option>
              </select>
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
