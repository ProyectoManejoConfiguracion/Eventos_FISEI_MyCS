import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Styles/Evento.css";
import { BACK_URL } from "../../../config"; 

const Evento = () => {
  const navigate = useNavigate();

  const [autoridades, setAutoridades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [todosLosNiveles, setTodosLosNiveles] = useState([]);
  const [nivelesFiltrados, setNivelesFiltrados] = useState([]);
  const [combinaciones, setCombinaciones] = useState([]);

  const [formData, setFormData] = useState({
    NOM_EVT: "",
    FEC_EVT: "",
    LUG_EVT: "",
    TIP_EVT: "",
    MOD_EVT: "",
    FOT_EVT: null,
    DES_EVT: "",
    SUB_EVT: "",

    CED_AUT: "",
    CUP_DET: "",
    NOT_DET: "",
    HOR_DET: "",
    ARE_DET: "",
    CAT_DET: "",
    CARRERAS: [],
    NIVELES: [],
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

    fetch(`${BACK_URL}/api/nivel`)
      .then((res) => res.json())
      .then((data) => setTodosLosNiveles(data)) // Almacena todos los niveles
      .catch((err) => console.error("Error cargando niveles:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAutoridadChange = (e) => {
    const cedautoridad = e.target.value;
    setFormData((prev) => ({ ...prev, CED_AUT: cedautoridad }));
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

      setFormData({ ...formData, FOT_EVT: archivo });
      setError("");
    }
  };

  const handleCarrerasChange = (e) => {
    const selectedCarrera = e.target.value;
    setFormData((prev) => ({
      ...prev,
      CARRERAS: [selectedCarrera],
      NIVELES: [""],
    }));

    const niveles = todosLosNiveles.filter(
      (nivel) => nivel.ID_CAR === selectedCarrera
    );
    setNivelesFiltrados(niveles);
  };

const handleAgregar = () => {
  const carreraSeleccionada = formData.CARRERAS[0];
  const nivelSeleccionado = formData.NIVELES[0];

  if (!carreraSeleccionada || !nivelSeleccionado) return;

  const yaExiste = combinaciones.some(
    (c) => c.CARRERA === carreraSeleccionada && c.NIVEL === nivelSeleccionado
  );

  if (!yaExiste) {
    setCombinaciones((prev) => [
      ...prev,
      { CARRERA: carreraSeleccionada, NIVEL: nivelSeleccionado },
    ]);
  }
};

  const handleNivelesChange = (e) => {
    const selected = e.target.value;
    if (selected && !formData.NIVELES.includes(selected)) {
      setFormData((prev) => ({
        ...prev,
        NIVELES: [...prev.NIVELES, selected],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("NOM_EVT", formData.NOM_EVT);
      data.append("FEC_EVT", formData.FEC_EVT);
      data.append("LUG_EVT", formData.LUG_EVT);
      data.append("TIP_EVT", formData.TIP_EVT);
      data.append("MOD_EVT", formData.MOD_EVT);
      data.append("DES_EVT", formData.DES_EVT);
      data.append("SUB_EVT", formData.SUB_EVT);
      if (formData.FOT_EVT) data.append("FOT_EVT", formData.FOT_EVT);

      const response = await axios.post(
        `${BACK_URL}/api/eventos`,
        data
      );
      const nuevoID_EVT = response.data.ID_EVT;

      const detalleData = {
        ID_EVT: nuevoID_EVT,
        CED_AUT: formData.CED_AUT,
        CUP_DET: formData.CUP_DET,
        NOT_DET: formData.NOT_DET,
        HOR_DET: formData.HOR_DET,
        ARE_DET: formData.ARE_DET,
        CAT_DET: formData.CAT_DET,
        NIVELES_PRIVADOS: combinaciones.map(c => c.NIVEL),
      };
      console.log("Datos que se enviarán:", detalleData);
      await axios.post(
        `${BACK_URL}/api/detalle_eventos`,
        detalleData
      );

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
      <div className="evento-header">
        <h1>Registrar Evento</h1>
        <p>Llena el siguiente formulario para agregar un nuevo evento</p>
      </div>

      <form
        className="formulario"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form-container">
          <div className="columna izquierda">
            <div className="form-group">
              <label>
                Nombre del Evento <span className="required">*</span>
              </label>
              <input
                name="NOM_EVT"
                value={formData.NOM_EVT}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Subtitulo del evento <span className="required">*</span>
              </label>
              <textarea
                className="form-group"
                name="SUB_EVT"
                value={formData.SUB_EVT}
                onChange={handleChange}
                required
                cols={30}
                rows={10}
              ></textarea>
            </div>

            <div className="form-group">
              <label>
                Fecha del Evento <span className="required">*</span>
              </label>
              <input
                type="date"
                name="FEC_EVT"
                value={formData.FEC_EVT}
                onChange={handleChange}
                required
              />
            </div>
            <br />

            <div className="form-group">
              <label>
                Campus del Evento <span className="required">*</span>
              </label>
              <select
                name="LUG_EVT"
                id={formData.LUG_EVT}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un lugar</option>
                <option value="HUACHI">Huachi</option>
                <option value="INGAURCO">Ingaurco</option>
                <option value="QUEROCHACA">Querochaca</option>
              </select>

              <div className="form-group">
                <label>
                  Autoridad a Cargo <span className="required">*</span>
                </label>
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

              <div className="form-group">
                <label>
                  Cupos del Evento <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="CUP_DET"
                  value={formData.CUP_DET}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Nota Requerida para Aprobar{" "}
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="NOT_DET"
                  value={formData.NOT_DET}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="columna derecha">
            <div className="form-group">
              <label>
                Tipo de Evento <span className="required">*</span>
              </label>
              <select
                name="TIP_EVT"
                value={formData.TIP_EVT}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="GRATUITO">Gratuito</option>
                <option value="DE PAGO">De Pago</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Modalidad del Evento <span className="required">*</span>
              </label>
              <select
                name="MOD_EVT"
                value={formData.MOD_EVT}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="PUBLICO">Público</option>
                <option value="PRIVADO">Privado</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Fotografía del Evento <span className="required">*</span>
              </label>
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
              <div className="file-hint">
                Formatos aceptados: JPG, PNG. Máximo 2MB.
              </div>
              {imagenPreview && (
                <div className="imagen-preview">
                  <img src={imagenPreview} alt="Vista previa" />
                </div>
              )}
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
                cols={80}
                rows={6}
              ></textarea>
            </div>

            <br />
            <div className="form-group">
              <label>
                Horas del Evento <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="HOR_DET"
                value={formData.HOR_DET}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Área del Evento <span className="required">*</span>
              </label>
              <select
                name="ARE_DET"
                value={formData.ARE_DET}
                onChange={handleChange}
                required
              >
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
              <label>
                Categoría del Evento <span className="required">*</span>
              </label>
              <select
                name="CAT_DET"
                value={formData.CAT_DET}
                onChange={handleChange}
                required
              >
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

            {formData.MOD_EVT === "PRIVADO" && (
              <>
                <div className="form-group">
                  <label>
                    Carreras <span className="required">*</span>
                  </label>
                  <select
                    name="CARRERAS"
                    value={formData.CARRERAS[0] || ""}
                    onChange={handleCarrerasChange}
                    required
                  >
                    <option value="">Seleccione una carrera</option>
                    {carreras.map((carrera) => (
                      <option key={carrera.ID_CAR} value={carrera.ID_CAR}>
                        {carrera.NOM_CAR}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Niveles <span className="required">*</span>
                  </label>
                  <select
                    name="NIVELES"
                    value={formData.NIVELES[0] || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        NIVELES: [e.target.value],
                      }))
                    }
                    required
                  >
                    <option value="">Seleccione un nivel</option>
                    {nivelesFiltrados.map((nivel) => (
                      <option key={nivel.ID_NIV} value={nivel.ID_NIV}>
                        {nivel.NOM_NIV}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="submit-button"
                  onClick={handleAgregar}
                >
                  Agregar
                </button>

                <div style={{ marginTop: "1rem" }}>
                  <h4>Niveles agregados:</h4>
                  <ul>
                    {combinaciones.map((item, index) => {
                      const carrera = carreras.find(
                        (c) => c.ID_CAR === item.CARRERA
                      )?.NOM_CAR;
                      const nivel = todosLosNiveles.find(
                        (n) => n.ID_NIV === item.NIVEL
                      )?.NOM_NIV;
                      return (
                        <li key={index}>
                          {carrera} - {nivel}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
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
};

export default Evento;
