import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalAutoridad from "../../Components/modals/RegisterAutoridad";
import EditAutoridad from "../../Components/modals/EditAutoridad"; 
import "../../Styles/Usuarios.css";
import { FaPlus } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { BACK_URL } from "../../../config"; 
import Swal from "sweetalert2";

const Usuarios = () => {
  const [autoridades, setAutoridades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [autoridadSeleccionada, setAutoridadSeleccionada] = useState(null);

  useEffect(() => {
    obtenerAutoridades();
  }, []);

  const obtenerAutoridades = async () => {
    try {
      const res = await axios.get(`${BACK_URL}/api/autoridades`);
      setAutoridades(res.data);
    } catch (error) {
      console.error("Error al obtener autoridades:", error);
    }
  };

  const eliminarAutoridad = async (id) => {
  try {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente la autoridad.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#581517", // color vino
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await axios.delete(`${BACK_URL}/api/autoridades/${id}`);
      await Swal.fire({
        title: "Eliminado",
        text: "La autoridad ha sido eliminada exitosamente.",
        icon: "success",
        confirmButtonColor: "#581517"
      });
      obtenerAutoridades(); // recargar datos
    }
  } catch (error) {
    console.error("Error al eliminar autoridad:", error);
    await Swal.fire({
      title: "Error",
      text: "Hubo un problema al eliminar la autoridad.",
      icon: "error",
      confirmButtonColor: "#581517"
    });
  }
};

  {/*const eliminarAutoridad = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta autoridad?"
    );
    if (!confirmar) return;

    try {
      await axios.delete(`${BACK_URL}/api/autoridades/${id}`);
      obtenerAutoridades(); 
    } catch (error) {
      console.error("Error al eliminar autoridad:", error);
    }
  };*/}

  const abrirModalEdicion = (autoridad) => {
    setAutoridadSeleccionada(autoridad);
    setIsEditModalOpen(true);
  };

  return (
    <div className="usuarios-container">
      <h2>Gestión de Autoridades</h2>

      <div className="btn-container">
        <button className="btn_LogingR" onClick={() => setIsModalOpen(true)}>
          <FaPlus className="plus" /> Registrar nueva autoridad
        </button>
      </div>

      <table className="tabla-autoridades">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cédula</th>
            <th>Cargo</th>
            <th>Dirección</th>
            <th>Facultad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {autoridades.slice(1).map((aut) => (
            <tr className="fila-autoridad" key={aut.ID_AUT}>
              <td>{aut.ID_AUT}</td>
              <td>{aut.CED_PER}</td>
              <td>{aut.CAR_AUT}</td>
              <td>{aut.DIR_AUT}</td>
              <td>{aut.ID_FAC}</td>
              <td>
                <button
                  className="editar-btn"
                  onClick={() => abrirModalEdicion({ autoridad: aut })}
                >
                  Editar
                </button>

                <button
                  className="eliminar-btn"
                  onClick={() => eliminarAutoridad(aut.ID_AUT)}
                  title="Eliminar"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalAutoridad
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSave={obtenerAutoridades}
      />

      <EditAutoridad
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        autoridadSeleccionada={autoridadSeleccionada}
        onSave={obtenerAutoridades}
      />
    </div>
  );
};

export default Usuarios;
