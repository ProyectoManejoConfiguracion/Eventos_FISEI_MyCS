import React, { useState, useEffect } from "react";
import {
  FaUser, FaEnvelope, FaPhone, FaPen, FaSave, FaTimes, 
  FaUpload, FaChevronLeft, FaIdCard, FaGraduationCap, FaFilePdf, FaFileImage,
  FaTrash, FaEye, FaEdit, FaExclamationTriangle
} from "react-icons/fa";
import "../../Styles/Configuracion_Est.css";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { BACK_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

// Hook personalizado para manejo de archivos
const useFileManager = () => {
  const [cedulaFile, setCedulaFile] = useState(null);
  const [credencialFile, setCredencialFile] = useState(null);
  const [cedulaPreview, setCedulaPreview] = useState("");
  const [credencialPreview, setCredencialPreview] = useState("");
  const [error, setError] = useState("");

  const validateFile = (file, type) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(`El archivo de ${type} no debe superar 5MB`);
      return false;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError(`Solo se permiten archivos PDF, JPG, JPEG o PNG para ${type}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (file, type) => {
    if (!file || !validateFile(file, type)) return;

    if (type === 'cedula') {
      setCedulaFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setCedulaPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setCedulaPreview("");
      }
    } else {
      setCredencialFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setCredencialPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setCredencialPreview("");
      }
    }
  };

  const clearFiles = () => {
    setCedulaFile(null);
    setCredencialFile(null);
    setCedulaPreview("");
    setCredencialPreview("");
    setError("");
  };

  return {
    cedulaFile,
    credencialFile,
    cedulaPreview,
    credencialPreview,
    error,
    handleFileChange,
    clearFiles,
    setError
  };
};

// Hook personalizado para datos del perfil
const useProfileData = (userId) => {
  const [profileData, setProfileData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    contra: "",
    foto: "",
    fotoOriginal: "",
    numeroCedula: "",
    cedulaArchivo: "",
    carrera: "",
    nivel: "",
    credencialArchivo: ""
  });
  
  const [personaCompleteData, setPersonaCompleteData] = useState(null);
  const [studentCompleteData, setStudentCompleteData] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const normalizeLevel = (nivel) => {
    if (!nivel) return "";
    const levelMap = {
      'PRIMERO': 'Primero', 'SEGUNDO': 'Segundo', 'TERCERO': 'Tercero',
      'CUARTO': 'Cuarto', 'QUINTO': 'Quinto', 'SEXTO': 'Sexto',
      'SÉPTIMO': 'Séptimo', 'SEPTIMO': 'Séptimo', 'OCTAVO': 'Octavo',
      'NOVENO': 'Noveno', 'DÉCIMO': 'Décimo', 'DECIMO': 'Décimo',
      'PREGRADO': 'Pregrado', 'POSTGRADO': 'Postgrado',
      'MAESTRÍA': 'Maestría', 'MAESTRIA': 'Maestría', 'DOCTORADO': 'Doctorado'
    };
    return levelMap[nivel.toUpperCase()] || nivel;
  };

  const loadProfileData = async (user) => {
    if (!user?.id) return;
    
    setLoadingData(true);
    try {
      const userRole = user?.rol || user?.role || user?.ROL_PER || "";
      const isStudentRole = ['estudiante', 'student'].includes(userRole.toLowerCase());
      setIsStudent(isStudentRole);

      // Cargar datos personales
      const personalResponse = await fetch(`${BACK_URL}/api/personas/${user.id}`);
      if (!personalResponse.ok) throw new Error('Error al cargar datos personales');
      
      const data = await personalResponse.json();
      setPersonaCompleteData(data);

      const fotoUrl = data.FOT_PER ? `${BACK_URL}/${data.FOT_PER.replace(/\\/g, "/")}` : "";
      const cedulaUrl = data.FOT_CED ? `${BACK_URL}/${data.FOT_CED.replace(/\\/g, "/")}` : "";

      let carrera = data.CARRERA || "";
      let nivel = data.NIVEL || "";
      let credencialUrl = "";
      let studentData = null;

      // Datos específicos de estudiante
      if (isStudentRole) {
        try {
          // Datos académicos
          const carreraResponse = await fetch(`${BACK_URL}/api/carrera-conf/${user.id}`);
          if (carreraResponse.ok) {
            const carreraData = await carreraResponse.json();
            const academicInfo = Array.isArray(carreraData) ? carreraData[0] : carreraData;
            if (academicInfo) {
              carrera = academicInfo.carrera || carrera;
              nivel = normalizeLevel(academicInfo.nivel) || nivel;
            }
          }

          // Datos de estudiante
          const studentResponse = await fetch(`${BACK_URL}/api/estudiantes/cedula/${user.id}`);
          if (studentResponse.ok) {
            studentData = await studentResponse.json();
            setStudentCompleteData(studentData);
            credencialUrl = studentData.FOT_INS 
              ? `${BACK_URL}/${studentData.FOT_INS.replace(/\\/g, "/")}`
              : "";
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }

      setProfileData({
        nombres: data.NOM_PER || "",
        apellidos: data.APE_PER || "",
        email: data.COR_PER || "",
        contra: data.CON_PER || "",
        telefono: data.TEL_PER ? data.TEL_PER.toString() : "",
        foto: fotoUrl,
        fotoOriginal: data.FOT_PER || "",
        numeroCedula: data.CED_PER || data.NUM_CED || "",
        cedulaArchivo: data.FOT_CED || "",
        carrera,
        nivel,
        credencialArchivo: studentData?.FOT_INS || ""
      });

      return { cedulaUrl, credencialUrl };
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error);
      throw error;
    } finally {
      setLoadingData(false);
    }
  };

  return {
    profileData,
    setProfileData,
    personaCompleteData,
    setPersonaCompleteData,
    studentCompleteData,
    setStudentCompleteData,
    isStudent,
    loadingData,
    loadProfileData
  };
};

// Componente para mostrar archivos existentes
const ExistingFileDisplay = ({ fileUrl, type, onView, onDelete, onEdit, fileExists }) => {
  if (!fileUrl) return null;

  const isImageFile = (filePath) => {
    if (!filePath) return false;
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => 
      filePath.toLowerCase().includes(ext)
    );
  };

  return (
    <div className={`existing-file-display ${!fileExists ? 'file-missing' : ''}`}>
      <div className="file-info">
        <div className="file-icon">
          {!fileExists ? (
            <FaExclamationTriangle size={20} color="#dc3545" />
          ) : isImageFile(fileUrl) ? (
            <FaFileImage size={20} color="#4CAF50" />
          ) : (
            <FaFilePdf size={20} color="#f44336" />
          )}
        </div>
        <span className="file-name">
          {type === 'cedula' ? 'Cédula' : 'Credencial'} 
          {!fileExists ? ' (Archivo no encontrado)' : ' subida'}
        </span>
      </div>
      <div className="file-actions">
        {fileExists ? (
          <>
            <button
              type="button"
              onClick={() => onView(fileUrl, type)}
              className="file-action-btn view-btn"
              title="Ver archivo"
            >
              <FaEye size={14} />
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="file-action-btn edit-btn"
              title="Cambiar archivo"
            >
              <FaEdit size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="file-action-btn edit-btn"
            title="Subir nuevo archivo"
          >
            <FaUpload size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(type)}
          className="file-action-btn delete-btn"
          title="Eliminar referencia"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
};

// Componente Modal para archivos
const FileModal = ({ show, onClose, fileUrl, title }) => {
  if (!show) return null;

  const isImageFile = (filePath) => {
    if (!filePath) return false;
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => 
      filePath.toLowerCase().includes(ext)
    );
  };

  return (
    <div className="file-modal-overlay" onClick={onClose}>
      <div className="file-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="file-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="file-modal-body">
          {isImageFile(fileUrl) ? (
            <img src={fileUrl} alt={title} className="modal-image" />
          ) : (
            <div className="pdf-container">
              <iframe
                src={fileUrl}
                title={title}
                className="modal-pdf"
                frameBorder="0"
              />
              <p>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Abrir en nueva pestaña
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente principal refactorizado
const Configuracion_Est = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    profileData,
    setProfileData,
    personaCompleteData,
    setPersonaCompleteData,
    studentCompleteData,
    isStudent,
    loadingData,
    loadProfileData
  } = useProfileData();

  const {
    cedulaFile,
    credencialFile,
    cedulaPreview,
    credencialPreview,
    error,
    handleFileChange,
    clearFiles,
    setError
  } = useFileManager();

  const [editingProfile, setEditingProfile] = useState(false);
  const [existingCedulaFile, setExistingCedulaFile] = useState("");
  const [existingCredencialFile, setExistingCredencialFile] = useState("");
  const [showCedulaModal, setShowCedulaModal] = useState(false);
  const [showCredencialModal, setShowCredencialModal] = useState(false);
  const [cedulaFileExists, setCedulaFileExists] = useState(true);
  const [credencialFileExists, setCredencialFileExists] = useState(true);
  const [verifyingFiles, setVerifyingFiles] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user?.id) {
      loadProfileData(user)
        .then(({ cedulaUrl, credencialUrl }) => {
          setExistingCedulaFile(cedulaUrl);
          setExistingCredencialFile(credencialUrl);
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los datos del perfil.',
            icon: 'error',
            confirmButtonColor: '#581517'
          });
        });
    }
  }, [user?.id]);

  // Verificar archivos existentes
  useEffect(() => {
    const verifyFiles = async () => {
      if (!existingCedulaFile && !existingCredencialFile) return;
      
      setVerifyingFiles(true);
      try {
        if (existingCedulaFile) {
          const cedulaExists = await verifyFileExists(existingCedulaFile);
          setCedulaFileExists(cedulaExists);
          if (!cedulaExists) {
            showFileNotFoundAlert('Cédula');
            setExistingCedulaFile("");
            setProfileData(prev => ({ ...prev, cedulaArchivo: "" }));
          }
        }
        
        if (isStudent && existingCredencialFile) {
          const credencialExists = await verifyFileExists(existingCredencialFile);
          setCredencialFileExists(credencialExists);
          if (!credencialExists) {
            showFileNotFoundAlert('Credencial');
            setExistingCredencialFile("");
            setProfileData(prev => ({ ...prev, credencialArchivo: "" }));
          }
        }
      } catch (error) {
        console.error('Error verificando archivos:', error);
      } finally {
        setVerifyingFiles(false);
      }
    };

    if (!loadingData && (existingCedulaFile || existingCredencialFile)) {
      const timer = setTimeout(verifyFiles, 1000);
      return () => clearTimeout(timer);
    }
  }, [existingCedulaFile, existingCredencialFile, isStudent, loadingData]);

  // Funciones auxiliares
  const verifyFileExists = async (filePath) => {
    if (!filePath) return false;
    try {
      const fullUrl = filePath.startsWith('http') ? filePath : `${BACK_URL}/${filePath}`;
      const response = await fetch(fullUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error verificando archivo:', error);
      return false;
    }
  };

  const showFileNotFoundAlert = (type) => {
    Swal.fire({
      title: `Archivo de ${type} No Encontrado`,
      text: `El archivo de ${type.toLowerCase()} registrado no existe en el servidor. Por favor, sube un nuevo archivo.`,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#581517'
    });
  };

  const viewExistingFile = async (fileUrl, type) => {
    const fileExists = await verifyFileExists(fileUrl);
    if (!fileExists) {
      showFileNotFoundAlert(type === 'cedula' ? 'Cédula' : 'Credencial');
      if (type === 'cedula') {
        setCedulaFileExists(false);
        setExistingCedulaFile("");
      } else {
        setCredencialFileExists(false);
        setExistingCredencialFile("");
      }
      return;
    }
    
    if (type === 'cedula') {
      setShowCedulaModal(true);
    } else {
      setShowCredencialModal(true);
    }
  };

  const deleteExistingFile = async (type) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar la ${type === 'cedula' ? 'cédula' : 'credencial'} actual?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      try {
        await axios.delete(`${BACK_URL}/api/delete-document/${user?.id}/${type}`);
        if (type === 'cedula') {
          setExistingCedulaFile("");
          setCedulaFileExists(true);
          setProfileData(prev => ({ ...prev, cedulaArchivo: "" }));
        } else {
          setExistingCredencialFile("");
          setCredencialFileExists(true);
          setProfileData(prev => ({ ...prev, credencialArchivo: "" }));
        }
        Swal.fire('Eliminado', 'El archivo ha sido eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error deleting file:', error);
        Swal.fire('Error', 'No se pudo eliminar el archivo', 'error');
      }
    }
  };

  const handleProfileSave = async () => {
  try {
    setError("");
    setVerifyingFiles(true);

    if (!personaCompleteData) {
      throw new Error('No se pudieron cargar los datos completos de la persona');
    }

    // 1. SUBIDA DE ARCHIVOS (si hay archivo nuevo)
    let fotoCedulaPath = personaCompleteData.FOT_CED;
    if (cedulaFile) {
      // Aquí deberías tener un endpoint para subir archivos, ej: /api/upload
      // Esto es solo un ejemplo, ajusta según tu backend de subida:
      const cedulaForm = new FormData();
      cedulaForm.append('file', cedulaFile);
      const cedulaUpload = await axios.post(`${BACK_URL}/api/upload`, cedulaForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fotoCedulaPath = cedulaUpload.data.path; // ajusta según la respuesta de tu backend
    }

    // 2. PUT PERSONA (solo JSON, con path del archivo)
    const personaPayload = {
      CED_PER: profileData.numeroCedula || personaCompleteData.CED_PER,
      NOM_PER: profileData.nombres || personaCompleteData.NOM_PER,
      APE_PER: profileData.apellidos || personaCompleteData.APE_PER,
      TEL_PER: profileData.telefono || personaCompleteData.TEL_PER,
      COR_PER: profileData.email || personaCompleteData.COR_PER,
      CON_PER: profileData.contra || personaCompleteData.CON_PER,
      FOT_PER: personaCompleteData.FOT_PER,
      EST_PER: personaCompleteData.EST_PER || 'PENDIENTE',
      FOT_CED: fotoCedulaPath || null
    };

    const personasResponse = await axios.put(
      `${BACK_URL}/api/personas/${user?.id}`,
      personaPayload
    );

    // 3. PUT ESTUDIANTE (si corresponde, solo para credencial)
    if (isStudent && studentCompleteData) {
      let credencialPath = studentCompleteData.FOT_INS;
      if (credencialFile) {
        // Subir archivo de credencial
        const credencialForm = new FormData();
        credencialForm.append('file', credencialFile);
        const credencialUpload = await axios.post(`${BACK_URL}/api/upload`, credencialForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        credencialPath = credencialUpload.data.path; // ajusta según la respuesta de tu backend
      }

      const estudiantePayload = {
        ID_EST: studentCompleteData.ID_EST,
        CED_EST: studentCompleteData.CED_EST || user?.id,
        ID_NIV: studentCompleteData.ID_NIV,
        FOT_INS: credencialPath || null,
        ESTADO: studentCompleteData.ESTADO
      };

      await axios.put(
        `${BACK_URL}/api/estudiantes/cedula/${user?.id}`,
        estudiantePayload
      );
    }

    Swal.fire({
      title: "Perfil actualizado con éxito",
      icon: "success",
      draggable: true,
    });

    setEditingProfile(false);
    clearFiles();

    // Actualizar URLs de archivos localmente
    if (fotoCedulaPath) {
      setExistingCedulaFile(`${BACK_URL}/${fotoCedulaPath.replace(/\\/g, "/")}`);
      setCedulaFileExists(true);
    }
    if (isStudent && credencialFile && studentCompleteData) {
      setExistingCredencialFile(`${BACK_URL}/${studentCompleteData.FOT_INS.replace(/\\/g, "/")}`);
      setCredencialFileExists(true);
    }

    setPersonaCompleteData(personasResponse.data);
    await refreshUser();
  } catch (error) {
    console.error('Error saving profile:', error);
    Swal.fire({
      title: "Error",
      text: error.message || "Ocurrió un error al actualizar el perfil.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    setVerifyingFiles(false);
  }
};

  const handleCancelEdit = () => {
    setEditingProfile(false);
    clearFiles();
  };

  if (loadingData) {
    return (
      <div className="perfil-page-full">
        <div className="perfil-card">
          <div className="loading-container">
            <p>Cargando datos del perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page-full">
      <div className="perfil-card">
        <button
          className="perfil-back-btn"
          onClick={() => navigate("/Estudiante")}
        >
          <FaChevronLeft size={22} style={{ marginRight: 6 }} />
          Regresar
        </button>

        <h2 className="perfil-title">Configuración del Perfil</h2>

        {verifyingFiles && (
          <div className="verification-notice">
            <p>Verificando archivos... Por favor espera.</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="perfil-avatar-section">
          <div className="perfil-avatar-wrapper">
            {profileData.foto ? (
              <img src={profileData.foto} alt="Perfil" className="perfil-avatar-img" />
            ) : (
              <div className="perfil-avatar-placeholder">
                <FaUser size={60} color="#cfd8dc" />
              </div>
            )}
          </div>
        </div>

        <div className="perfil-header">
          {!editingProfile ? (
            <button onClick={() => setEditingProfile(true)} className="perfil-editar-btn">
              <FaPen style={{ marginRight: 6 }} /> Editar
            </button>
          ) : (
            <div className="perfil-edit-actions">
              <button onClick={handleProfileSave} className="perfil-guardar-btn">
                <FaSave style={{ marginRight: 6 }} /> Guardar
              </button>
              <button onClick={handleCancelEdit} className="perfil-cancelar-btn">
                <FaTimes style={{ marginRight: 6 }} /> Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="perfil-info-section">
          {/* Información Personal */}
          <div className="perfil-section">
            <h3 className="perfil-section-title">
              <FaUser className="perfil-section-icon" />
              Información Personal
            </h3>
            <div className="perfil-info-grid">
              <div className="perfil-field">
                <label className="perfil-label">
                  <FaUser className="perfil-icon" /> Nombres
                </label>
                {editingProfile ? (
                  <input
                    type="text"
                    value={profileData.nombres}
                    onChange={(e) => setProfileData({ ...profileData, nombres: e.target.value })}
                    className="perfil-input"
                    required
                  />
                ) : (
                  <p className="perfil-info-value">{profileData.nombres || "No especificado"}</p>
                )}
              </div>
              <div className="perfil-field">
                <label className="perfil-label">
                  <FaUser className="perfil-icon" /> Apellidos
                </label>
                {editingProfile ? (
                  <input
                    type="text"
                    value={profileData.apellidos}
                    onChange={(e) => setProfileData({ ...profileData, apellidos: e.target.value })}
                    className="perfil-input"
                    required
                  />
                ) : (
                  <p className="perfil-info-value">{profileData.apellidos || "No especificado"}</p>
                )}
              </div>
              <div className="perfil-field">
                <label className="perfil-label">
                  <FaEnvelope className="perfil-icon" /> Email
                </label>
                <p className="perfil-info-value">{profileData.email || "No especificado"}</p>
              </div>
              <div className="perfil-field">
                <label className="perfil-label">
                  <FaPhone className="perfil-icon" /> Teléfono
                </label>
                {editingProfile ? (
                  <input
                    type="tel"
                    value={profileData.telefono}
                    onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                    className="perfil-input"
                  />
                ) : (
                  <p className="perfil-info-value">{profileData.telefono || "No especificado"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Identificación */}
          <div className="perfil-section">
            <h3 className="perfil-section-title">
              <FaIdCard className="perfil-section-icon" />
              Información de Identificación
            </h3>
            <div className="perfil-info-grid">
              <div className="perfil-field">
                <label className="perfil-label">
                  <FaIdCard className="perfil-icon" /> Número de Cédula
                </label>
                <p className="perfil-info-value">{profileData.numeroCedula || "No especificado"}</p>
              </div>
            </div>

            {/* Archivo de cédula */}
            {existingCedulaFile && !editingProfile && (
              <div className="perfil-file-section">
                <h4 className="file-section-title">Documento de Cédula</h4>
                <ExistingFileDisplay
                  fileUrl={existingCedulaFile}
                  type="cedula"
                  onView={viewExistingFile}
                  onDelete={deleteExistingFile}
                  onEdit={() => setEditingProfile(true)}
                  fileExists={cedulaFileExists}
                />
              </div>
            )}

            {editingProfile && (
              <div className="perfil-file-upload">
                <label className="perfil-label">
                  <FaFilePdf className="perfil-icon" /> 
                  {existingCedulaFile ? "Cambiar foto de Cédula" : "Foto de Cédula (PDF o Imagen)"}
                </label>
                {existingCedulaFile && (
                  <ExistingFileDisplay
                    fileUrl={existingCedulaFile}
                    type="cedula"
                    onView={viewExistingFile}
                    onDelete={deleteExistingFile}
                    onEdit={() => {}}
                    fileExists={cedulaFileExists}
                  />
                )}
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e.target.files[0], 'cedula')}
                    className="perfil-file-input"
                    id="cedula-upload"
                  />
                  <label htmlFor="cedula-upload" className="file-upload-label">
                    <FaUpload style={{ marginRight: 8 }} />
                    {cedulaFile ? cedulaFile.name : existingCedulaFile ? "Seleccionar nuevo archivo" : "Seleccionar archivo"}
                  </label>
                </div>
                {cedulaPreview && (
                  <div className="file-preview">
                    <img src={cedulaPreview} alt="Preview cédula" className="preview-image" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Información Académica - Solo para estudiantes */}
          {isStudent && (
            <div className="perfil-section">
              <h3 className="perfil-section-title">
                <FaGraduationCap className="perfil-section-icon" />
                Información Académica
              </h3>
              <div className="perfil-info-grid">
                <div className="perfil-field">
                  <label className="perfil-label">
                    <FaGraduationCap className="perfil-icon" /> Carrera
                  </label>
                  <p className="perfil-info-value">{profileData.carrera || "No especificado"}</p>
                </div>
                <div className="perfil-field">
                  <label className="perfil-label">
                    <FaGraduationCap className="perfil-icon" /> Nivel
                  </label>
                  <p className="perfil-info-value">{profileData.nivel || "No especificado"}</p>
                </div>
              </div>

              {/* Archivo de credencial estudiantil */}
              {existingCredencialFile && !editingProfile && (
                <div className="perfil-file-section">
                  <h4 className="file-section-title">Credencial Estudiantil</h4>
                  <ExistingFileDisplay
                    fileUrl={existingCredencialFile}
                    type="credencial"
                    onView={viewExistingFile}
                    onDelete={deleteExistingFile}
                    onEdit={() => setEditingProfile(true)}
                    fileExists={credencialFileExists}
                  />
                </div>
              )}

              {editingProfile && (
                <div className="perfil-file-upload">
                  <label className="perfil-label">
                    <FaFileImage className="perfil-icon" /> 
                    {existingCredencialFile ? "Cambiar foto de Credencial" : "Foto de Credencial Estudiantil"}
                  </label>
                  {existingCredencialFile && (
                    <ExistingFileDisplay
                      fileUrl={existingCredencialFile}
                      type="credencial"
                      onView={viewExistingFile}
                      onDelete={deleteExistingFile}
                      onEdit={() => {}}
                      fileExists={credencialFileExists}
                    />
                  )}
                  <div className="file-upload-container">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e.target.files[0], 'credencial')}
                      className="perfil-file-input"
                      id="credencial-upload"
                    />
                    <label htmlFor="credencial-upload" className="file-upload-label">
                      <FaUpload style={{ marginRight: 8 }} />
                      {credencialFile ? credencialFile.name : existingCredencialFile ? "Seleccionar nuevo archivo" : "Seleccionar archivo"}
                    </label>
                  </div>
                  {credencialPreview && (
                    <div className="file-preview">
                      <img src={credencialPreview} alt="Preview credencial" className="preview-image" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modales para ver archivos */}
      <FileModal
        show={showCedulaModal}
        onClose={() => setShowCedulaModal(false)}
        fileUrl={existingCedulaFile}
        title="Cédula de Identidad"
      />
      <FileModal
        show={showCredencialModal}
        onClose={() => setShowCredencialModal(false)}
        fileUrl={existingCredencialFile}
        title="Credencial Estudiantil"
      />
    </div>
  );
};

export default Configuracion_Est;