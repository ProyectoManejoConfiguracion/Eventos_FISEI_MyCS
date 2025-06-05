import React from "react";
import { useState } from "react";
import "../Styles/Registro.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const registroEstudiante = () => {



  const [formData, setFormData] = useState({
    CED_PER: "",
    NOM_PER: "",
    APE_PER: "",
    TEL_PER: "",
    COR_PER: "",
    CON_PER: "",
    FOT_PER: null
  });

  const [formData2, setFormData2] = useState({
    ID_EST: "",
    CED_EST: "",
    ID_NIV: ""

  })


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const [imagenPreview, setImagenPreview] = useState(null);

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
        FOT_PER: archivo
      });
      setError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación básica de campos
    if (!formData.CED_PER || !formData.NOM_PER || !formData.APE_PER ||
      !formData.COR_PER || !formData.CON_PER) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      // Agregar campos al FormData
      data.append('CED_PER', formData.CED_PER);
      data.append('NOM_PER', formData.NOM_PER);
      data.append('APE_PER', formData.APE_PER);
      data.append('TEL_PER', formData.TEL_PER);
      data.append('COR_PER', formData.COR_PER);
      data.append('CON_PER', formData.CON_PER);

      // Agregar imagen si existe
      if (formData.FOT_PER) {
        data.append('FOT_PER', formData.FOT_PER);
      }

      const response = await axios.post(
        "http://localhost:3000/personas",
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        const estudianteResponse = await axios.post("http://localhost:3000/estudiantes", {
          ID_EST: formData2.ID_EST,
          ID_CAR: formData2.ID_CAR,
          CED_PER: formData.CED_PER  // se asume que es clave foránea
        });

      }
      if (estudianteResponse.status === 200 || estudianteResponse.status === 201) {
        console.log("Registro exitoso:", response.data);
        alert("¡Registro completo!");
        navigate("/");
      }
    } catch (error) {
      const serverError = error.response?.data?.error || "Error en el registro";
      setError(serverError);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="registro-container">
            <div className="registro-header">
                <h1>Crear Cuenta estudiante</h1>
                <p>Únete a nuestra comunidad académica</p>
            </div>
            
            <form className="formulario" onSubmit={handleSubmit}>
                <div className="form-container">
                    {/* Columna izquierda - Imagen */}
                    <div className="columna izquierda">
                        <div className="form-group imagen-upload">
                            <label htmlFor="foto">Foto de perfil:</label>
                            <div className="file-input-container">
                                <input 
                                    type="file" 
                                    id="foto" 
                                    accept="image/*" 
                                    onChange={manejarCambioImagen} 
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

                    {/* Columna derecha - Formulario de registro */}
                    <div className="columna derecha">
                        <div className="form-group">
                            <label>Cédula: <span className="required">*</span></label>
                            <input 
                                type="text" 
                                name="CED_PER"
                                value={formData.CED_PER}
                                onChange={handleChange}
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
                                onChange={handleChange}
                                placeholder="ejemplo@uta.edu.ec"
                                required
                            />
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
                            />
                            <p className="password-hint">Mínimo 8 caracteres, con letras y números</p>
                        </div>
                    </div>

                            <div className="columna estudiante">
          <div>
            <div className="form-group">
              <label>ID ESTUDIANTE:</label>
              <input
                type="text"
                name="ID_EST"
                value={formData2.ID_EST}
                onChange={handleChange2}
                placeholder="Ingresa tu ID de estudiante"
                required
              />
            </div>
            <div className="form-group">
              <label>Carrera :</label>
              <input
                type="text"
                name="ID_CAR"
                value={formData2.ID_CAR}
                onChange={handleChange2}
                placeholder="ingresa tu carrera"
                required
              />
            </div>
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
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                    
                    <p className="login-link">
                        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                    </p>
                </div>
            </form>
        </div>
  )
}

export default registroEstudiante;