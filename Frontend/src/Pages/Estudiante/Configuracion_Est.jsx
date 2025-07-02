import React, { useState, useEffect } from "react";
import {
  FaUser, FaEnvelope, FaPhone, FaPen, FaSave, FaTimes, 
  FaUpload, FaChevronLeft, FaIdCard, FaGraduationCap, FaFilePdf, FaFileImage,
  FaTrash, FaEye, FaEdit, FaExclamationTriangle, FaFileContract
} from "react-icons/fa";
import "../../Styles/Configuracion_Est.css";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { BACK_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

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

const useProfileData = () => {
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
  const [authorityCompleteData, setAuthorityCompleteData] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [isAuthority, setIsAuthority] = useState(false);
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
    if (!user?.id) {
      setLoadingData(false);
      return { cedulaUrl: "", credencialUrl: "" };
    }
    
    setLoadingData(true);
    try {
      const userRole = user?.rol || user?.role || user?.ROL_PER || "";
      const isStudentRole = ['estudiante', 'student'].includes(userRole.toLowerCase());
      const isAuthorityRole = !isStudentRole && userRole.toLowerCase() !== 'persona';
      
      setIsStudent(isStudentRole);
      setIsAuthority(isAuthorityRole);

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
      let authorityData = null;

      if (isStudentRole) {
        try {
          const carreraResponse = await fetch(`${BACK_URL}/api/carrera-conf/${user.id}`);
          if (carreraResponse.ok) {
            const carreraData = await carreraResponse.json();
            const academicInfo = Array.isArray(carreraData) ? carreraData[0] : carreraData;
            if (academicInfo) {
              carrera = academicInfo.carrera || carrera;
              nivel = normalizeLevel(academicInfo.nivel) || nivel;
            }
          }

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
      } else if (isAuthorityRole) {
        try {
          const authorityResponse = await fetch(`${BACK_URL}/api/autoridades/cedula/${user.id}`);
          if (authorityResponse.ok) {
            authorityData = await authorityResponse.json();
            setAuthorityCompleteData(authorityData);
            credencialUrl = authorityData.FOT_CON 
              ? `${BACK_URL}/${authorityData.FOT_CON.replace(/\\/g, "/")}`
              : "";
          }
        } catch (error) {
          console.error("Error fetching authority data:", error);
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
        credencialArchivo: studentData?.FOT_INS || authorityData?.FOT_CON || ""
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
    authorityCompleteData,
    setAuthorityCompleteData,
    isStudent,
    isAuthority,
    loadingData,
    loadProfileData
  };
};

const ExistingFileDisplay = ({ fileUrl, type, onView, onDelete, onEdit, fileExists }) => {
  if (!fileUrl) return null;

  const isImageFile = (filePath) => {
    if (!filePath) return false;
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => 
      filePath.toLowerCase().includes(ext)
    );
  };

  const getFileDisplayName = (type) => {
    switch(type) {
      case 'cedula': return 'Cédula';
      case 'credencial': return 'Credencial';
      case 'contrato': return 'Contrato';
      default: return type;
    }
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
          {getFileDisplayName(type)} 
          {!fileExists ? ' (Archivo no encontrado)' : ' subido'}
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
      </div>
    </div>
  );
};

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

const Configuracion_Est = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    profileData,
    setProfileData,
    personaCompleteData,
    setPersonaCompleteData,
    studentCompleteData,
    authorityCompleteData,
    isStudent,
    isAuthority,
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
  
  // Estados para controlar cambios
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Efecto para restaurar el scroll después de cargar
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Efecto principal de carga de datos
  useEffect(() => {
    const loadUserData = async () => {
      try {
        document.body.style.overflow = 'auto';
        
        const { cedulaUrl, credencialUrl } = await loadProfileData(user);
        setExistingCedulaFile(cedulaUrl);
        setExistingCredencialFile(credencialUrl);
        
        setTimeout(() => {
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
        }, 100);
      } catch (error) {
        console.error('Error loading profile data:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos del perfil.',
          icon: 'error',
          confirmButtonColor: '#581517'
        });
        
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

  // Efecto para guardar datos originales cuando se inicia la edición - CORREGIDO
  useEffect(() => {
    if (editingProfile && profileData.nombres !== undefined && profileData.nombres !== "") {
      // Solo establecer originalData si no está ya establecido
      if (Object.keys(originalData).length === 0) {
        console.log('Guardando datos originales:', {
          nombres: profileData.nombres,
          apellidos: profileData.apellidos,
          telefono: profileData.telefono
        });
        setOriginalData({
          nombres: profileData.nombres,
          apellidos: profileData.apellidos,
          telefono: profileData.telefono
        });
      }
    }
  }, [editingProfile, profileData.nombres, profileData.apellidos, profileData.telefono, originalData]);

  // Efecto para detectar cambios - CORREGIDO
  useEffect(() => {
    if (editingProfile && Object.keys(originalData).length > 0) {
      const dataChanged = 
        profileData.nombres.trim() !== originalData.nombres.trim() ||
        profileData.apellidos.trim() !== originalData.apellidos.trim() ||
        profileData.telefono.trim() !== originalData.telefono.trim();
      
      const filesChanged = cedulaFile !== null || credencialFile !== null;
      
      console.log('Detectando cambios:', {
        dataChanged,
        filesChanged,
        current: { nombres: profileData.nombres, apellidos: profileData.apellidos, telefono: profileData.telefono },
        original: originalData
      });
      
      setHasChanges(dataChanged || filesChanged);
    } else if (!editingProfile) {
      setHasChanges(false);
    }
  }, [profileData.nombres, profileData.apellidos, profileData.telefono, originalData, cedulaFile, credencialFile, editingProfile]);

  // Efecto para verificar archivos
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
        
        if ((isStudent || isAuthority) && existingCredencialFile) {
          const credencialExists = await verifyFileExists(existingCredencialFile);
          setCredencialFileExists(credencialExists);
          if (!credencialExists) {
            showFileNotFoundAlert(isStudent ? 'Credencial' : 'Contrato');
            setExistingCredencialFile("");
            setProfileData(prev => ({ ...prev, credencialArchivo: "" }));
          }
        }
      } catch (error) {
        console.error('Error verificando archivos:', error);
      } finally {
        setVerifyingFiles(false);
        
        setTimeout(() => {
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
        }, 200);
      }
    };

    if (!loadingData && (existingCedulaFile || existingCredencialFile)) {
      const timer = setTimeout(verifyFiles, 1000);
      return () => clearTimeout(timer);
    }
  }, [existingCedulaFile, existingCredencialFile, isStudent, isAuthority, loadingData]);

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
      const displayType = type === 'cedula' ? 'Cédula' : (isStudent ? 'Credencial' : 'Contrato');
      showFileNotFoundAlert(displayType);
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

  const handleProfileSave = async () => {
    if (!hasChanges) {
      Swal.fire({
        title: 'Sin cambios',
        text: 'No hay cambios para guardar.',
        icon: 'info',
        confirmButtonColor: '#581517'
      });
      return;
    }

    if (!profileData.nombres.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre es obligatorio.',
        icon: 'error',
        confirmButtonColor: '#581517'
      });
      return;
    }

    if (!profileData.apellidos.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Los apellidos son obligatorios.',
        icon: 'error',
        confirmButtonColor: '#581517'
      });
      return;
    }

    try {
      setError("");
      setVerifyingFiles(true);

      if (!personaCompleteData) {
        throw new Error('No se pudieron cargar los datos completos de la persona');
      }

      const personaFormData = new FormData();
      personaFormData.append('CED_PER', profileData.numeroCedula || personaCompleteData.CED_PER);
      personaFormData.append('NOM_PER', profileData.nombres.trim());
      personaFormData.append('APE_PER', profileData.apellidos.trim());
      personaFormData.append('TEL_PER', profileData.telefono.trim() || personaCompleteData.TEL_PER);
      personaFormData.append('COR_PER', profileData.email || personaCompleteData.COR_PER);
      personaFormData.append('FOT_PER', personaCompleteData.FOT_PER || '');
      personaFormData.append('EST_PER', personaCompleteData.EST_PER || 'PENDIENTE');
      
      if (cedulaFile) {
        personaFormData.append('FOT_CED', cedulaFile);
      }

      const personasResponse = await axios.put(
        `${BACK_URL}/api/personas/${user?.id}`,
        personaFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      // Subir archivo específico según el tipo de usuario
      if (credencialFile) {
        if (isStudent) {
          const estudianteFormData = new FormData();
          estudianteFormData.append('FOT_INS', credencialFile);
          await axios.put(
            `${BACK_URL}/api/estudiantes/upload/${user?.id}`,
            estudianteFormData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );
        } else if (isAuthority) {
          const autoridadFormData = new FormData();
          autoridadFormData.append('FOT_CON', credencialFile);
          await axios.put(
            `${BACK_URL}/api/autoridades/upload/${user?.id}`,
            autoridadFormData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );
        }
      }

      Swal.fire({
        title: "Perfil actualizado con éxito",
        icon: "success",
        confirmButtonColor: '#581517'
      });

      // Resetear estados
      setEditingProfile(false);
      setHasChanges(false);
      clearFiles();
      setOriginalData({}); // Limpiar originalData
      
      // Actualizar archivos existentes si se subieron nuevos
      if (personasResponse?.data?.FOT_CED) {
        setExistingCedulaFile(`${BACK_URL}/${personasResponse.data.FOT_CED.replace(/\\/g, "/")}`);
        setCedulaFileExists(true);
      }

      if (credencialFile) {
        if (isStudent) {
          const studentResponse = await fetch(`${BACK_URL}/api/estudiantes/cedula/${user?.id}`);
          if (studentResponse.ok) {
            const updatedStudent = await studentResponse.json();
            if (updatedStudent.FOT_INS) {
              setExistingCredencialFile(`${BACK_URL}/${updatedStudent.FOT_INS.replace(/\\/g, "/")}`);
              setCredencialFileExists(true);
            }
          }
        } else if (isAuthority) {
          const authorityResponse = await fetch(`${BACK_URL}/api/autoridades/cedula/${user?.id}`);
          if (authorityResponse.ok) {
            const updatedAuthority = await authorityResponse.json();
            if (updatedAuthority.FOT_CON) {
              setExistingCredencialFile(`${BACK_URL}/${updatedAuthority.FOT_CON.replace(/\\/g, "/")}`);
              setCredencialFileExists(true);
            }
          }
        }
      }
      
      setPersonaCompleteData(personasResponse.data);
      await refreshUser();

    } catch (error) {
      console.error('Error saving profile:', error);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || error.message || "Ocurrió un error al actualizar el perfil.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setVerifyingFiles(false);
    }
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    if (Object.keys(originalData).length > 0) {
      console.log('Restaurando datos originales:', originalData);
      setProfileData(prev => ({
        ...prev,
        nombres: originalData.nombres,
        apellidos: originalData.apellidos,
        telefono: originalData.telefono
      }));
    }
    
    setEditingProfile(false);
    setHasChanges(false);
    clearFiles();
    setOriginalData({}); // Limpiar originalData
  };

  // Obtener el título de la sección según el tipo de usuario
  const getCredentialSectionTitle = () => {
    if (isStudent) return "Información Académica";
    if (isAuthority) return "Información Laboral";
    return "Información Adicional";
  };

  // Obtener el título del archivo según el tipo de usuario
  const getCredentialFileTitle = () => {
    if (isStudent) return "Credencial Estudiantil";
    if (isAuthority) return "Contrato";
    return "Documento";
  };

  // Obtener el label del archivo según el tipo de usuario
  const getCredentialFileLabel = (existing = false) => {
    if (isStudent) {
      return existing ? "Cambiar foto de Credencial" : "Foto de Credencial Estudiantil";
    }
    if (isAuthority) {
      return existing ? "Cambiar archivo de Contrato" : "Archivo de Contrato (PDF o Imagen)";
    }
    return existing ? "Cambiar archivo" : "Archivo";
  };

  // Mostrar loading mientras se cargan los datos
  if (loadingData) {
    return (
      <div className="perfil-page-full" style={{ overflow: 'auto', height: 'auto' }}>
        <div className="perfil-card">
          <div className="loading-container">
            <p>Cargando datos del perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay user, mostrar mensaje
  if (!user) {
    return (
      <div className="perfil-page-full" style={{ overflow: 'auto', height: 'auto' }}>
        <div className="perfil-card">
          <div className="loading-container">
            <p>No se pudo cargar la información del usuario.</p>
            <button onClick={() => navigate("/")}>Ir al inicio</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page-full" style={{ overflow: 'auto', minHeight: '100vh' }}>
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
              <button 
                onClick={handleProfileSave} 
                className={`perfil-guardar-btn ${!hasChanges ? 'disabled' : ''}`}
                disabled={!hasChanges}
                title={!hasChanges ? 'No hay cambios para guardar' : 'Guardar cambios'}
              >
                <FaSave style={{ marginRight: 6 }} /> Guardar
              </button>
              <button onClick={handleCancelEdit} className="perfil-cancelar-btn">
                <FaTimes style={{ marginRight: 6 }} /> Cancelar
              </button>
            </div>
          )}
        </div>

        {editingProfile && (
          <div className="changes-indicator">
            {hasChanges ? (
              <div className="has-changes">
                <span>✓ Hay cambios sin guardar</span>
              </div>
            ) : (
              <div className="no-changes">
                <span>No hay cambios</span>
              </div>
            )}
          </div>
        )}

        <div className="perfil-info-section">
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

            {existingCedulaFile && !editingProfile && (
              <div className="perfil-file-section">
                <h4 className="file-section-title">Documento de Cédula</h4>
                <ExistingFileDisplay
                  fileUrl={existingCedulaFile}
                  type="cedula"
                  onView={viewExistingFile}
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

          {(isStudent || isAuthority) && (
            <div className="perfil-section">
              <h3 className="perfil-section-title">
                {isStudent ? (
                  <FaGraduationCap className="perfil-section-icon" />
                ) : (
                  <FaFileContract className="perfil-section-icon" />
                )}
                {getCredentialSectionTitle()}
              </h3>
              
              {isStudent && (
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
              )}

              {existingCredencialFile && !editingProfile && (
                <div className="perfil-file-section">
                  <h4 className="file-section-title">{getCredentialFileTitle()}</h4>
                  <ExistingFileDisplay
                    fileUrl={existingCredencialFile}
                    type={isStudent ? "credencial" : "contrato"}
                    onView={viewExistingFile}
                    onEdit={() => setEditingProfile(true)}
                    fileExists={credencialFileExists}
                  />
                </div>
              )}

              {editingProfile && (
                <div className="perfil-file-upload">
                  <label className="perfil-label">
                    {isStudent ? (
                      <FaFileImage className="perfil-icon" />
                    ) : (
                      <FaFileContract className="perfil-icon" />
                    )} 
                    {getCredentialFileLabel(!!existingCredencialFile)}
                  </label>
                  {existingCredencialFile && (
                    <ExistingFileDisplay
                      fileUrl={existingCredencialFile}
                      type={isStudent ? "credencial" : "contrato"}
                      onView={viewExistingFile}
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
                      <img src={credencialPreview} alt={`Preview ${isStudent ? 'credencial' : 'contrato'}`} className="preview-image" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
        title={getCredentialFileTitle()}
      />
    </div>
  );
};

export default Configuracion_Est;