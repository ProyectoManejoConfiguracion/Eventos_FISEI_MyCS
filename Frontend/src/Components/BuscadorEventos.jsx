import React, { useState } from "react";
import { Search, Filter, BookOpen, Clock, Tag, MapPin } from "lucide-react";
import "../Styles/Buscador.css";

const BuscadorEventos = ({ onFiltrar }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filtros, setFiltros] = useState({
    nombre: "",
    categoria: "",
    area: "",
    horas: "",
    tipo: "",
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    onFiltrar(filtros);
  };

  const handleLimpiar = () => {
    const valoresIniciales = {
      nombre: "",
      categoria: "",
      area: "",
      horas: "",
      tipo: "",
    };
    setFiltros(valoresIniciales);
    onFiltrar(valoresIniciales);
  };

  return (
    <form className="buscador-eventos" onSubmit={handleBuscar}>
      <div className="buscador-input-container">
        <Search className="icono-buscador" size={20} />
        <input
          type="text"
          name="nombre"
          placeholder="Buscar por nombre del evento..."
          value={filtros.nombre}
          onChange={handleChange}
          className="buscador-input"
        />
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="buscador-advanced-toggle"
        >
          <Filter size={16} />
          {showAdvanced ? "Ocultar" : "Filtros"}
        </button>
      </div>

      {showAdvanced && (
        <div className="buscador-advanced-section">
          <div className="buscador-campo">
            <Tag size={16} />
            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={filtros.categoria}
              onChange={handleChange}
            />
          </div>
          <div className="buscador-campo">
            <BookOpen size={16} />
            <input
              type="text"
              name="area"
              placeholder="Área/Carrera"
              value={filtros.area}
              onChange={handleChange}
            />
          </div>
          <div className="buscador-campo buscador-campo-horas">
            <Clock size={16} />
            <input
              type="number"
              name="horas"
              placeholder="N° Horas"
              value={filtros.horas}
              onChange={handleChange}
              min={0}
            />
          </div>
          <div className="buscador-campo">
            <MapPin size={16} />
            <input
              type="text"
              name="tipo"
              placeholder="Tipo de evento"
              value={filtros.tipo}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      <div className="buscador-actions">
        <button type="submit">Buscar</button>
        <button type="button" onClick={handleLimpiar}>
          Limpiar
        </button>
      </div>
    </form>
  );
};

export default BuscadorEventos;
