import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/Usuarios.css";

const EditAutoridad = ({
  isOpen,
  closeModal,
  autoridadSeleccionada,
  onSave,
}) => {
  const [autoridadData, setAutoridadData] = useState({
    ID_AUT: "",
    DIR_AUT: "",
    CAR_AUT: "",
    ID_FAC: "",
  });

  const [facultades, setFacultades] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/facultades")
      .then((res) => setFacultades(res.data))
      .catch((err) => console.error("Error al cargar facultades:", err));
  }, []);

  useEffect(() => {
    if (autoridadSeleccionada) {
      const { autoridad } = autoridadSeleccionada;
      setAutoridadData({
        ID_AUT: autoridad.ID_AUT || "",
        DIR_AUT: autoridad.DIR_AUT || "",
        CAR_AUT: autoridad.CAR_AUT || "",
        ID_FAC: autoridad.ID_FAC || "",
      });
    }
  }, [autoridadSeleccionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAutoridadData({ ...autoridadData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/autoridades/${autoridadData.ID_AUT}`,
        autoridadData
      );
      onSave();
      closeModal();
    } catch (error) {
      console.error("Error al actualizar autoridad:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Botón de cierre tipo X */}
        <button className="close-buttonR" onClick={closeModal}>
          ×
        </button>

        <h2>Editar Autoridad</h2>
        <form onSubmit={handleSubmit} className="formulario">
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="DIR_AUT"
              value={autoridadData.DIR_AUT}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Cargo:</label>
            <select
              name="CAR_AUT"
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
            <label>Facultad:</label>
            <select
              name="ID_FAC"
              value={autoridadData.ID_FAC}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una facultad</option>
              {facultades.map((fac) => (
                <option key={fac.ID_FAC} value={fac.ID_FAC}>
                  {fac.NOM_FAC}
                </option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAutoridad;
