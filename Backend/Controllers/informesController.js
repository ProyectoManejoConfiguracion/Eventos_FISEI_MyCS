const { sequelize, Sequelize } = require('../models');
const { INFORMES, REGISTRO_PERSONAS, PERSONAS,REGISTRO_EVENTO } = require('../models');
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

exports.verificarNotasAsignadas = async (req, res) => {
  const { idDet } = req.params;

  try {
    // 1. Buscar todos los ID_REG_EVT en REGISTRO_EVENTO para ese ID_DET
    const registrosEvento = await REGISTRO_EVENTO.findAll({
      where: { ID_DET: idDet },
      attributes: ['ID_REG_EVT'],
      raw: true
    });
    const idRegEvtList = registrosEvento.map(r => r.ID_REG_EVT);

    // Si no hay registros de evento para ese detalle, devuelve FALTAN
    if (idRegEvtList.length === 0) {
      return res.json({ resp: "FALTAN" });
    }

    // 2. Buscar todos los NUM_REG_PER en REGISTRO_PERSONAS con esos ID_REG_EVT y EST_REG = 'VERIFICADO'
    const registrosPersonas = await REGISTRO_PERSONAS.findAll({
      where: {
        ID_REG_EVT: idRegEvtList,
        EST_REG: 'VERIFICADO'
      },
      attributes: ['NUM_REG_PER'],
      raw: true
    });
    const numRegPerList = registrosPersonas.map(r => r.NUM_REG_PER);

    // Si no hay personas verificadas, también devuelve FALTAN
    if (numRegPerList.length === 0) {
      return res.json({ resp: "FALTAN" });
    }

    // 3. Buscar informes para esos NUM_REG_PER
    const informes = await INFORMES.findAll({
      where: { NUM_REG_PER: numRegPerList },
      attributes: ['NUM_REG_PER', 'NOT_INF'],
      raw: true
    });

    // Crear un mapa para saber qué NUM_REG_PER tienen nota asignada
    const notasMap = new Map();
    informes.forEach(i => {
      notasMap.set(i.NUM_REG_PER, i.NOT_INF);
    });

    // Verificar que todos los NUM_REG_PER tengan nota asignada (exista en informes y NOT_INF no sea null)
    const todasAsignadas = numRegPerList.every(num =>
      notasMap.has(num) && notasMap.get(num) !== null && notasMap.get(num) !== undefined
    );

    if (todasAsignadas) {
      return res.json({ resp: "ASIGNADAS" });
    } else {
      return res.json({ resp: "FALTAN" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar las notas' });
  }
};