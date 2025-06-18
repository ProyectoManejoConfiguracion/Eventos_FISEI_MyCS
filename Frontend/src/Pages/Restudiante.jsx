import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Registro.css";
import { BACK_URL } from "../../config";

const RegistroEstudiante = () => {
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    CED_PER: "",
    NOM_PER: "",
    APE_PER: "",
    TEL_PER: "",
    COR_PER: "",
    CON_PER: "",
    FOT_PER: null,
    ID_EST: "",
    ID_NIV: "",
    ID_CAR: ""
  });

  const [cedulaValida, setCedulaValida] = useState(true);
  const [carreras, setCarreras] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [isUta, setIsUta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagenPreview, setImagenPreview] = useState(null);

  // Validación de cédula ecuatoriana
  const validarCedulaEcuatoriana = (CED_PER) => {
    // Eliminar espacios y guiones
    CED_PER = CED_PER.replace(/\s|-/g, '');

    // Verificar longitud
    if (CED_PER.length !== 10) {
      return false;
    }

    // Verificar que todos sean dígitos
    if (!/^\d+$/.test(CED_PER)) {
      return false;
    }

    // Verificar provincia (primeros dos dígitos)
    const provincia = parseInt(CED_PER.substring(0, 2));
    if (provincia < 1 || provincia > 24) {
      return false;
    }

    // Algoritmo de validación
    let suma = 0;
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];

    for (let i = 0; i < 9; i++) {
      let valor = parseInt(CED_PER.charAt(i)) * coeficientes[i];
      if (valor >= 10) {
        valor = valor - 9;
      }
      suma += valor;
    }

    const digitoVerificador = parseInt(CED_PER.charAt(9));
    const modulo = suma % 10;
    const resultado = modulo === 0 ? 0 : 10 - modulo;

    return resultado === digitoVerificador;
  };

  // Manejar cambios en la cédula
  const handleCedulaChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, CED_PER: value });

    // Validar cédula si tiene 10 dígitos
    if (value.length === 10) {
      const valida = validarCedulaEcuatoriana(value);
      setCedulaValida(valida);

      if (!valida) {
        setErrors({ ...errors, CED_PER: "Cédula inválida" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.CED_PER;
        setErrors(newErrors);
      }
    }
  };

  // cambio de correo para validar si es UTA
  const handleChangeCorreo = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "COR_PER") {
      const pattern = /^(.+)@uta\.edu\.ec$/i;
      if (pattern.test(value)) {
        setIsUta(true);

        setFormData(prev => ({
          ...prev,
          ID_EST: value.split('@')[0]
        }));
      } else {
        setIsUta(false);

        setFormData(prev => ({
          ...prev,
          ID_EST: "",
          ID_NIV: "",
          ID_CAR: ""
        }));
      }
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Maneja el cambio de imagen y valida el archivo
  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    // validaciones de tipo y tamaño
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

    // preview de la imagen
    const lector = new FileReader();
    lector.onloadend = () => setImagenPreview(lector.result);
    lector.readAsDataURL(archivo);

    setFormData({ ...formData, FOT_PER: archivo });
    setError("");
  };

  // cuando cambia la carrera, se cargan los niveles
  const handleCarreraChange = async (e) => {
    const idCarrera = e.target.value;
    setFormData({ ...formData, ID_CAR: idCarrera, ID_NIV: "" });

    try {
      const response = await fetch(`${BACK_URL}/api/nivel/${idCarrera}`);
      if (!response.ok) throw new Error('Error cargando niveles');
      setNiveles(await response.json());
    } catch (error) {
      console.error(error);
      setNiveles([]);
      setError("Error al cargar niveles académicos");
    }
  };

  // cargar carreras al inicio
  useEffect(() => {
    const cargarCarreras = async () => {
      try {
        const response = await fetch(`${BACK_URL}/api/carreras`);
        if (!response.ok) throw new Error('Error cargando carreras');
        setCarreras(await response.json());
      } catch (err) {
        console.error('Error:', err);
        setError("Error al cargar carreras");
      }
    };

    cargarCarreras();
  }, []);

  // form de submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // validacion de campos requeridos
    const camposRequeridos = [
      formData.CED_PER,
      formData.NOM_PER,
      formData.APE_PER,
      formData.COR_PER,
      formData.CON_PER,
      formData.FOT_PER
    ];

    // campos espeficicos de estudiante
    if (isUta) {
      camposRequeridos.push(
        formData.ID_EST,
        formData.ID_CAR,
        formData.ID_NIV
      );
    }

    if (camposRequeridos.some(campo => !campo)) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    // validacion de contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.CON_PER)) {
      setError("La contraseña debe tener al menos 8 caracteres con letras y números");
      setLoading(false);
      return;
    }

    if (!cedulaValida) {
      setError("La cédula ingresada no es válida.");
      setLoading(false);
      return;
    }



    try {
      // se crea un objeto FormData para enviar la imagen
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== 'ID_EST' && key !== 'ID_CAR' && key !== 'ID_NIV') {
          data.append(key, value);
        }
      });

      // register persona
      const personaResponse = await axios.post(
        `${BACK_URL}/api/personas`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // registro de estudiante si es UTA
      if (isUta) {
        await axios.post(`${BACK_URL}/api/estudiantes`, {
          ID_EST: formData.ID_EST,
          ID_NIV: formData.ID_NIV,
          CED_EST: formData.CED_PER
        });
      }

      // exito de registro
      alert("¡Registro exitoso! " +
        (isUta ? "Tu cuenta de estudiante ha sido creada." : "Tu cuenta personal ha sido creada."));
      navigate("/");
    } catch (error) {
      console.error("Error en registro:", error);
      const serverError = error.response?.data?.error ||
        error.message ||
        "Error en el registro. Por favor intenta nuevamente.";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-header">
        <h1>Registro</h1>
        <p>Únete a nuestra comunidad académica</p>
      </div>

      <form className="formulario" onSubmit={handleSubmit}>
        <div className="form-container">
          {/* columna izquierda*/}
          <div className="columna izquierda">
            <div className="form-group imagen-upload">
              <label htmlFor="foto">Foto de perfil: <span className="required">*</span></label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="foto"
                  accept="image/*"
                  onChange={manejarCambioImagen}
                  required
                />
                <label htmlFor="foto" className="file-label">
                  Seleccionar imagen
                </label>
              </div>
              <p className="file-hint">Formatos: JPEG, PNG, GIF (Máx. 5MB)</p>
            </div>
            {imagenPreview && (
              <div className="imagen-preview">
                <img src={imagenPreview} alt="Vista previa" />
              </div>
            )}
          </div>

          {/* Middle Column - Personal Info */}
          <div className="columna derecha">
            <div className="form-group">
              <label>Cédula: <span className="required">*</span></label>
              <input
                type="text"
                name="CED_PER"
                value={formData.CED_PER}
                onChange={handleCedulaChange}
                placeholder="Ingresa tu cédula"
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre: <span className="required">*</span></label>
              <input
                type="text"
                name="NOM_PER"
                value={formData.NOM_PER}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div className="form-group">
              <label>Apellido: <span className="required">*</span></label>
              <input
                type="text"
                name="APE_PER"
                value={formData.APE_PER}
                onChange={handleChange}
                placeholder="Ingresa tu apellido"
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="text"
                name="TEL_PER"
                value={formData.TEL_PER}
                onChange={handleChange}
                placeholder="Ingresa tu teléfono"
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico: <span className="required">*</span></label>
              <input
                type="email"
                name="COR_PER"
                value={formData.COR_PER}
                onChange={handleChangeCorreo}
                placeholder="ejemplo@uta.edu.ec"
                required
              />
              {isUta && (
                <p className="input-hint">ID Estudiante: {formData.ID_EST}</p>
              )}
            </div>

            <div className="form-group">
              <label>Contraseña: <span className="required">*</span></label>
              <input
                type="password"
                name="CON_PER"
                value={formData.CON_PER}
                onChange={handleChange}
                placeholder="Crea una contraseña segura"
                required
                minLength="8"
              />
              <p className="password-hint">Mínimo 8 caracteres, con letras y números</p>
            </div>
          </div>

          {/* datos estudiante */}
          {isUta && (
            <div className="columna derecha">


              <div className="form-group">
                <label>Información de Estudiante</label>
                <label>Carrera: <span className="required">*</span></label>
                <select
                  name="ID_CAR"
                  value={formData.ID_CAR}
                  onChange={handleCarreraChange}
                  required
                >
                  <option value="">Seleccione una carrera</option>
                  {carreras.map(c => (
                    <option key={c.ID_CAR} value={c.ID_CAR}>
                      {c.NOM_CAR}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nivel: <span className="required">*</span></label>
                <select
                  name="ID_NIV"
                  value={formData.ID_NIV}
                  onChange={handleChange}
                  required
                  disabled={!formData.ID_CAR}
                >
                  <option value="">Seleccione un nivel</option>
                  {niveles.map(n => (
                    <option key={n.ID_NIV} value={n.ID_NIV}>
                      {n.NOM_NIV}
                    </option>
                  ))}
                </select>
                {!formData.ID_CAR && (
                  <p className="input-hint">Seleccione una carrera primero</p>
                )}
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-submit">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              isUta ? 'Registrar como Estudiante' : 'Registrar como Usuario'
            )}
          </button>

          <p className="login-link">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistroEstudiante;