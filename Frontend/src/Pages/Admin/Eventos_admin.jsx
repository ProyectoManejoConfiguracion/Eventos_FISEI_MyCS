import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/Evento.css";
import { BACK_URL } from "../../../config";

const categoriaLogica = {
  CURSO: {
    nota: true,
    certificado: true,
    asistencia: true,
    horas: true,
    carta: "opcional",
  },
  CONGRESO: {
    nota: false,
    certificado: true,
    asistencia: true,
    horas: true,
    carta: false,
  },
  WEBINAR: {
    nota: false,
    certificado: "opcional",
    asistencia: true,
    horas: true,
    carta: false,
  },
  CONFERENCIAS: {
    nota: false,
    certificado: false,
    asistencia: "opcional",
    horas: false,
    carta: false,
  },
  TALLERES: {
    nota: true,
    certificado: true,
    asistencia: true,
    horas: true,
    carta: "opcional",
  },
  SEMINARIOS: {
    nota: true,
    certificado: true,
    asistencia: true,
    horas: true,
    carta: "opcional",
  },
};

export default function RegistrarEvento() {
  const navigate = useNavigate();

  const [autoridades, setAutoridades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [formData, setFormData] = useState({
    NOM_EVT: "",
    SUB_EVT: "",
    FEC_EVT: "",
    FEC_FIN: "",
    LUG_EVT: "",
    CED_AUT: "",
    CUP_DET: "",
    NOT_DET: "",
    TIP_EVT: "",
    MOD_EVT: "",
    CAT_DET: "",
    DES_EVT: "",
    HOR_DET: "",
    ARE_DET: "",
    CARRERAS: [],
    PRECIO: "",
    CERTIFICADO: false,
    ASISTENCIA: false,
    CARTA_MOTIVACION: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACK_URL}/api/autoridades`)
      .then((res) => res.json())
      .then((data) => setAutoridades(data))
      .catch((err) => console.error("Error cargando autoridades:", err));

    fetch(`${BACK_URL}/api/carreras`)
      .then((res) => res.json())
      .then((data) => setCarreras(data))
      .catch((err) => console.error("Error cargando carreras:", err));
  }, []);

  useEffect(() => {
    const logica = categoriaLogica[formData.CAT_DET];
    if (!logica) return;

    setFormData((prev) => ({
      ...prev,
      NOT_DET: logica.nota ? prev.NOT_DET : "",
      HOR_DET: logica.horas ? prev.HOR_DET : "",
      CERTIFICADO: logica.certificado === true,
      ASISTENCIA: logica.asistencia === true,
      CARTA_MOTIVACION: logica.carta === true,
    }));
  }, [formData.CAT_DET]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoridadChange = (e) => {
    setFormData((prev) => ({ ...prev, CED_AUT: e.target.value }));
  };

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const tiposPermitidos = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024;

      if (!tiposPermitidos.includes(archivo.type)) {
        setError("Solo se permiten imágenes (JPEG, PNG, GIF)");
        return;
      }

      if (archivo.size > maxSize) {
        setError("La imagen no puede ser mayor a 5MB");
        return;
      }

      const lector = new FileReader();
      lector.onloadend = () => setImagenPreview(lector.result);
      lector.readAsDataURL(archivo);

      setFormData((prev) => ({ ...prev, FOT_EVT: archivo }));
      setError("");
    }
  };

  const handleCheckboxCarrera = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      CARRERAS: prev.CARRERAS.includes(value)
        ? prev.CARRERAS.filter((c) => c !== value)
        : [...prev.CARRERAS, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("NOM_EVT", formData.NOM_EVT);
      data.append("SUB_EVT", formData.SUB_EVT);
      data.append("FEC_EVT", formData.FEC_EVT);
      data.append("FEC_FIN", formData.FEC_FIN);
      data.append("LUG_EVT", formData.LUG_EVT);
      data.append("TIP_EVT", formData.TIP_EVT);
      data.append("MOD_EVT", formData.MOD_EVT);
      data.append("DES_EVT", formData.DES_EVT);
      data.append("ARE_DET", formData.ARE_DET);
      data.append("CAT_DET", formData.CAT_DET);
      if (formData.TIP_EVT === "DE PAGO")
        data.append("PRECIO", formData.PRECIO);
      if (formData.FOT_EVT) data.append("FOT_EVT", formData.FOT_EVT);

      const response = await axios.post(`${BACK_URL}/api/eventos`, data);
      const nuevoID_EVT = response.data.ID_EVT;

      const detalleData = {
        ID_EVT: nuevoID_EVT,
        CED_AUT: formData.CED_AUT,
        CUP_DET: formData.CUP_DET,
        NOT_DET: formData.NOT_DET,
        HOR_DET: formData.HOR_DET,
        CERTIFICADO: formData.CERTIFICADO,
        ASISTENCIA: formData.ASISTENCIA,
        CARTA_MOTIVACION: formData.CARTA_MOTIVACION,
        ARE_DET: formData.ARE_DET,
        CAT_DET: formData.CAT_DET,
        CARRERAS: formData.MOD_EVT === "PRIVADO" ? formData.CARRERAS : [],
      };

      await axios.post(`${BACK_URL}/api/detalle_eventos`, detalleData);
      alert("Evento registrado exitosamente");
      navigate("/eventos");
    } catch (err) {
      console.error(err);
      setError("Error al registrar el evento. Verifica los campos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evento-container">
      <h1>Registrar Evento</h1>
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="columna izquierda">
            <div className="form-group">
              <label>Nombre del Evento *</label>
              <input
                name="NOM_EVT"
                value={formData.NOM_EVT}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subtitulo *</label>
              <textarea
                name="SUB_EVT"
                value={formData.SUB_EVT}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Descripción del Evento <span className="required">*</span>
              </label>
              <textarea
                className="form-group"
                name="DES_EVT"
                value={formData.DES_EVT}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Fecha Inicio *</label>
              <input
                type="date"
                name="FEC_EVT"
                value={formData.FEC_EVT}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha Fin *</label>
              <input
                type="date"
                name="FEC_FIN"
                value={formData.FEC_FIN}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Campus del Evento *</label>
              <select
                name="LUG_EVT"
                value={formData.LUG_EVT}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un lugar</option>
                <option value="HUACHI">Huachi</option>
                <option value="INGAURCO">Ingaurco</option>
                <option value="QUEROCHACA">Querochaca</option>
              </select>
            </div>

            <div className="form-group">
              <label>Autoridad a Cargo *</label>
              <select
                name="CED_AUT"
                value={formData.CED_AUT}
                onChange={handleAutoridadChange}
                required
              >
                <option value="">Seleccione una Autoridad</option>
                {autoridades.map((autoridad) => (
                  <option key={autoridad.ID_AUT} value={autoridad.CED_PER}>
                    {autoridad.ID_AUT} - {autoridad.CED_PER_PERSONA?.NOM_PER}{" "}
                    {autoridad.CED_PER_PERSONA?.APE_PER}
                  </option>
                ))}
              </select>
            </div>
            {categoriaLogica[formData.CAT_DET]?.carta === "opcional" && (
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.CARTA_MOTIVACION}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        CARTA_MOTIVACION: !prev.CARTA_MOTIVACION,
                      }))
                    }
                  />
                  Incluir carta de motivación
                </label>
              </div>
            )}
          </div>

          <div className="columna derecha">
            <div className="form-group">
              <label>Fotografía del Evento *</label>
              <div className="file-input-container">
                <label className="file-label" htmlFor="foto">
                  Seleccionar imagen
                </label>
                <input
                  type="file"
                  id="foto"
                  accept="image/*"
                  onChange={manejarCambioImagen}
                  required
                />
              </div>
              {imagenPreview && (
                <div className="imagen-previewer">
                  <img src={imagenPreview} alt="Vista previa" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Tipo de Evento *</label>
              <select
                name="TIP_EVT"
                value={formData.TIP_EVT}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                <option value="GRATUITO">Gratuito</option>
                <option value="DE PAGO">De Pago</option>
              </select>
            </div>

            {formData.TIP_EVT === "DE PAGO" && (
              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  name="PRECIO"
                  value={formData.PRECIO}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Categoría del Evento *</label>
              <select
                name="CAT_DET"
                value={formData.CAT_DET}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                {Object.keys(categoriaLogica).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {categoriaLogica[formData.CAT_DET]?.nota && (
              <div className="form-group">
                <label>Nota Requerida *</label>
                <input
                  type="number"
                  name="NOT_DET"
                  value={formData.NOT_DET}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {categoriaLogica[formData.CAT_DET]?.horas && (
              <div className="form-group">
                <label>Horas del Evento *</label>
                <input
                  type="number"
                  name="HOR_DET"
                  value={formData.HOR_DET}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Modalidad *</label>
              <select
                name="MOD_EVT"
                value={formData.MOD_EVT}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                <option value="PUBLICO">Público</option>
                <option value="PRIVADO">Privado</option>
              </select>
            </div>
            {formData.MOD_EVT === "PRIVADO" && (
              <div className="form-group">
                <label>Carreras *</label>
                <div className="checkbox-list">
                  {carreras.map((c) => (
                    <label key={c.ID_CAR} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={c.ID_CAR}
                        checked={formData.CARRERAS.includes(c.ID_CAR)}
                        onChange={handleCheckboxCarrera}
                      />
                      {c.NOM_CAR}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Cargando..." : "Registrar Evento"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
