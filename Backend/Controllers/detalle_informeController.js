const { sequelize, Sequelize } = require('../models');
const multer = require('multer');
const path = require('path');

exports.getNotasPorEvento = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT e.ID_EVT, e.NOM_EVT, p.CED_PER, p.NOM_PER, p.APE_PER,
             di.NUM_DET_INF, di.REG_ASI, di.NOT_DET
      FROM EVENTOS e
      JOIN DETALLE_EVENTOS de ON e.ID_EVT = de.ID_EVT
      JOIN REGISTRO_EVENTO re ON de.ID_DET = re.ID_DET
      JOIN REGISTRO_PERSONAS rp ON re.ID_REG_EVT = rp.ID_REG_EVT
      JOIN PERSONAS p ON rp.CED_PER = p.CED_PER
      JOIN INFORMES i ON rp.NUM_REG_PER = i.NUM_REG_PER
      JOIN DETALLE_INFORME di ON i.NUM_IFN = di.NUM_INF
      WHERE e.ID_EVT = :id
    `, {
      replacements: { id: req.params.id },
      type: Sequelize.QueryTypes.SELECT
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};