import logoSolicitud from '../assets/logo-Solicitud.png'
import '../Styles/SolicitudCambio.css';

const FormularioSolicitudCambios = () => (
  <div className="solicitud-container">
    <div className="solicitud-form">
      <table className="solicitud-table">
        <thead>
          <tr>
            <th className="logo-header" rowSpan="2">
              <div className="logo-placeholder">
                <img
                  src={logoSolicitud}
                  alt="Logo Solicitud de Cambio"
                  className="logo-solicitud"
                />
              </div>
            </th>
            <th className="title-header" rowSpan="2">SOLICITUD DE CAMBIO</th>
            <th className="number-header">NÚMERO DE SOLICITUD</th>
          </tr>
          <tr>
            <th className="number-value">
              <div className="number-cell">
                <span className="number-sign">N°</span>
                <input
                  type="text"
                  name="numeroSolicitud"
                  className="number-input"
                  placeholder="0000"
                />
              </div>
            </th>
          </tr>
          <tr>
            <td colSpan="3" className="sprint-row">
              SPRINT: <input type="text" name="sprint" />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="3" className="section-title">INFORMACIÓN DE SOLICITUD</td>
          </tr>
          <tr>
            <td>
              FECHA:
              <input type="date" name="fecha" />
            </td>
            <td colSpan="2">
              VISTA DONDE SE SOLICITA EL CAMBIO (PROBLEMA):
              <input type="text" name="vista" />
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="section-title">DATOS DEL CLIENTE</td>
          </tr>
          <tr>
            <td>
              NOMBRES Y APELLIDOS:
              <input type="text" name="nombres" />
            </td>
            <td>
              PROPIETARIO DEL PROYECTO:
              <input type="text" name="propietario" />
            </td>
            <td>
              CÉDULA:
              <input type="text" name="cedula" />
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="section-title">DETALLE DEL CAMBIO (PROBLEMA)</td>
          </tr>
          <tr>
            <td colSpan="3">
              <label>
                EL SOLICITANTE ENTREGA EL DISEÑO INICIAL CON LA DESCRIPCIÓN DEL CAMBIO:
              </label>
              <label><input type="checkbox" name="diseno_si" /> SI</label>
              <label><input type="checkbox" name="diseno_no" /> NO</label>
            </td>
          </tr>
          <tr>
            <td>
              <div className="checkbox-group">
                <span className="subsection-title">TIPO DE REQUERIMIENTO:</span>
                <label><input type="checkbox" name="actualizacion" /> Actualización</label>
                <label><input type="checkbox" name="interfaz" /> Interfaz</label>
                <label><input type="checkbox" name="reportes" /> Reportes</label>
                <label><input type="checkbox" name="eliminacion" /> Eliminación</label>
                <label><input type="checkbox" name="otro" /> Otro</label>
              </div>
            </td>
            <td>
              <div className="checkbox-group">
                <span className="subsection-title">PRIORIDAD:</span>
                <label><input type="checkbox" name="alta" /> Alta</label>
                <label><input type="checkbox" name="media" /> Media</label>
                <label><input type="checkbox" name="baja" /> Baja</label>
                <label><input type="checkbox" name="urgente" /> Urgente</label>
              </div>
            </td>
            <td>
              <span className="subsection-title">JUSTIFICACIÓN DE LA PRIORIDAD:</span>
              <textarea name="justificacion" rows="3" />
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              <span className="textarea-title">DESCRIPCIÓN DEL CAMBIO (PROBLEMA):</span>
              <textarea name="descripcion" rows="4" />
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              <span className="input-title">BENEFICIOS DEL CAMBIO:</span>
              <input type="text" name="beneficios" />
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              <span className="textarea-title">CAPTURAS DE PANTALLA / DIBUJO:</span>
              <textarea name="capturas" rows="4" />
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="section-title">
              FIRMAS DE RECEPCIÓN DE LA SOLICITUD
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="firma-container">
              <table className="firma-table">
                <colgroup>
                  <col style={{ width: '50%' }} />
                  <col style={{ width: '50%' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td>
                      <span className="input-title">CLIENTE NOMBRE:</span>
                      <input type="text" name="firma_cliente_nombre" />
                    </td>
                    <td>
                      <span className="input-title">
                        PERSONA QUE RECIBE NOMBRE:
                      </span>
                      <input type="text" name="firma_destino_nombre" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="input-title">CARGO:</span>
                      <input type="text" name="firma_cliente_cargo" />
                    </td>
                    <td>
                      <span className="input-title">CARGO:</span>
                      <input type="text" name="firma_destino_cargo" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="input-title">FIRMA:</span>
                      <input type="text" name="firma_cliente" />
                    </td>
                    <td>
                      <span className="input-title">FIRMA:</span>
                      <input type="text" name="firma_destino" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default FormularioSolicitudCambios;