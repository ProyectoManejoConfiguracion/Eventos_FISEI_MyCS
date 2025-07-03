import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import "../../Styles/Asistencia_Adm.css";
import { BACK_URL } from "../../../config"; 
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Cursos = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);

  // Cargar datos de eventos
  useEffect(() => {
    // Usar ID fijo 1801 según lo solicitado
    axios
      .get(`${BACK_URL}/api/detalle_informe/1801`)
      .then((response) => {
        setEventos(response.data);
        // Si hay eventos, inicializar fechas con el primer evento
        if (response.data.length > 0) {
          const primerEvento = response.data[0];
          if (primerEvento.FEC_EVT && primerEvento.FEC_FIN) {
            setFechaInicio(new Date(primerEvento.FEC_EVT));
            setFechaFin(new Date(primerEvento.FEC_FIN));
          }
        }
      })
      .catch((error) =>
        console.error("Error al obtener asistencias:", error)
      );
  }, []);

  // Calcular días entre fechas seleccionadas
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const dias = [];
      const fechaActual = new Date(fechaInicio);
      const fechaFinal = new Date(fechaFin);
      
      // Incluir todos los días entre fechaInicio y fechaFin (inclusive)
      while (fechaActual <= fechaFinal) {
        dias.push(fechaActual.toISOString().split('T')[0]);
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
      
      setDiasSeleccionados(dias);
    }
  }, [fechaInicio, fechaFin]);

  // Función de manejo de asistencia actualizada
const manejarAsistencia = async (persona, idEvento, fecha, asistio) => {
  try {
    if (asistio) {
      // Necesitamos encontrar el NUM_DET_INF para la fecha específica
      const detalleAEliminar = persona.DetallesInforme.find(
        detalle => detalle.REG_ASI === fecha
      );
      
      if (!detalleAEliminar) {
        throw new Error("No se encontró el detalle para eliminar");
      }
      
      // Eliminar asistencia usando NUM_DET_INF
      const response = await axios.delete(
        `${BACK_URL}/api/detalle_informe/borrar/${detalleAEliminar.NUM_DET_INF}`
      );
      
      // Verificar si la eliminación fue exitosa
      if (response.data.detalleId) {
        // Actualizar estado local
        setEventos(prevEventos =>
          prevEventos.map(evento => {
            if (evento.ID_EVT === idEvento) {
              return {
                ...evento,
                Personas: evento.Personas.map(p => {
                  if (p.CED_PER === persona.CED_PER) {
                    return {
                      ...p,
                      DetallesInforme: p.DetallesInforme.filter(
                        d => d.NUM_DET_INF !== detalleAEliminar.NUM_DET_INF
                      )
                    };
                  }
                  return p;
                })
              };
            }
            return evento;
          })
        );
      }
    } else {
      // Agregar asistencia
      const response = await axios.post(`${BACK_URL}/api/detalle_informe/asistencia`, {
        cedula: persona.CED_PER, 
        idEvento, 
        fecha
      });
      
      if (response.data.action === "created") {
        const refreshResponse = await axios.get(`${BACK_URL}/api/detalle_informe/1801`);
        setEventos(refreshResponse.data);
      }
    }

    await Swal.fire({
      title: '¡Asistencia actualizada!',
      text: `La asistencia ha sido ${asistio ? 'eliminada' : 'registrada'}`,
      icon: 'success',
      confirmButtonColor: '#581517',
      timer: 2000,
      timerProgressBar: true
    });

  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar la asistencia',
      icon: 'error',
      confirmButtonColor: '#581517'
    });
  }
};

  const verificarAsistencia = (persona, fecha) => {
    if (!persona.DetallesInforme || !persona.DetallesInforme.length) return false;
    return persona.DetallesInforme.some(detalle => detalle.REG_ASI === fecha);
  };

  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}`;
  };

  const getNombreDia = (fecha) => {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = new Date(fecha);
    return diasSemana[date.getDay()];
  };

  return (
    <div className="notas-container">
      <h1>Asistencia a Cursos</h1>

      <div className="selector-fechas">
      </div>

      {eventos.length > 0 ? (
        eventos.map((evento, idx) => (
          <div key={evento.ID_EVT} className="acordeon-evento">
            <button
              className="acordeon-header"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              {evento.NOM_EVT} ({evento.CAT_DET}) - {evento.FEC_EVT} a {evento.FEC_FIN}
            </button>

            {expanded === idx && (
              <div className="acordeon-content">
                {diasSeleccionados.length > 0 ? (
                  <div className="tabla-container">
                    <table className="tabla-asistencia">
                      <thead>
                        <tr>
                          <th>Cédula</th>
                          <th>Nombre</th>
                          <th>Apellido</th>
                          {diasSeleccionados.map((fecha) => (
                            <th key={fecha}>
                              {getNombreDia(fecha)}
                              <br/>{formatearFecha(fecha)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {evento.Personas && evento.Personas.length > 0 ? (
                          evento.Personas.map((persona) => (
                            <tr key={persona.CED_PER}>
                              <td>{persona.CED_PER}</td>
                              <td>{persona.NOM_PER}</td>
                              <td>{persona.APE_PER}</td>
                              {diasSeleccionados.map((fecha) => {
                                const asistio = verificarAsistencia(persona, fecha);
                                const esFindeSemana = new Date(fecha).getDay() === 0 || new Date(fecha).getDay() === 6;
                                return (
                                  <td 
                                    key={fecha} 
                                    className={`celda-asistencia ${asistio ? 'asistio' : 'no-asistio'} ${esFindeSemana ? 'fin-de-semana' : ''}`}
                                    onClick={() => manejarAsistencia(
                                      persona, 
                                      evento.ID_EVT, 
                                      fecha, 
                                      asistio
                                    )}
                                  >
                                    {asistio ? '✓' : 'X'}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3 + diasSeleccionados.length}
                              className="text-center py-2 text-gray-500"
                            >
                              No hay personas registradas
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="sin-fechas">
                    Seleccione un rango de fechas para mostrar la asistencia
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="sin-eventos">No hay eventos disponibles</p>
      )}
    </div>
  );
};

export default Cursos;