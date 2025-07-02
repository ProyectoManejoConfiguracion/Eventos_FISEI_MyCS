import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import "../../Styles/Asistencia_Adm.css";
import { BACK_URL } from "../../../config"; 
import Swal from "sweetalert2";

const Cursos = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [semanaActual, setSemanaActual] = useState([]);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(0);

  // Obtener los días de la semana actual y semanas adyacentes
  useEffect(() => {
    const calcularSemana = (offset = 0) => {
      const hoy = new Date();
      const diaSemana = hoy.getDay(); // 0=Domingo, 1=Lunes, etc.
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1) + (offset * 7));
      
      const diasSemana = [];
      for (let i = 0; i < 5; i++) {
        const dia = new Date(lunes);
        dia.setDate(lunes.getDate() + i);
        diasSemana.push(dia.toISOString().split('T')[0]);
      }
      return diasSemana;
    };

    setSemanaActual(calcularSemana(semanaSeleccionada));
  }, [semanaSeleccionada]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`${BACK_URL}/api/detalle_informe/${user.id}`)
        .then((response) => setEventos(response.data))
        .catch((error) =>
          console.error("Error al obtener asistencias:", error)
        );
    }
  }, [user]);

  const manejarAsistencia = async (cedula, idEvento, fecha, asistio) => {
    try {
      if (asistio) {
        // Eliminar asistencia
        await axios.delete(`${BACK_URL}/api/detalle_informe/asistencia`, {
          data: { cedula, idEvento, fecha }
        });
      } else {
        // Agregar asistencia
        await axios.post(`${BACK_URL}/api/detalle_informe/asistencia`, {
          cedula, idEvento, fecha
        });
      }

      setEventos(prevEventos =>
        prevEventos.map(evento => {
          if (evento.ID_EVT === idEvento) {
            return {
              ...evento,
              Personas: evento.Personas.map(persona => {
                if (persona.CED_PER === cedula) {
                  let nuevasAsistencias = persona.REG_ASI ? [...persona.REG_ASI] : [];
                  
                  if (asistio) {
                    // Remover la fecha si ya estaba presente
                    nuevasAsistencias = nuevasAsistencias.filter(d => d !== fecha);
                  } else {
                    // Agregar la fecha si no estaba presente
                    if (!nuevasAsistencias.includes(fecha)) {
                      nuevasAsistencias.push(fecha);
                    }
                  }
                  
                  return {
                    ...persona,
                    REG_ASI: nuevasAsistencias
                  };
                }
                return persona;
              })
            };
          }
          return evento;
        })
      );
       await Swal.fire({
      title: '¡Asistencia registrada!',
      text: 'La asistencia se ha registrado correctamente',
      icon: 'success',
      confirmButtonColor: '#581517',
      timer: 2000,
      timerProgressBar: true
    });

<<<<<<< HEAD
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
=======
  } catch (error) {
    console.error("Error al asignar asistencia:", error);
    
    // Mostrar error
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo registrar la asistencia',
      icon: 'error',
      confirmButtonColor: '#581517'
    });
  }
};
>>>>>>> fd4617e0641c3bc33249271bf6ceda8c31ae1ada

  const verificarAsistencia = (asistencias, fecha) => {
    if (!asistencias) return false;
    return asistencias.includes(fecha);
  };

  const cambiarSemana = (direccion) => {
    setSemanaSeleccionada(prev => prev + direccion);
  };

  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}`;
  };

  return (
    <div className="notas-container">
      <h1>Asistencia a Cursos</h1>

      {eventos.length > 0 ? (
        eventos.map((evento, idx) => (
          <div key={evento.ID_EVT} className="acordeon-evento">
            <button
              className="acordeon-header"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              {evento.NOM_EVT} ({evento.CAT_DET})
            </button>

            {expanded === idx && (
              <div className="acordeon-content">
                <div className="controles-semana">
                  <button 
                    onClick={() => cambiarSemana(-1)} 
                    className="btn-semana"
                  >
                    &lt; Semana anterior
                  </button>
                  <span className="rango-semana">
                    Semana del {formatearFecha(semanaActual[0])} al {formatearFecha(semanaActual[4])}
                  </span>
                  <button 
                    onClick={() => cambiarSemana(1)} 
                    className="btn-semana"
                  >
                    Semana siguiente &gt;
                  </button>
                </div>
                
                <table className="tabla-asistencia">
                  <thead>
                    <tr>
                      <th>Cédula</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      {semanaActual.map((fecha, i) => (
                        <th key={fecha}>
                          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'][i]}
                          <br/>{formatearFecha(fecha)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {evento.Personas.length > 0 ? (
                      evento.Personas.map((persona) => (
                        <tr key={persona.CED_PER}>
                          <td>{persona.CED_PER}</td>
                          <td>{persona.NOM_PER}</td>
                          <td>{persona.APE_PER}</td>
                          {semanaActual.map((fecha) => {
                            const asistio = verificarAsistencia(persona.REG_ASI, fecha);
                            return (
                              <td 
                                key={fecha} 
                                className={`celda-asistencia ${asistio ? 'asistio' : 'no-asistio'}`}
                                onClick={() => manejarAsistencia(
                                  persona.CED_PER, 
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
                          colSpan={3 + semanaActual.length}
                          className="text-center py-2 text-gray-500"
                        >
                          No hay personas registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="sin-eventos">No tienes eventos asignados</p>
      )}
    </div>
  );
};

export default Cursos;