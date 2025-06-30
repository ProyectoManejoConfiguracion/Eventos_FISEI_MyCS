import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import "../../Styles/Notas.css"; 
import { BACK_URL } from '../../../config'; // Asegúrate de que la URL del backend esté configurada correctamente

const Notas = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user?.id) {
      axios.get(`${BACK_URL}/api/informes/${user.id}`)
        .then(response => setEventos(response.data))
        .catch(error => console.error('Error al obtener eventos:', error));
    }
  }, [user]);

  const handleNotaChange = (eventoIndex, personaIndex, value) => {
    const nuevosEventos = [...eventos];
    nuevosEventos[eventoIndex].Personas[personaIndex].NOT_INF = value;
    setEventos(nuevosEventos);
  };

  const handleGuardarNota = async (cedula, nota) => {
    try {
      await axios.post(`${BACK_URL}/api/informes/nota`, {
        CED_PER: cedula,
        NOT_INF: nota
      });
      alert('Nota guardada correctamente');
    } catch (error) {
      console.error('Error al guardar nota:', error);
      alert('Error al guardar nota');
    }
  };

  return (
  <div className="notas-container">
    <h1>Notas</h1>

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
                    <th>Nota</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {evento.Personas.length > 0 ? (
                    evento.Personas.map((persona, i) => (
                      <tr key={persona.CED_PER}>
                        <td>{persona.CED_PER}</td>
                        <td>{persona.NOM_PER}</td>
                        <td>{persona.APE_PER}</td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={persona.NOT_INF || ''}
                            onChange={(e) =>
                              handleNotaChange(idx, i, e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleGuardarNota(persona.CED_PER, persona.NOT_INF)
                            }
                            className="btn-guardar"
                          >
                            Guardar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-2 text-gray-500">
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

export default Notas;
