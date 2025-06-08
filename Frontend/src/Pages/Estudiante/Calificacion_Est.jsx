import React, { useState, useEffect } from 'react';
import '../../Styles/Calificacion_Est.css';

const Calificaciones_Est = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Filtro por el estado del curso
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const fetchCalificaciones = async () => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const datosDB = [
        {
          id: 1,
          nombre: "Desarrollo Web Full Stack",
          nota: 8.5,
          fechaFinalizacion: "2024-03-15"
        },
        {
          id: 2,
          nombre: "Marketing Digital",
          nota: 9.2,
          fechaFinalizacion: "2024-02-28"
        },
        {
          id: 3,
          nombre: "Diseño UX/UI",
          nota: 7.8,
          fechaFinalizacion: null // En progreso
        },
        {
          id: 4,
          nombre: "Base de Datos Avanzadas",
          nota: 5.2,
          fechaFinalizacion: "2024-01-20"
        },
        {
          id: 5,
          nombre: "Inteligencia Artificial",
          nota: 6.8,
          fechaFinalizacion: "2024-04-10"
        },
        {
          id: 6,
          nombre: "Desarrollo Mobile",
          nota: 4.5,
          fechaFinalizacion: "2024-03-05"
        }
      ];

      // Procesar datos y determinar estado
      const cursosConEstado = datosDB.map(curso => {
        let estado, estadoColor;
        
        if (curso.fechaFinalizacion === null) {
          estado = "En progreso";
          estadoColor = "progreso";
        } else if (curso.nota >= 7.0) {
          estado = "Aprobado";
          estadoColor = "aprobado";
        } else {
          estado = "Reprobado";
          estadoColor = "reprobado";
        }

        return {
          ...curso,
          notaFormateada: `${curso.nota}/10`,
          estado,
          estadoColor
        };
      });

      setCursos(cursosConEstado);
      setError(null);
    } catch (err) {
      setError('Error al cargar las calificaciones');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchCalificaciones();
  }, []);


  const handleReload = () => {
    fetchCalificaciones();
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroEstado('todos');
  };

  // Filtrar cursos según los criterios
  const cursosFiltrados = cursos.filter(curso => {
    const coincideNombre = curso.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || curso.estadoColor === filtroEstado;
    
    return coincideNombre && coincideEstado;
  });

  const estadisticas = {
    total: cursosFiltrados.length,
    aprobados: cursosFiltrados.filter(c => c.estadoColor === 'aprobado').length,
    reprobados: cursosFiltrados.filter(c => c.estadoColor === 'reprobado').length,
    enProgreso: cursosFiltrados.filter(c => c.estadoColor === 'progreso').length,
    promedioGeneral: cursos.length > 0 ? 
      (cursos.reduce((sum, c) => sum + c.nota, 0) / cursos.length).toFixed(1) : 0
  };

  if (loading) {
    return (
      <div className="calificaciones-container">
        <div className="calificaciones-card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando calificaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calificaciones-container">
        <div className="calificaciones-card">
          <div className="error">
            <p>{error}</p>
            <button onClick={handleReload} className="reload-btn">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calificaciones-container">
      <div className="calificaciones-card">
        <div className="card-header">
          <div className="header-content">
            <h2 className="card-title">Mis Calificaciones</h2>
            <button onClick={handleReload} className="reload-btn">
              Actualizar
            </button>
          </div>
          
          {/* Filtros */}
          <div className="filtros-container">
            <div className="filtro-grupo">
              <label className="filtro-label">Buscar por nombre:</label>
              <input
                type="text"
                className="filtro-input"
                placeholder="Escribe el nombre del curso..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
            </div>
            
            <div className="filtro-grupo">
              <label className="filtro-label">Filtrar por estado:</label>
              <select
                className="filtro-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="aprobado">Aprobados</option>
                <option value="reprobado">Reprobados</option>
                <option value="progreso">En progreso</option>
              </select>
            </div>
            
            <button onClick={limpiarFiltros} className="limpiar-filtros-btn">
              Limpiar filtros
            </button>
          </div>


          {/* Estadísticas */}
          <div className="estadisticas">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{estadisticas.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Aprobados:</span>
              <span className="stat-value aprobado">{estadisticas.aprobados}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reprobados:</span>
              <span className="stat-value reprobado">{estadisticas.reprobados}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">En Progreso:</span>
              <span className="stat-value progreso">{estadisticas.enProgreso}</span>
            </div>
            
          </div>
        </div>
        
        <div className="table-container">
          {cursosFiltrados.length === 0 ? (
            <div className="no-resultados">
              <p>No se encontraron cursos que coincidan con los filtros aplicados.</p>
              <button onClick={limpiarFiltros} className="reload-btn">
                Mostrar todos los cursos
              </button>
            </div>
          ) : (
            <table className="calificaciones-table">
              <thead>
                <tr className="table-header">
                  <th className="th-curso">Curso</th>
                  <th className="th-nota">Nota</th>
                  <th className="th-estado">Estado</th>
                </tr>
              </thead>
              <tbody>
                {cursosFiltrados.map((curso) => (
                  <tr key={curso.id} className="table-row">
                    <td className="td-curso">
                      <div className="curso-info">
                        <span className="curso-nombre">{curso.nombre}</span>
                        {curso.fechaFinalizacion && (
                          <span className="curso-fecha">
                            Finalizado: {new Date(curso.fechaFinalizacion).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="td-nota">
                      <span className={`nota ${curso.estadoColor}`}>
                        {curso.notaFormateada}
                      </span>
                    </td>
                    <td className="td-estado">
                      <span className={`estado-badge ${curso.estadoColor}`}>
                        {curso.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calificaciones_Est;