const { sequelize, Sequelize } = require('../models');

exports.getNotasPorEstudiante = async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const results = await sequelize.query(`
      SELECT
        de.ID_DET    AS id,
        ev.NOM_EVT   AS nombre,
        i.NOT_INF    AS nota,
        rp.FEC_REG_PER AS fechaFinalizacion
      FROM DETALLE_EVENTOS de
      JOIN EVENTOS ev     ON de.ID_EVT = ev.ID_EVT
      JOIN REGISTRO_EVENTO re  ON de.ID_DET = re.ID_DET
      JOIN REGISTRO_PERSONAS rp ON re.ID_REG_EVT = rp.ID_REG_EVT
      LEFT JOIN INFORMES i ON rp.NUM_REG_PER = i.NUM_REG_PER
      WHERE rp.CED_PER = :cedula
        AND de.CAT_DET = 'CURSO'
    `, {
      replacements: { cedula },
      type: Sequelize.QueryTypes.SELECT
    });

    const payload = results.map(row => ({
      id:                  row.id,
      nombre:              row.nombre,
      nota:                row.nota,                      
      fechaFinalizacion:   row.fechaFinalizacion || null  
    }));

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
