import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../../config";
import NivelesModal from "../../Components/modals/NivelesModal";
import { FaTimes } from "react-icons/fa";

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
    certificado: false,
    asistencia: false,
    horas: false,
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
    nota: false,
    certificado: true,
    asistencia: true,
    horas: true,
    carta: "opcional",
  },
  SEMINARIOS: {
    nota: false,
    certificado: false,
    asistencia: true,
    horas: true,
    carta: "opcional",
  },
};

const areas = [
  "SALUD Y SERVICIOS SOCIALES",
  "CIENCIAS NATURALES Y MATEMATICAS",
  "TECNOLOGIA E INGENIERIA",
  "ARTES Y HUMANIDADES",
  "CIENCIAS SOCIALES,COMUNICACION Y DERECHO",
  "ADMINISTRACION Y NEGOCIOS",
  "EDUCACION",
  "SERVICIOS GENERALES"
];

// Modificado para recibir props de modal
const ModalEvento = ({ isOpen, closeModal, onSave }) => {
  // No usamos useNavigate aquí, ya que estamos en un modal

  const [autoridades, setAutoridades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [todosNiveles, setTodosNiveles] = useState([]);
  const [selectedCarreras, setSelectedCarreras] = useState([]);
  const [selectedNiveles, setSelectedNiveles] = useState({});
  const [imagenPreview, setImagenPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCarrera, setCurrentCarrera] = useState(null);
  const [tarifas, setTarifas] = useState({
    ESTUDIANTE: "",
    PERSONA: ""
  });
  
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
    NIVELES: [],
    PRECIO: "",
    CERTIFICADO: false,
    ASISTENCIA: false,
    CAR_MOT: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Solo cargar datos cuando el modal está abierto
    if (isOpen) {
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
        .then((data) => setTodosNiveles(data))
        .catch((err) => console.error("Error cargando niveles:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    const logica = categoriaLogica[formData.CAT_DET];
    if (!logica) return;

    setFormData((prev) => ({
      ...prev,
      NOT_DET: logica.nota ? prev.NOT_DET : "",
      HOR_DET: logica.horas ? prev.HOR_DET : "",
      CERTIFICADO: logica.certificado === true,
      ASISTENCIA: logica.asistencia === true,
      CAR_MOT: logica.carta === true,
    }));
  }, [formData.CAT_DET]);

  useEffect(() => {
    if (formData.TIP_EVT !== "DE PAGO") {
      setTarifas({ ESTUDIANTE: "", PERSONA: "" });
    }
  }, [formData.TIP_EVT]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "FEC_FIN" && formData.FEC_EVT && value < formData.FEC_EVT) {
      setError("La fecha de fin no puede ser menor a la fecha de inicio");
      return;
    }
    
    if (name === "HOR_DET") {
      const hours = parseInt(value);
      if (hours < 1 || hours > 100) {
        setError("Las horas del evento deben estar entre 1 y 100");
        return;
      }
    }
    
    setError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTarifaChange = (e) => {
    const { name, value } = e.target;
    
    if (value && parseFloat(value) <= 0) {
      setError("La tarifa debe ser un valor positivo");
      return;
    }
    
    setError("");
    setTarifas(prev => ({ ...prev, [name]: value }));
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
    const carreraId = e.target.value;
    let updatedCarreras;
    
    if (selectedCarreras.includes(carreraId)) {
      updatedCarreras = selectedCarreras.filter(c => c !== carreraId);
      
      const updatedNiveles = { ...selectedNiveles };
      delete updatedNiveles[carreraId];
      setSelectedNiveles(updatedNiveles);
    } else {
      updatedCarreras = [...selectedCarreras, carreraId];
      
      setSelectedNiveles({
        ...selectedNiveles,
        [carreraId]: []
      });
    }
    
    setSelectedCarreras(updatedCarreras);
    
    setFormData(prev => ({
      ...prev,
      CARRERAS: updatedCarreras
    }));
  };

  const openNivelesModal = (carreraId) => {
    const carrera = carreras.find(c => c.ID_CAR === carreraId);
    if (carrera) {
      setCurrentCarrera(carrera);
      setShowModal(true);
    }
  };

  const closeNivelesModal = () => {
    setShowModal(false);
    setCurrentCarrera(null);
  };

  const handleNivelSelection = (nivelId) => {
    if (!currentCarrera) return;
    
    const carreraId = currentCarrera.ID_CAR;
    const carreraNiveles = selectedNiveles[carreraId] || [];
    let updatedNiveles;
    
    if (carreraNiveles.includes(nivelId)) {
      updatedNiveles = carreraNiveles.filter(n => n !== nivelId);
    } else {
      updatedNiveles = [...carreraNiveles, nivelId];
    }
    
    setSelectedNiveles({
      ...selectedNiveles,
      [carreraId]: updatedNiveles
    });
  };

  const selectAllNiveles = () => {
    if (!currentCarrera) return;
    
    const carreraId = currentCarrera.ID_CAR;
    const nivelesCarrera = todosNiveles
      .filter(nivel => nivel.ID_CAR === carreraId)
      .map(nivel => nivel.ID_NIV);
      
    setSelectedNiveles({
      ...selectedNiveles,
      [carreraId]: nivelesCarrera
    });
  };

  const deselectAllNiveles = () => {
    if (!currentCarrera) return;
    
    setSelectedNiveles({
      ...selectedNiveles,
      [currentCarrera.ID_CAR]: []
    });
  };

  const saveNivelesSelection = () => {
    const allSelectedNiveles = [];
    
    Object.entries(selectedNiveles).forEach(([carreraId, niveles]) => {
      niveles.forEach(nivelId => {
        allSelectedNiveles.push(nivelId);
      });
    });
    
    setFormData(prev => ({
      ...prev,
      NIVELES: allSelectedNiveles
    }));
    
    closeNivelesModal();
  };

  const validateForm = () => {
    if (!formData.ARE_DET) {
      setError("Debe seleccionar un área para el evento");
      return false;
    }
    
    if (formData.FEC_FIN < formData.FEC_EVT) {
      setError("La fecha de fin no puede ser menor a la fecha de inicio");
      return false;
    }
    
    if (categoriaLogica[formData.CAT_DET]?.horas && 
        (formData.HOR_DET < 0 || formData.HOR_DET > 100)) {
      setError("Las horas del evento deben estar entre 1 y 100");
      return false;
    }
    
    if (categoriaLogica[formData.CAT_DET]?.nota && 
        (formData.NOT_DET < 0 || formData.NOT_DET > 10)) {
      setError("La nota requerida debe estar entre 0 y 10");
      return false;
    }
    
    if (formData.CUP_DET <= 0) {
      setError("El cupo debe ser un número positivo");
      return false;
    }
    
    if (formData.MOD_EVT === "PRIVADO" && formData.CARRERAS.length === 0) {
      setError("Si el evento es privado, debe seleccionar al menos una carrera");
      return false;
    }
    
    if (formData.TIP_EVT === "DE PAGO") {
      if (!tarifas.ESTUDIANTE || parseFloat(tarifas.ESTUDIANTE) <= 0) {
        setError("Debe especificar una tarifa para estudiantes");
        return false;
      }
      
      if (formData.MOD_EVT === "PUBLICO" && (!tarifas.PERSONA || parseFloat(tarifas.PERSONA) <= 0)) {
        setError("Si el evento es público y de pago, debe especificar una tarifa para público general");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

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
      if (formData.FOT_EVT) data.append("FOT_EVT", formData.FOT_EVT);

      const response = await axios.post(`${BACK_URL}/api/eventos`, data);
      const nuevoID_EVT = response.data.ID_EVT;

      // Preparamos los datos para el detalle, con las modificaciones solicitadas
      const detalleData = {
        ID_EVT: nuevoID_EVT,
        CED_AUT: formData.CED_AUT,
        CUP_DET: formData.CUP_DET,
        NOT_DET: formData.NOT_DET,
        HOR_DET: formData.HOR_DET === "" ? null : formData.HOR_DET, 
        CERTIFICADO: formData.CERTIFICADO,
        ASISTENCIA: null,
        CARTA_MOTIVACION: formData.CAR_MOT ? "Requerida" : false,
        ARE_DET: formData.ARE_DET,
        CAT_DET: formData.CAT_DET,
        CARRERAS: formData.MOD_EVT === "PRIVADO" ? formData.CARRERAS : [],
        NIVELES: formData.MOD_EVT === "PRIVADO" ? formData.NIVELES : []
      };

      await axios.post(`${BACK_URL}/api/detalle_eventos`, detalleData);
      
      if (formData.TIP_EVT === "DE PAGO") {
        const peticionesTarifas = [];
        
        peticionesTarifas.push(
          axios.post(`${BACK_URL}/api/eventos/asignar_tarifa`, {
            ID_EVT: nuevoID_EVT,
            TIP_PAR: "ESTUDIANTE",
            VAL_EVT: tarifas.ESTUDIANTE
          })
        );
        
        if (formData.MOD_EVT === "PUBLICO") {
          peticionesTarifas.push(
            axios.post(`${BACK_URL}/api/eventos/asignar_tarifa`, {
              ID_EVT: nuevoID_EVT,
              TIP_PAR: "PERSONA",
              VAL_EVT: tarifas.PERSONA
            })
          );
        }
        
        await Promise.all(peticionesTarifas);
      }
      
      alert("Evento registrado exitosamente");
      
      // Llamar a onSave y cerrar el modal
      if (onSave) onSave();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Error al registrar el evento. Verifica los campos.");
    } finally {
      setLoading(false);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999
    }}>
      <div className="modal-container" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        width: '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1000000
      }}>
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1,
          borderRadius: '8px 8px 0 0'
        }}>
          <h2 style={{margin: 0}}>Registrar Nuevo Evento</h2>
          <button 
            className="close-button" 
            onClick={closeModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body" style={{padding: '20px'}}>
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="form-container">
              <div className="columna izquierda">
                <div className="form-group">
                  <label>Nombre del Evento *</label>
                  <input
                    name="NOM_EVT"
                    value={formData.NOM_EVT}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subtitulo *</label>
                  <textarea
                    name="SUB_EVT"
                    value={formData.SUB_EVT}
                    onChange={handleChange}
                    maxLength={200}
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
                    maxLength={500}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Área del Evento *</label>
                  <select
                    name="ARE_DET"
                    value={formData.ARE_DET}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un área</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fecha Inicio *</label>
                  <input
                    type="date"
                    name="FEC_EVT"
                    value={formData.FEC_EVT}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
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
                    min={formData.FEC_EVT}
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
                
                <div className="form-group">
                  <label>Cupo *</label>
                  <input
                    type="number"
                    name="CUP_DET"
                    value={formData.CUP_DET}
                    onChange={handleChange}
                    min="1"
                    max="1000"
                    required
                  />
                </div>
                
              </div>

              <div className="columna derecha">
                <div className="form-group">
                  <label>Fotografía del Evento *</label>
                  <div className="file-input-container">
                    <label className="file-label" htmlFor="foto-modal">
                      Seleccionar imagen
                    </label>
                    <input
                      type="file"
                      id="foto-modal"
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
                  <div className="tarifas-container">
                    <h3 className="tarifas-titulo">Tarifas</h3>
                    
                    <div className="form-group">
                      <label>Tarifa para Estudiantes *</label>
                      <input
                        type="number"
                        name="ESTUDIANTE"
                        value={tarifas.ESTUDIANTE}
                        onChange={handleTarifaChange}
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    {formData.MOD_EVT === "PUBLICO" && (
                      <div className="form-group">
                        <label>Tarifa para Público General *</label>
                        <input
                          type="number"
                          name="PERSONA"
                          value={tarifas.PERSONA}
                          onChange={handleTarifaChange}
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </div>
                    )}
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
                {categoriaLogica[formData.CAT_DET]?.carta === "opcional" && (
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.CAR_MOT}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            CAR_MOT: !prev.CAR_MOT,
                          }))
                        }
                      />
                      Incluir carta de motivación
                    </label>
                  </div>
                )}
                {categoriaLogica[formData.CAT_DET]?.nota && (
                  <div className="form-group">
                    <label>Nota *</label>
                    <input
                      type="number"
                      name="NOT_DET"
                      value={formData.NOT_DET}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      step="0.1"
                      required
                    />
                  </div>
                )}

                {categoriaLogica[formData.CAT_DET]?.horas && (
                  <div className="form-group">
                    <label>Asistencia Mínima %*</label>
                    <input
                      type="number"
                      name="HOR_DET"
                      value={formData.HOR_DET}
                      onChange={handleChange}
                      min="1"
                      max="100"
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
                    <div className="carreras-container">
                      {carreras.map((c) => (
                        <div key={c.ID_CAR} className="carrera-item">
                          <div className="carrera-checkbox">
                            <input
                              type="checkbox"
                              id={`carrera-modal-${c.ID_CAR}`}
                              value={c.ID_CAR}
                              checked={selectedCarreras.includes(c.ID_CAR)}
                              onChange={handleCheckboxCarrera}
                            />
                            <label htmlFor={`carrera-modal-${c.ID_CAR}`}>
                              {c.NOM_CAR}
                            </label>
                          </div>
                          {selectedCarreras.includes(c.ID_CAR) && (
                            <button 
                              type="button" 
                              className="btn-select-niveles" 
                              onClick={() => openNivelesModal(c.ID_CAR)}
                            >
                              Seleccionar Niveles
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </div>

            <div className="form-actions" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '20px'
            }}>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#581517',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {loading ? "Cargando..." : "Registrar Evento"}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
      
      <NivelesModal 
        show={showModal}
        onClose={closeNivelesModal}
        carrera={currentCarrera}
        niveles={todosNiveles}
        selectedNiveles={selectedNiveles}
        onNivelSelection={handleNivelSelection}
        onSelectAll={selectAllNiveles}
        onDeselectAll={deselectAllNiveles}
        onSave={saveNivelesSelection}
        
      />
    </div>
  );
};

export default ModalEvento;