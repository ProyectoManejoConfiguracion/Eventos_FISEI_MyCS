const { REGISTRO_PERSONAS } = require('../models');
const { sequelize, Sequelize } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await REGISTRO_PERSONAS.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await REGISTRO_PERSONAS.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newRecord = await REGISTRO_PERSONAS.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await REGISTRO_PERSONAS.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await REGISTRO_PERSONAS.findByPk(req.params.id);
      res.json(updatedRecord);
    } else {
      res.status(404).json({ error: 'No encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await REGISTRO_PERSONAS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//--------------------------------------------------- Inscripción de persona a un evento
exports.inscribirPersona = async (req, res) => {
  const { idEvento, cedula } = req.body;

  try {
    // 1. Obtener detalles del evento (ID_DET, CUP_DET) desde DETALLE_EVENTOS con idEvento
    const detalleEvento = await sequelize.query(
      `SELECT ID_DET, CUP_DET, ID_EVT FROM DETALLE_EVENTOS WHERE ID_EVT = :idEvento`,
      {
        replacements: { idEvento },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!detalleEvento.length) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // 2. Verificar si la persona es estudiante y obtener su nivel
    const estudiante = await sequelize.query(
      `SELECT ID_NIV FROM ESTUDIANTES WHERE CED_EST = :cedula`,
      {
        replacements: { cedula },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const esEstudiante = estudiante.length > 0;
    const idNivel = esEstudiante ? estudiante[0].ID_NIV : null;

    // 3. Obtener modo del evento (PUBLICO/PRIVADO)
    const evento = await sequelize.query(
      `SELECT MOD_EVT FROM EVENTOS WHERE ID_EVT = :idEvento`,
      {
        replacements: { idEvento },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (!evento.length) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    const modoEvento = evento[0].MOD_EVT;

    // 4. Reglas de inscripción según tipo de persona y evento
    let registroEvento = null;
    if (esEstudiante) {
      if (modoEvento !== 'PRIVADO') {
        return res.status(400).json({ error: 'Solo estudiantes pueden inscribirse en eventos privados' });
      }
      // Buscar REGISTRO_EVENTO con ese ID_NIV
      registroEvento = await sequelize.query(
        `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND ID_NIV = :idNivel`,
        {
          replacements: { idsDet: detalleEvento.map(d => d.ID_DET), idNivel },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    } else {
      if (modoEvento !== 'PUBLICO') {
        return res.status(400).json({ error: 'Solo estudiantes pueden inscribirse en eventos privados' });
      }
      // Buscar REGISTRO_EVENTO con ID_NIV = NULL
      registroEvento = await sequelize.query(
        `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND ID_NIV IS NULL`,
        {
          replacements: { idsDet: detalleEvento.map(d => d.ID_DET) },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    }

    if (!registroEvento.length) {
      return res.status(400).json({ error: 'No disponible para inscripción' });
    }

    // 5. Verificar cupos desde REGISTRO_PERSONA para ese ID_REG_EVT contra CUP_DET de DETALLE_EVENTOS
    const idRegEvt = registroEvento[0].ID_REG_EVT;
    const idDet = registroEvento[0].ID_DET;
    const cupoDet = detalleEvento.find(d => d.ID_DET === idDet).CUP_DET;

    const totalInscritos = await sequelize.query(
      `SELECT COUNT(*) as total FROM REGISTRO_PERSONAS WHERE ID_REG_EVT = :idRegEvt`,
      {
        replacements: { idRegEvt },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (cupoDet !== null && totalInscritos[0].total >= cupoDet) {
      return res.status(400).json({ error: 'No hay cupos disponibles' });
    }

    // 6. Obtener tarifa desde TARIFAS_EVENTO si existe
    const tarifa = await sequelize.query(
      `SELECT ID_TAR FROM TARIFAS_EVENTO WHERE ID_EVT = :idEvento ORDER BY VAL_EVT ASC LIMIT 1`,
      {
        replacements: { idEvento },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const idTarifa = tarifa.length ? tarifa[0].ID_TAR : null;

    // 7. Buscar el último NUM_REG_PER y sumar 1
    const ultimoNum = await sequelize.query(
      `SELECT MAX(NUM_REG_PER) as maxNum FROM REGISTRO_PERSONAS`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const nuevoNum = (ultimoNum[0].maxNum || 0) + 1;

    // 8. Insertar en REGISTRO_PERSONAS
    await sequelize.query(
      `INSERT INTO REGISTRO_PERSONAS (NUM_REG_PER, CED_PER, ID_REG_EVT, ID_TAR_PER, FEC_REG_PER)
       VALUES (:numReg, :cedula, :idRegEvt, :idTarifa, CURRENT_DATE)`,
      {
        replacements: {
          numReg: nuevoNum,
          cedula,
          idRegEvt,
          idTarifa,
        },
        type: Sequelize.QueryTypes.INSERT,
      }
    );

    res.json({ message: 'Inscripción realizada con éxito', numReg: nuevoNum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};