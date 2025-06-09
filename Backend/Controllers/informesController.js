const { sequelize, Sequelize } = require('../models');
const { INFORMES, REGISTRO_PERSONAS, PERSONAS } = require('../models');
const multer = require('multer');
const path = require('path');

exports.getNotasPorEvento = async (req, res) => {
  try {
    const results = await sequelize.query(`
      SELECT e.ID_EVT, e.NOM_EVT, de.CAT_DET,
             p.CED_PER, p.NOM_PER, p.APE_PER,
             i.NOT_INF
      FROM EVENTOS e
      JOIN DETALLE_EVENTOS de ON e.ID_EVT = de.ID_EVT
      JOIN REGISTRO_EVENTO re ON de.ID_DET = re.ID_DET
      JOIN REGISTRO_PERSONAS rp ON re.ID_REG_EVT = rp.ID_REG_EVT
      JOIN PERSONAS p ON rp.CED_PER = p.CED_PER
      LEFT JOIN INFORMES i ON rp.NUM_REG_PER = i.NUM_REG_PER
      WHERE de.CAT_DET = 'CURSO'
    `, {
      type: Sequelize.QueryTypes.SELECT
    });

    const eventosMap = {};

    results.forEach(row => {
      const key = row.ID_EVT;
      if (!eventosMap[key]) {
        eventosMap[key] = {
          ID_EVT: row.ID_EVT,
          NOM_EVT: row.NOM_EVT,
          CAT_DET: row.CAT_DET,
          Personas: []
        };
      }

      eventosMap[key].Personas.push({
        CED_PER: row.CED_PER,
        NOM_PER: row.NOM_PER,
        APE_PER: row.APE_PER,
        NOT_INF: row.NOT_INF || null
      });
    });

    res.json(Object.values(eventosMap));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotasPorAutoridad = async (req, res) => {
  try {
    const cedula = req.params.cedula;

    const results = await sequelize.query(`
      SELECT e.ID_EVT, e.NOM_EVT, de.CAT_DET,
             p.CED_PER, p.NOM_PER, p.APE_PER,
             i.NOT_INF
      FROM EVENTOS e
      JOIN DETALLE_EVENTOS de ON e.ID_EVT = de.ID_EVT
      JOIN REGISTRO_EVENTO re ON de.ID_DET = re.ID_DET
      JOIN REGISTRO_PERSONAS rp ON re.ID_REG_EVT = rp.ID_REG_EVT
      JOIN PERSONAS p ON rp.CED_PER = p.CED_PER
      LEFT JOIN INFORMES i ON rp.NUM_REG_PER = i.NUM_REG_PER
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
          CAT_DET: row.CAT_DET,
          Personas: []
        };
      }

      eventosMap[key].Personas.push({
        CED_PER: row.CED_PER,
        NOM_PER: row.NOM_PER,
        APE_PER: row.APE_PER,
        NOT_INF: row.NOT_INF || null
      });
    });

    res.json(Object.values(eventosMap));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarOCrearNota = async (req, res) => {
  const { CED_PER, NOT_INF } = req.body;

  try {
    const persona = await PERSONAS.findOne({ where: { CED_PER: CED_PER } });
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });

    const registro = await REGISTRO_PERSONAS.findOne({ where: { CED_PER: CED_PER } });
    if (!registro) return res.status(404).json({ error: 'Registro persona no encontrado' });

    let informe = await INFORMES.findOne({ where: { NUM_REG_PER: registro.NUM_REG_PER } });

    if (informe) {
      await informe.update({ NOT_INF: NOT_INF });
    } else {
      informe = await INFORMES.create({
        NUM_REG_PER: registro.NUM_REG_PER,
        NOT_INF: NOT_INF
      });
    }

    res.json({ message: 'Nota asignada correctamente', informe });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar o crear la nota' });
  }
};