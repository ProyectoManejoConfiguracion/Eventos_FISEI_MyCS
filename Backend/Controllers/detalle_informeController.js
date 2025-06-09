const { sequelize, Sequelize } = require('../models');
const multer = require('multer');
const path = require('path');

exports.getAsistenciasPorAutoridad = async (req, res) => {
  try {
    const cedula = req.params.cedula;

    const results = await sequelize.query(`
      SELECT e.ID_EVT, e.NOM_EVT, e.FEC_EVT, de.CAT_DET,
             p.CED_PER, p.NOM_PER, p.APE_PER,
             di.NUM_DET_INF, di.REG_ASI
      FROM EVENTOS e
      JOIN DETALLE_EVENTOS de ON e.ID_EVT = de.ID_EVT
      JOIN REGISTRO_EVENTO re ON de.ID_DET = re.ID_DET
      JOIN REGISTRO_PERSONAS rp ON re.ID_REG_EVT = rp.ID_REG_EVT
      JOIN PERSONAS p ON rp.CED_PER = p.CED_PER
      LEFT JOIN INFORMES i ON rp.NUM_REG_PER = i.NUM_REG_PER
      LEFT JOIN DETALLE_INFORME di ON i.NUM_IFN = di.NUM_INF
      WHERE de.CAT_DET = 'CURSO' AND de.CED_AUT = :cedula
    `, {
      replacements: { cedula },
      type: Sequelize.QueryTypes.SELECT
    });

    const eventosMap = {};

    results.forEach(row => {
      const key = row.ID_EVT;
      if (!eventosMap[key]) {
        eventosMap[key] = {
          ID_EVT: row.ID_EVT,
          NOM_EVT: row.NOM_EVT,
          FEC_EVT: row.FEC_EVT,
          CAT_DET: row.CAT_DET,
          Personas: []
        };
      }

      eventosMap[key].Personas.push({
        CED_PER: row.CED_PER,
        NOM_PER: row.NOM_PER,
        APE_PER: row.APE_PER,
        NUM_DET_INF: row.NUM_DET_INF || null,
        REG_ASI: row.REG_ASI || null
      });
    });

    res.json(Object.values(eventosMap));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

