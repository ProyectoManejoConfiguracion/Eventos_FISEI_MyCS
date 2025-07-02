import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../../config";
import "../../Styles/Evento.css";
import { FaTimes } from "react-icons/fa";
import NivelesModal from "../../Components/modals/NivelesModal";

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
    certificado: true,
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

const EditEvento = ({ isOpen, closeModal, eventoSeleccionado, onSave }) => {

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
    CERTIFICADO: false,
    ASISTENCIA: false,
    CAR_MOT: false,
    ID_DET: "",
    EST_VIS: "VISIBLE",
  });

  const [autoridades, setAutoridades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [todosNiveles, setTodosNiveles] = useState([]);
  const [selectedCarreras, setSelectedCarreras] = useState([]);
  const [selectedNiveles, setSelectedNiveles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentCarrera, setCurrentCarrera] = useState(null);
  const [tarifas, setTarifas] = useState({
    ESTUDIANTE: "",
    PERSONA: ""
  });
  const [imagenPreview, setImagenPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [detalleEvento, setDetalleEvento] = useState(null);
  const [datosListos, setDatosListos] = useState(false);
  const [registrosExistentes, setRegistrosExistentes] = useState([]);
  const [tarifasExistentes, setTarifasExistentes] = useState([]);

  // Función para cargar todos los datos básicos
  useEffect(() => {
    if (isOpen && eventoSeleccionado) {
      cargarDatos();
      
      // Formatear fechas para el input date (YYYY-MM-DD)
      const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        ...eventoSeleccionado,
        FEC_EVT: formatearFecha(eventoSeleccionado.FEC_EVT),
        FEC_FIN: formatearFecha(eventoSeleccionado.FEC_FIN || eventoSeleccionado.FEC_EVT),
        EST_VIS: eventoSeleccionado.EST_VIS || "VISIBLE",
      });

      // Si hay una imagen, establecer la vista previa
      if (eventoSeleccionado.FOT_EVT) {
        setImagenPreview(`${BACK_URL}/${eventoSeleccionado.FOT_EVT.replace(/\\/g, "/")}`);
      } else {
        setImagenPreview(null);
      }
    }
  }, [isOpen, eventoSeleccionado]);

  // Carga detalles después de cargar datos básicos
  useEffect(() => {
    if (isOpen && eventoSeleccionado?.ID_EVT) {
      cargarDetalleEvento();
    }
  }, [isOpen, eventoSeleccionado]);

  // Carga carreras y niveles después de tener el ID_DET
  useEffect(() => {
    if (formData.ID_DET && todosNiveles.length > 0) {
      cargarCarrerasYNiveles();
    }
  }, [formData.ID_DET, todosNiveles]);

  // Carga tarifas después de tener ID_EVT
  useEffect(() => {
    if (eventoSeleccionado?.ID_EVT && eventoSeleccionado.TIP_EVT === "DE PAGO") {
      cargarTarifas();
    }
  }, [eventoSeleccionado?.ID_EVT, eventoSeleccionado?.TIP_EVT]);

  useEffect(() => {
    const logica = categoriaLogica[formData.CAT_DET];
    if (!logica) return;

    if (!detalleEvento) {
      setFormData((prev) => ({
        ...prev,
        CERTIFICADO: logica.certificado === true,
        ASISTENCIA: logica.asistencia === true,
        CAR_MOT: logica.carta === true,
      }));
    }
  }, [formData.CAT_DET, detalleEvento]);

  const cargarDatos = async () => {
    try {
      const [resAutoridades, resCarreras, resNiveles] = await Promise.all([
        axios.get(`${BACK_URL}/api/autoridades`),
        axios.get(`${BACK_URL}/api/carreras`),
        axios.get(`${BACK_URL}/api/nivel`)
      ]);
      
      setAutoridades(resAutoridades.data);
      setCarreras(resCarreras.data);
      setTodosNiveles(resNiveles.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar datos necesarios. Intente nuevamente.");
    }
  };

  const cargarDetalleEvento = async () => {
    if (!eventoSeleccionado?.ID_EVT) return;
    
    try {
      const res = await axios.get(`${BACK_URL}/api/detalle_eventos/${eventoSeleccionado.ID_EVT}`);
      const detalle = res.data[0] || res.data;
      setDetalleEvento(detalle);
      
      setFormData(prev => ({
        ...prev,
        ID_DET: detalle.ID_DET, 
        CED_AUT: detalle.CED_AUT || prev.CED_AUT || "",
        CUP_DET: detalle.CUP_DET || prev.CUP_DET || "",
        NOT_DET: detalle.NOT_DET || prev.NOT_DET || "",
        HOR_DET: detalle.HOR_DET || prev.HOR_DET || "",
        ARE_DET: detalle.ARE_DET || prev.ARE_DET || "",
        CAT_DET: detalle.CAT_DET || prev.CAT_DET || "",
        CERTIFICADO: detalle.CERTIFICADO !== undefined ? detalle.CERTIFICADO : prev.CERTIFICADO,
        ASISTENCIA: detalle.ASISTENCIA !== undefined ? detalle.ASISTENCIA : prev.ASISTENCIA,
        CAR_MOT: detalle.CARTA_MOTIVACION === "Requerida" || prev.CAR_MOT,
      }));
      
    } catch (error) {
      console.error("Error al cargar detalle del evento:", error);
    }
  };

  const cargarCarrerasYNiveles = async () => {
    if (!formData.ID_DET) {
      console.log("No hay ID_DET disponible para cargar carreras y niveles");
      return;
    }
    
    try {
      // Cargar carreras asociadas al evento
      const resCarreras = await axios.get(`${BACK_URL}/api/carreras/detalle/${formData.ID_DET}`);
      const carrerasEvento = resCarreras.data || [];
      
      // Obtener IDs de carreras
      const carrerasIds = carrerasEvento.map(c => c.ID_CAR);
      setSelectedCarreras(carrerasIds);
      
      // Cargar niveles asociados al evento
      const resNiveles = await axios.get(`${BACK_URL}/api/nivel/detalle/${formData.ID_DET}`);
      const nivelesEvento = resNiveles.data || [];
      setRegistrosExistentes(nivelesEvento);
      
      // Organizar niveles por carrera
      const nivelesObj = {};
      
      if (nivelesEvento.length > 0 && todosNiveles.length > 0) {
        nivelesEvento.forEach(nivel => {
          const nivelCompleto = todosNiveles.find(n => n.ID_NIV === nivel.ID_NIV);
          
          if (nivelCompleto && nivelCompleto.ID_CAR) {
            const carreraId = nivelCompleto.ID_CAR;
            
            if (!nivelesObj[carreraId]) {
              nivelesObj[carreraId] = [];
            }
            
            nivelesObj[carreraId].push(nivel.ID_NIV);
          }
        });
      }
      
      setSelectedNiveles(nivelesObj);
      
      // Actualizar formData
      setFormData(prev => ({
        ...prev,
        CARRERAS: carrerasIds,
        NIVELES: nivelesEvento.map(n => n.ID_NIV)
      }));
      
      setDatosListos(true);
      
    } catch (error) {
      console.error("Error al cargar carreras y niveles:", error);
    }
  };

  const cargarTarifas = async () => {
    if (!eventoSeleccionado?.ID_EVT || eventoSeleccionado.TIP_EVT !== "DE PAGO") return;
    
    try {
      const res = await axios.get(`${BACK_URL}/api/tarifas_evento/evento/${eventoSeleccionado.ID_EVT}`);
      const tarifasData = res.data || [];
      setTarifasExistentes(tarifasData);

      const tarifasObj = { ESTUDIANTE: "", PERSONA: "" };
      tarifasData.forEach(tarifa => {
        if (tarifa.TIP_PAR === "ESTUDIANTE") {
          tarifasObj.ESTUDIANTE = tarifa.VAL_EVT;
        } else if (tarifa.TIP_PAR === "PERSONA") {
          tarifasObj.PERSONA = tarifa.VAL_EVT;
        }
      });
      
      setTarifas(tarifasObj);
    } catch (error) {
      console.error("Error al cargar tarifas:", error);
    }
  };

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

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
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

      setFormData((prev) => ({ ...prev, FOT_EVT: archivo, nuevaImagen: true }));
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.NOM_EVT) {
      setError("El nombre del evento es obligatorio");
      return false;
    }
    
    if (!formData.FEC_EVT) {
      setError("La fecha de inicio es obligatoria");
      return false;
    }

    if (!formData.FEC_FIN) {
      setError("La fecha de fin es obligatoria");
      return false;
    }
    
    if (!formData.LUG_EVT) {
      setError("El lugar del evento es obligatorio");
      return false;
    }

    if (!formData.TIP_EVT) {
      setError("Debe seleccionar el tipo de evento");
      return false;
    }

    if (!formData.MOD_EVT) {
      setError("Debe seleccionar la modalidad del evento");
      return false;
    }
    
    if (!formData.ARE_DET) {
      setError("Debe seleccionar un área para el evento");
      return false;
    }
    
    if (!formData.CAT_DET) {
      setError("Debe seleccionar una categoría para el evento");
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
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Construir objeto evento
      const evento = {
        ID_EVT: eventoSeleccionado.ID_EVT,
        NOM_EVT: formData.NOM_EVT,
        SUB_EVT: formData.SUB_EVT || "",
        FEC_EVT: formData.FEC_EVT,
        FEC_FIN: formData.FEC_FIN,
        LUG_EVT: formData.LUG_EVT,
        TIP_EVT: formData.TIP_EVT,
        MOD_EVT: formData.MOD_EVT,
        DES_EVT: formData.DES_EVT || "",
        CAR_MOT: formData.CAR_MOT ? "Requerida" : null,
        EST_VIS: formData.EST_VIS || "VISIBLE",
        FOT_EVT: typeof formData.FOT_EVT === 'string' ? formData.FOT_EVT : undefined
      };
      
      // Construir objeto detalle
      const detalle = {
        ID_DET: formData.ID_DET,
        ID_EVT: eventoSeleccionado.ID_EVT,
        CED_AUT: formData.CED_AUT,
        CUP_DET: formData.CUP_DET,
        NOT_DET: formData.NOT_DET || "",
        HOR_DET: formData.HOR_DET || null,
        ARE_DET: formData.ARE_DET,
        CAT_DET: formData.CAT_DET,
        CERTIFICADO: formData.CERTIFICADO || false,
        ASISTENCIA: formData.ASISTENCIA || false,
        CARTA_MOTIVACION: formData.CAR_MOT ? "Requerida" : null
      };
      
      // Construir array de tarifas
      const tarifasArray = [];
      
      if (formData.TIP_EVT === "DE PAGO") {
        // Buscar tarifa de estudiante existente
        const tarifaEstudiante = tarifasExistentes.find(t => t.TIP_PAR === "ESTUDIANTE");
        tarifasArray.push({
          ID_TAR: tarifaEstudiante?.ID_TAR || null,
          ID_EVT: eventoSeleccionado.ID_EVT,
          TIP_PAR: "ESTUDIANTE",
          VAL_EVT: parseFloat(tarifas.ESTUDIANTE)
        });
        
        // Si es público, añadir tarifa para personas
        if (formData.MOD_EVT === "PUBLICO") {
          const tarifaPersona = tarifasExistentes.find(t => t.TIP_PAR === "PERSONA");
          tarifasArray.push({
            ID_TAR: tarifaPersona?.ID_TAR || null,
            ID_EVT: eventoSeleccionado.ID_EVT,
            TIP_PAR: "PERSONA",
            VAL_EVT: parseFloat(tarifas.PERSONA)
          });
        }
      }
      
      // Construir array de registros (niveles)
      const registrosArray = [];
      
      if (formData.MOD_EVT === "PRIVADO" && formData.NIVELES && formData.NIVELES.length > 0) {
        // Mapear niveles seleccionados a registros
        formData.NIVELES.forEach(nivelId => {
          // Buscar registro existente para este nivel
          const registroExistente = registrosExistentes.find(r => r.ID_NIV === nivelId);
          
          registrosArray.push({
            ID_REG: registroExistente?.ID_REG || null,
            ID_DET: formData.ID_DET,
            ID_NIV: nivelId
          });
        });
      } else if (formData.MOD_EVT === "PUBLICO") {
        // Para eventos públicos, añadir un registro con ID_NIV: null
        registrosArray.push({
          ID_REG: null,
          ID_DET: formData.ID_DET,
          ID_NIV: null
        });
      }
      
      // Preparar FormData
      const formDataToSend = new FormData();
      formDataToSend.append('evento', JSON.stringify(evento));
      formDataToSend.append('detalle', JSON.stringify(detalle));
      formDataToSend.append('tarifas', JSON.stringify(tarifasArray));
      formDataToSend.append('registros', JSON.stringify(registrosArray));
      
      // Añadir imagen si hay una nueva
      if (formData.nuevaImagen && formData.FOT_EVT instanceof File) {
        formDataToSend.append('FOT_EVT', formData.FOT_EVT);
      }
      
      // Enviar datos
      await axios.put(`${BACK_URL}/api/eventos/${eventoSeleccionado.ID_EVT}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Evento actualizado exitosamente");
      onSave();
      closeModal();
      
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      setError("Error al actualizar el evento. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !eventoSeleccionado) return null;

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
          <h2>Editar Evento: {eventoSeleccionado.NOM_EVT}</h2>
          <button className="close-button" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>
        
        <div className="info-bar" style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <div>ID: {eventoSeleccionado.ID_EVT}</div>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-columns">
            <div className="form-column">
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
                <label>Subtítulo</label>
                <textarea
                  name="SUB_EVT"
                  value={formData.SUB_EVT}
                  onChange={handleChange}
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label>Descripción del Evento</label>
                <textarea
                  name="DES_EVT"
                  value={formData.DES_EVT}
                  onChange={handleChange}
                  maxLength={500}
                />
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

              <div className="form-row">
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
                    min={formData.FEC_EVT}
                    required
                  />
                </div>
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
                            id={`carrera-${c.ID_CAR}`}
                            value={c.ID_CAR}
                            checked={selectedCarreras.includes(c.ID_CAR)}
                            onChange={handleCheckboxCarrera}
                          />
                          <label htmlFor={`carrera-${c.ID_CAR}`}>
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
            
            <div className="form-column">
              <div className="form-group">
                <label>Lugar del Evento *</label>
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
                  <option value="Auditorio Central">Auditorio Central</option>
                </select>
              </div>

              <div className="form-group">
                <label>Autoridad a Cargo *</label>
                <select
                  name="CED_AUT"
                  value={formData.CED_AUT}
                  onChange={handleChange}
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

              <div className="form-row">
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
              </div>

              {formData.TIP_EVT === "DE PAGO" && (
                <div className="form-group tarifas-container">
                  <label>Tarifas</label>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Estudiantes *</label>
                      <input
                        type="number"
                        name="ESTUDIANTE"
                        value={tarifas.ESTUDIANTE}
                        onChange={handleTarifaChange}
                        min="0.01"
                        step="0.01"
                        required={formData.TIP_EVT === "DE PAGO"}
                      />
                    </div>
                    
                    {formData.MOD_EVT === "PUBLICO" && (
                      <div className="form-group">
                        <label>Público General *</label>
                        <input
                          type="number"
                          name="PERSONA"
                          value={tarifas.PERSONA}
                          onChange={handleTarifaChange}
                          min="0.01"
                          step="0.01"
                          required={formData.TIP_EVT === "DE PAGO" && formData.MOD_EVT === "PUBLICO"}
                        />
                      </div>
                    )}
                  </div>
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

              {categoriaLogica[formData.CAT_DET]?.horas && (
                <div className="form-group">
                  <label>Asistencia Mínima % *</label>
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

              <div className="form-group">
                <label>Fotografía del Evento</label>
                <div className="file-input-container">
                  <label className="file-label" htmlFor="foto-evento-edit">
                    Cambiar imagen
                  </label>
                  <input
                    type="file"
                    id="foto-evento-edit"
                    accept="image/*"
                    onChange={manejarCambioImagen}
                  />
                </div>
                {imagenPreview && (
                  <div className="imagen-previewer">
                    <img src={imagenPreview} alt="Vista previa" />
                  </div>
                )}
              </div>

              {(categoriaLogica[formData.CAT_DET]?.carta === "opcional" || detalleEvento?.CARTA_MOTIVACION === "Requerida") && (
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="CAR_MOT"
                      checked={formData.CAR_MOT}
                      onChange={handleCheckbox}
                    />
                    Requiere carta de motivación
                  </label>
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions" style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#581517',
                  color: 'white',
                  border: 'none',
                  display: 'center',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {loading ? "Guardando..." : "Actualizar Evento"}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {showModal && currentCarrera && (
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
      )}
    </div>
  );
};

export default EditEvento;