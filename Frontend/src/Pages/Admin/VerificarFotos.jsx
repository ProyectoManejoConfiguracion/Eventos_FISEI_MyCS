import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACK_URL } from '../../../config';
import { FaCheckCircle, FaEye } from "react-icons/fa";
import Swal from 'sweetalert2';
import '../../Styles/VerificarFotos.css';

const getFullUrl = (file) => file ? `${BACK_URL}/${file.replace(/\\/g, "/")}` : null;

const VerificarFotos = () => {
  const [personas, setPersonas] = useState([]);
  const [autoridades, setAutoridades] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPersonas(),
      fetchAutoridades(),
      fetchEstudiantes()
    ]);
    setLoading(false);
  };

  const fetchPersonas = async () => {
    try {
      const res = await axios.get(`${BACK_URL}/api/personas/personas/no-verificadas`);
      setPersonas(res.data.filter(p => p.FOT_CED && p.FOT_CED !== ''));
    } catch (e) {}
  };

  const fetchAutoridades = async () => {
    try {
      const res = await axios.get(`${BACK_URL}/api/personas/autoridades/no-verificadas`);
      setAutoridades(res.data);
    } catch (e) {}
  };

  const fetchEstudiantes = async () => {
    try {
      const res = await axios.get(`${BACK_URL}/api/personas/estudiantes/no-verificados`);
      setEstudiantes(res.data.filter(e => e.FOT_INS && e.FOT_INS !== ''));
    } catch (e) {}
  };

  const handleVerPersona = async (cedula) => {
    try {
      const res = await axios.get(`${BACK_URL}/api/personas/${cedula}`);
      Swal.fire({
        title: `${res.data.NOM_PER} ${res.data.APE_PER}`,
        html: `
          <b>Cédula:</b> ${res.data.CED_PER}<br/>
          <b>Correo:</b> ${res.data.COR_PER}<br/>
          <b>Teléfono:</b> ${res.data.TEL_PER}<br/>
        `,
        imageUrl: getFullUrl(res.data.FOT_PER),
        imageAlt: 'Foto de perfil',
        imageHeight: 200,
      });
    } catch (e) {
      Swal.fire("Error", "No se pudo cargar la persona", "error");
    }
  };

  const handleVerEstudiante = async (cedula) => {
    try {
      const res = await axios.get(`${BACK_URL}/api/personas/${cedula}`);
      Swal.fire({
        title: `${res.data.NOM_PER} ${res.data.APE_PER}`,
        html: `
          <b>Cédula:</b> ${res.data.CED_PER}<br/>
          <b>Correo:</b> ${res.data.COR_PER}<br/>
          <b>Teléfono:</b> ${res.data.TEL_PER}<br/>
        `,
        imageUrl: getFullUrl(res.data.FOT_PER),
        imageAlt: 'Foto de perfil',
        imageHeight: 200,
      });
    } catch (e) {
      Swal.fire("Error", "No se pudo cargar el estudiante", "error");
    }
  };

  const handleVerAutoridad = async (cedula) => {
    try {
      const res = await axios.get(`${BACK_URL}/api/personas/${cedula}`);
      Swal.fire({
        title: `${res.data.NOM_PER} ${res.data.APE_PER}`,
        html: `
          <b>Cédula:</b> ${res.data.CED_PER}<br/>
          <b>Correo:</b> ${res.data.COR_PER}<br/>
          <b>Teléfono:</b> ${res.data.TEL_PER}<br/>
        `,
        imageUrl: getFullUrl(res.data.FOT_PER),
        imageAlt: 'Foto de perfil',
        imageHeight: 200,
      });
    } catch (e) {
      Swal.fire("Error", "No se pudo cargar la autoridad", "error");
    }
  };

const validarPersona = async (cedula) => {
  const ok = await Swal.fire({
    title: "¿Validar persona?",
    text: "¿Está seguro de validar la foto de esta persona?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, validar",
    cancelButtonText: "Cancelar"
  });
  if (!ok.isConfirmed) return;

  try {
    await axios.put(`${BACK_URL}/api/personas/estado/${cedula}`, { estado: "VERIFICADO" });
    setPersonas(prev => prev.filter(p => p.CED_PER !== cedula));
    Swal.fire("¡Validado!", "La persona ha sido verificada.", "success");
  } catch (e) {
    Swal.fire("Error", "No se pudo validar la persona.", "error");
  }
};

const validarEstudiante = async (cedula) => {
  const ok = await Swal.fire({
    title: "¿Validar estudiante?",
    text: "¿Está seguro de validar la foto del estudiante?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, validar",
    cancelButtonText: "Cancelar"
  });
  if (!ok.isConfirmed) return;

  try {
    await axios.put(`${BACK_URL}/api/personas/estudiantes/estado/${cedula}`, { estado: "VERIFICADO" });
    setEstudiantes(prev => prev.filter(e => e.CED_EST !== cedula));
    Swal.fire("¡Validado!", "El estudiante ha sido verificado.", "success");
  } catch (e) {
    Swal.fire("Error", "No se pudo validar el estudiante.", "error");
  }
};

const validarAutoridad = async (cedula, id_aut) => {
  const ok = await Swal.fire({
    title: "¿Validar autoridad?",
    text: "¿Está seguro de validar la foto de la autoridad?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, validar",
    cancelButtonText: "Cancelar"
  });
  if (!ok.isConfirmed) return;

  try {
    await axios.put(`${BACK_URL}/api/personas/autoridades/estado/${cedula}`, { estado: "VERIFICADO" });
    setAutoridades(prev => prev.filter(a => a.CED_PER !== cedula));
    Swal.fire("¡Validado!", "La autoridad ha sido verificada.", "success");
  } catch (e) {
    Swal.fire("Error", "No se pudo validar la autoridad.", "error");
  }
};

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="verificar-fotos-container">
      <h2>Verificar Fotos</h2>
      {/* PERSONAS */}
      <h3 className="verificar-titulo">Personas</h3>
      <div className="verificar-grid">
        {personas.length === 0 && <span>No hay personas por verificar.</span>}
        {personas.map(p => (
          <div key={p.CED_PER} className="verificar-card">
            <b>{p.NOM_PER} {p.APE_PER}</b>
            <div><b>Cédula:</b> {p.CED_PER}</div>
            <div><b>Correo:</b> {p.COR_PER}</div>
            <div className="verificar-imgs">
              <img src={getFullUrl(p.FOT_PER)} alt="Perfil" className="verif-img"/>
              <div className="verif-label">Perfil</div>
              <img src={getFullUrl(p.FOT_CED)} alt="Cédula" className="verif-img"/>
              <div className="verif-label">Cédula</div>
            </div>
            <div className="verificar-btns">
              <button title="Ver más" onClick={() => handleVerPersona(p.CED_PER)} className="verif-btn"><FaEye/></button>
              <button title="Validar" onClick={() => validarPersona(p.CED_PER)} className="verif-btn-validar"><FaCheckCircle/> Validar</button>
            </div>
          </div>
        ))}
      </div>
      {/* AUTORIDADES */}
      <h3 className="verificar-titulo">Autoridades</h3>
      <div className="verificar-grid">
        {autoridades.length === 0 && <span>No hay autoridades por verificar.</span>}
        {autoridades.map(a => (
          <AutoridadCard key={a.ID_AUT} autoridad={a} handleVerAutoridad={handleVerAutoridad} validarAutoridad={validarAutoridad}/>
        ))}
      </div>
      {/* ESTUDIANTES */}
      <h3 className="verificar-titulo">Estudiantes</h3>
      <div className="verificar-grid">
        {estudiantes.length === 0 && <span>No hay estudiantes por verificar.</span>}
        {estudiantes.map(e => (
          <div key={e.ID_EST} className="verificar-card">
            <b>{e.ID_EST}</b>
            <div><b>Cédula:</b> {e.CED_EST}</div>
            <div><b>Nivel:</b> {e.ID_NIV}</div>
            <div className="verificar-imgs">
              <img src={getFullUrl(e.FOT_INS)} alt="Inscripción" className="verif-img"/>
              <div className="verif-label">Foto Inscripción</div>
            </div>
            <div className="verificar-btns">
              <button title="Ver más" onClick={() => handleVerEstudiante(e.CED_EST)} className="verif-btn"><FaEye/></button>
              <button title="Validar" onClick={() => validarEstudiante(e.CED_EST)} className="verif-btn-validar"><FaCheckCircle/> Validar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AutoridadCard = ({ autoridad, handleVerAutoridad, validarAutoridad }) => {
  const [foto, setFoto] = useState(null);
  useEffect(() => {
    let mounted = true;
    axios.get(`${BACK_URL}/api/personas/${autoridad.CED_PER}`)
      .then(res => {
        if (mounted) setFoto(res.data.FOT_PER || null);
      });
    return () => { mounted = false; };
  }, [autoridad.CED_PER]);
  return (
    <div className="verificar-card">
      <b>{autoridad.ID_AUT}</b>
      <div><b>Cédula:</b> {autoridad.CED_PER}</div>
      <div><b>Cargo:</b> {autoridad.CAR_AUT}</div>
      <div><b>Facultad:</b> {autoridad.ID_FAC}</div>
      <div className="verificar-imgs">
        {foto && <img src={getFullUrl(foto)} alt="Perfil" className="verif-img"/>}
        <div className="verif-label">Perfil</div>
      </div>
      <div className="verificar-btns">
        <button title="Ver más" onClick={() => handleVerAutoridad(autoridad.CED_PER)} className="verif-btn"><FaEye/></button>
        <button title="Validar" onClick={() => validarAutoridad(autoridad.CED_PER, autoridad.CED_PER)} className="verif-btn-validar"><FaCheckCircle/> Validar</button>
      </div>
    </div>
  );
};

export default VerificarFotos;