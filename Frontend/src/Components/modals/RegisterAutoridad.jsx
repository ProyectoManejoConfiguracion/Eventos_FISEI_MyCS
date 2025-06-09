import React, { useState, useEffect } from "react";
import "../../Styles/RegistroAut.css";
import axios from "axios";


const RegisterAutoridad = ({ isOpen, closeModal }) => {
  const [imagenPreview, setImagenPreview] = useState(null);

  const [formData, setFormData] = useState({
    CED_PER: "",
    NOM_PER: "",
    APE_PER: "",
    TEL_PER: "",
    COR_PER: "",
    CON_PER: "",
    FOT_PER: null,
  });
  const [autoridadData, setAutoridadData] = useState({
    ID_AUT: "",
    CED_PER: "",
    DIR_AUT: "",
    CAR_AUT: "",
    ID_FAC: "",
  });
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/facultades")
      .then((resp) => setFacultades(resp.data))
      .catch((err) => console.error("Error al cargar facultades:", err));
  }, []);
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, dataset, type, files } = e.target;
    if (dataset.type === "persona") {
      if (type === "file") {
        const archivo = files[0];
        const tiposPermitidos = ["image/jpeg", "image/png", "image/gif"];
        const maxSize = 5 * 1024 * 1024;

        if (!archivo) return;
        if (!tiposPermitidos.includes(archivo.type)) {
          setError("Solo se permiten imágenes (JPEG, PNG, GIF)");
          return;
        }
        if (archivo.size > maxSize) {
          setError("La imagen no puede ser mayor a 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagenPreview(reader.result);
        reader.readAsDataURL(archivo);

        setFormData((prev) => ({ ...prev, FOT_PER: archivo }));
        setError("");
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "COR_PER") {
          const localID = value.split("@")[0];
          setAutoridadData((prev) => ({ ...prev, ID_AUT: localID }));
        }
      }
    } else if (dataset.type === "autoridad") {
      setAutoridadData((prev) => ({ ...prev, [name]: value }));
      if (name === "CED_PER") {
        setFormData((prev) => ({ ...prev, CED_PER: value }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { CED_PER, NOM_PER, APE_PER, COR_PER, CON_PER } = formData;
    const { ID_AUT, DIR_AUT, CAR_AUT, ID_FAC } = autoridadData;

    if (
      !CED_PER ||
      !NOM_PER ||
      !APE_PER ||
      !COR_PER ||
      !CON_PER ||
      !DIR_AUT ||
      !CAR_AUT ||
      !ID_FAC
    ) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    const dataPersona = new FormData();
    dataPersona.append("CED_PER", formData.CED_PER);
    dataPersona.append("NOM_PER", formData.NOM_PER);
    dataPersona.append("APE_PER", formData.APE_PER);
    dataPersona.append("TEL_PER", formData.TEL_PER);
    dataPersona.append("COR_PER", formData.COR_PER);
    dataPersona.append("CON_PER", formData.CON_PER);
    if (formData.FOT_PER) {
      dataPersona.append("FOT_PER", formData.FOT_PER);
    }

    const dataAutoridad = new FormData();
    dataAutoridad.append("ID_AUT", autoridadData.ID_AUT);
    dataAutoridad.append("CED_PER", formData.CED_PER);
    dataAutoridad.append("DIR_AUT", autoridadData.DIR_AUT);
    dataAutoridad.append("CAR_AUT", autoridadData.CAR_AUT);
    dataAutoridad.append("ID_FAC", autoridadData.ID_FAC);

    try {
      const resp1 = await axios.post(
        "http://localhost:3000/api/personas",
        dataPersona,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const resp2 = await axios.post(
        "http://localhost:3000/api/autoridades",
        dataAutoridad,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Persona:", resp1.data);
      console.log("Autoridad:", resp2.data);
      alert("¡Registro exitoso!");
    } catch (err) {
      setError(err.response?.data?.error || "Error en el registro");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overlay" onClick={closeModal} />
      <div className="Container-ModalRegistro">
        <div className="registro-container">
          <button className="close-buttonR" onClick={closeModal}>
            &times;
          </button>
          <div className="registro-header">
            <h1>Registrar Autoridad</h1>
            
          </div>
          
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="form-container">
              {/* Columna izquierda - Imagen y Dirección */}
              <div className="columna izquierda">
                <div className="form-group imagen-upload">
                  <label htmlFor="foto">Foto de perfil:</label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="foto"
                      name="FOT_PER"
                      accept="image/*"
                      data-type="persona"
                      onChange={handleChange}
                    />
                    <label htmlFor="foto" className="file-label">
                      Seleccionar imagen
                    </label>
                  </div>
                  <p className="file-hint">
                    Formatos: JPEG, PNG, GIF (Máx. 5MB)
                  </p>
                </div>
                {imagenPreview && (
                  <div className="imagen-preview">
                    <img src={imagenPreview} alt="Vista previa" />
                  </div>
                )}
                <div className="form-group">
                  <label>
                    Dirección autoridad: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="DIR_AUT"
                    data-type="autoridad"
                    value={autoridadData.DIR_AUT}
                    onChange={handleChange}
                    placeholder="Ingresa la dirección"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono:</label>
                  <input
                    type="text"
                    name="TEL_PER"
                    data-type="persona"
                    value={formData.TEL_PER}
                    onChange={handleChange}
                    placeholder="Ingresa el teléfono"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Cargo autoridad: <span className="required">*</span>
                  </label>
                  <select
                    name="CAR_AUT"
                    data-type="autoridad"
                    value={autoridadData.CAR_AUT}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="DECANO">DECANO</option>
                    <option value="SUBDECANO">SUBDECANO</option>
                    <option value="SECRETARIA">SECRETARIA</option>
                    <option value="DOCENTE">DOCENTE</option>
                    <option value="RESPONSABLE CTT">RESPONSABLE CTT</option>
                    <option value="COORDINADOR">COORDINADOR</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Facultad autoridad: <span className="required">*</span>
                  </label>
                  <select
                    name="ID_FAC"
                    data-type="autoridad"
                    value={autoridadData.ID_FAC}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Selecciona --</option>
                    {facultades.map((f) => (
                      <option key={f.ID_FAC} value={f.ID_FAC}>
                        {f.NOM_FAC}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Columna derecha - Formulario de registro */}
              <div className="columna derecha">
                <div className="form-group">
                  <label>
                    Cédula: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="CED_PER"
                    data-type="autoridad"
                    value={autoridadData.CED_PER}
                    onChange={handleChange}
                    placeholder="Ingresa la cédula"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Nombre: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="NOM_PER"
                    data-type="persona"
                    value={formData.NOM_PER}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Apellido: <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="APE_PER"
                    data-type="persona"
                    value={formData.APE_PER}
                    onChange={handleChange}
                    placeholder="Ingresa el apellido"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Correo electrónico: <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="COR_PER"
                    data-type="persona"
                    value={formData.COR_PER}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Contraseña: <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="CON_PER"
                    data-type="persona"
                    value={formData.CON_PER}
                    onChange={handleChange}
                    placeholder="Crea una contraseña segura"
                    required
                  />
                  <p className="password-hint">
                    Mínimo 8 caracteres, con letras y números
                  </p>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-submit">
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : "Crear Cuenta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterAutoridad;
