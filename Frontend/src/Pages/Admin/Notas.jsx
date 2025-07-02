import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import { BACK_URL } from '../../../config';
import '../../Styles/Notas.css';
import Swal from "sweetalert2";

const Notas = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (user?.id) {
      axios.get(`${BACK_URL}/api/informes/${user.id}`)
        .then(response => setEventos(response.data))
        .catch(error => console.error('Error al obtener eventos:', error));
    }
  }, [user]);

  const handleNotaChange = (personaIndex, value) => {
    const nuevosEventos = [...eventos];
    nuevosEventos[eventoSeleccionado].Personas[personaIndex].NOT_INF = value;
    setEventos(nuevosEventos);
  };

  const handleGuardarNota = async (cedula, nota) => {
  try {
  
    Swal.fire({
      title: 'Guardando nota...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    await axios.post(`${BACK_URL}/api/informes/nota`, {
      CED_PER: cedula,
      NOT_INF: nota
    });

    // Mostrar éxito
    await Swal.fire({
      title: '¡Éxito!',
      text: 'La nota se ha guardado correctamente',
      icon: 'success',
      confirmButtonColor: '#581517',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    
  } catch (error) {
    console.error('Error al guardar nota:', error);
    
    // Mostrar error
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo guardar la nota. Por favor intente nuevamente',
      icon: 'error',
      confirmButtonColor: '#581517'
    });
  }
};

  const eventosFiltrados = eventos.filter(evento => 
    evento.NOM_EVT.toLowerCase().includes(busqueda.toLowerCase())
  );

  const calcularProgreso = (evento) => {
    const total = evento.Personas.length;
    const calificados = evento.Personas.filter(p => p.NOT_INF > 0).length;
    return `${calificados}/${total}`;
  };

  return (
    <div className="notas-container">
      <div className="notas-header">
        <h1>Gestión de Notas</h1>
        
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {eventoSeleccionado === null ? (
        <div className="eventos-lista">
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((evento, idx) => (
              <div 
                key={evento.ID_EVT} 
                className="evento-card"
                onClick={() => setEventoSeleccionado(idx)}
              >
                <div className="evento-info">
                  <h2>{evento.NOM_EVT}</h2>
                  <p className="evento-tipo">{evento.CAT_DET}</p>
                  <p className="evento-estudiantes">{evento.Personas.length} estudiantes</p>
                </div>
                <div className="evento-progreso">
                  <span>{calcularProgreso(evento)} calificados</span>
                </div>
              </div>
            ))
          ) : (
            <p className="sin-eventos">No tienes eventos asignados</p>
          )}
        </div>
      ) : (
        <div className="detalle-evento">
          <div className="detalle-header">
            <button 
              className="btn-volver"
              onClick={() => setEventoSeleccionado(null)}
            >
              ← Volver
            </button>
            <h2>{eventos[eventoSeleccionado].NOM_EVT}</h2>
            <p className="evento-tipo">{eventos[eventoSeleccionado].CAT_DET}</p>
            <p className="evento-estudiantes">{eventos[eventoSeleccionado].Personas.length} estudiantes</p>
          </div>

          <div className="estudiantes-lista">
            {eventos[eventoSeleccionado].Personas.length > 0 ? (
              eventos[eventoSeleccionado].Personas.map((persona, i) => (
                <div key={persona.CED_PER} className="estudiante-card">
                  <div className="estudiante-info">
                    <h3>{persona.NOM_PER} {persona.APE_PER}</h3>
                    <p className="estudiante-cedula">Cédula: {persona.CED_PER}</p>
                  </div>
                  
                  <div className="nota-container">
                    <div className="nota-input">
                      <label>Calificación</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={persona.NOT_INF || ''}
                        onChange={(e) => handleNotaChange(i, e.target.value)}
                      />
                    </div>
                    
                    <div className="nota-actual">
                      <label>Actual</label>
                      <span>{persona.NOT_INF || '0.00'}</span>
                    </div>
                    
                    <button
                      onClick={() => handleGuardarNota(persona.CED_PER, persona.NOT_INF)}
                      className="btn-guardar"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="sin-estudiantes">No hay estudiantes registrados</p>
            )}
          </div>
          
          <div className="progreso-footer">
            <span>{calcularProgreso(eventos[eventoSeleccionado])} calificados</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notas;