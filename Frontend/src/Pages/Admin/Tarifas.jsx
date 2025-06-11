import React, { useState, useEffect } from "react";
import { BsPencilFill } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import axios from "axios";
import "../../Styles/Tarifas.css";

const Tarifas = () => {
  const [eventos, setEventos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [tarifasTemp, setTarifasTemp] = useState({});

  useEffect(() => {
    axios
      .get("https://eventos-fisei-mycs.onrender.com/api/eventos/tarifas")
      .then((res) => setEventos(res.data))
      .catch((err) => console.error("Error al obtener eventos:", err));
  }, []);

  const handleEditar = (id) => {
    const evento = eventos.find((e) => e.ID_EVT === id);
    setEditando(id);
    setTarifasTemp({ ...evento.tarifas });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarifasTemp((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async (id, modalidad) => {
    const peticiones = [];

    if (tarifasTemp.Estudiante !== "") {
      peticiones.push(
        axios.post("https://eventos-fisei-mycs.onrender.com/api/eventos/asignar_tarifa", {
          ID_EVT: id,
          TIP_PAR: "ESTUDIANTE",
          VAL_EVT: tarifasTemp.Estudiante,
        })
      );
    }

    if (modalidad === "PUBLICO" && tarifasTemp.Persona !== "") {
      peticiones.push(
        axios.post("https://eventos-fisei-mycs.onrender.com/api/eventos/asignar_tarifa", {
          ID_EVT: id,
          TIP_PAR: "PERSONA",
          VAL_EVT: tarifasTemp.Persona,
        })
      );
    }

    try {
      await Promise.all(peticiones);
      const nuevosEventos = eventos.map((e) =>
        e.ID_EVT === id ? { ...e, tarifas: { ...tarifasTemp } } : e
      );
      setEventos(nuevosEventos);
      setEditando(null);
      setTarifasTemp({});
    } catch (error) {
      console.error("Error al actualizar tarifas:", error);
    }
  };

  return (
    <div className="tarifas-container">
      <h2>Tarifas por Evento</h2>
      <table className="tabla-tarifas">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Modalidad</th>
            <th>Estudiante</th>
            <th>Persona</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evt) => {
            const esEditando = editando === evt.ID_EVT;
            const tarifas = esEditando ? tarifasTemp : evt.tarifas;
            const esPublico = evt.MOD_EVT === "PUBLICO";

            return (
              <tr key={evt.ID_EVT} className="fila-evento">
                <td>{evt.NOM_EVT}</td>
                <td>{evt.MOD_EVT}</td>

                <td>
                  {esEditando ? (
                    <input
                      type="number"
                      name="Estudiante"
                      value={tarifas.Estudiante}
                      onChange={handleChange}
                    />
                  ) : (
                    tarifas.Estudiante || "-"
                  )}
                </td>

                <td>
                  {esPublico ? (
                    esEditando ? (
                      <input
                        type="number"
                        name="Persona"
                        value={tarifas.Persona}
                        onChange={handleChange}
                      />
                    ) : (
                      tarifas.Persona || "-"
                    )
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="text-center">
                  {esEditando ? (
                    <button
                      className="icono-guardar"
                      onClick={() => guardarCambios(evt.ID_EVT, evt.MOD_EVT)}
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      className="icono-editar"
                      onClick={() => handleEditar(evt.ID_EVT)}
                    >
                      <BsPencilFill />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Tarifas;
