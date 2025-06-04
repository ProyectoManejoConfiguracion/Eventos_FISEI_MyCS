import React from "react";
import { useState } from "react";
import "../Styles/Registro.css";
import imagen from "../imagenes/descarga.jpeg";

const Registro = () => {
    const [imagenPreview, setImagenPreview] = useState(null);

    const manejarCambioImagen = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onloadend = () => {
                setImagenPreview(lector.result);
            };
            lector.readAsDataURL(archivo);
        }
    };

    return (

    <form className="formulario">
      <div className="form-container">
        {/* Columna izquierda - Imagen */}
        <div className="columna izquierda">
          <div className="form-group">
            <label htmlFor="foto">Foto de perfil:</label>
            <input type="file" id="foto" accept="image/*" onChange={manejarCambioImagen} />
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
            <label>Nombre:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Nombre de usuario:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input type="email" />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" />
          </div>
        </div>
      </div>

      <div className="form-submit">
        <button type="submit">Registrarse</button>
      </div>
    </form>
    )
}

export default Registro;