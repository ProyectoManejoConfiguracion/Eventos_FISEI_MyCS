import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import "../../Styles/Notas.css";

const Cursos = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:3000/api/detalle_informe/1012345678`)
        .then((response) => setEventos(response.data))
        .catch((error) =>
          console.error("Error al obtener asistencias:", error)
        );
    }
  }, [user]);

  const handleAsignarAsistencia = async (cedula, idEvento) => {
    try {
      const fecha = new Date().toISOString().split("T")[0];
      await axios.post("http://localhost:3000/api/detalle_informe/asistencia", {
        cedula,
        idEvento,
        fecha,
      });

      setEventos((prevEventos) =>
        prevEventos.map((evento) => {
          if (evento.ID_EVT === idEvento) {
            return {
              ...evento,
              Personas: evento.Personas.map((persona) => {
                if (persona.CED_PER === cedula) {
                  return {
                    ...persona,
                    REG_ASI: fecha,
                  };
                }
                return persona;
              }),
            };
          }
          return evento;
        })
      );

      alert("Asistencia asignada correctamente");
    } catch (error) {
      console.error("Error al asignar asistencia:", error);
      alert("Error al asignar asistencia");
    }
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
                <table className="tabla-notas">
                  <thead>
                    <tr>
                      <th>Cédula</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Asistencia</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evento.Personas.length > 0 ? (
                      evento.Personas.map((persona) => (
                        <tr key={persona.CED_PER}>
                          <td>{persona.CED_PER}</td>
                          <td>{persona.NOM_PER}</td>
                          <td>{persona.APE_PER}</td>
                          <td>
                            {persona.REG_ASI
                              ? persona.REG_ASI
                              : "No registrada"}
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleAsignarAsistencia(
                                  persona.CED_PER,
                                  evento.ID_EVT
                                )
                              }
                              className="btn-guardar"
                            >
                              Asignar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
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
