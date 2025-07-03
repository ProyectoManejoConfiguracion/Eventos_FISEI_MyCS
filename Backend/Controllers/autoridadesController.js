const { sequelize } = require('../models');           // conexión activa
const initModels = require('../models/init-models');  // función que crea modelos + relaciones

const models = initModels(sequelize);                 // inicializa todo
const { AUTORIDADES, PERSONAS } = models;             // extraes los modelos que necesitas



exports.getAll = async (req, res) => {
  try {
    const data = await AUTORIDADES.findAll({
      include: {
        model: PERSONAS,
        as: 'CED_PER_PERSONA', // alias exacto del belongsTo
        attributes: ['NOM_PER', 'APE_PER']
      }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await AUTORIDADES.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newRecord = await AUTORIDADES.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
        if (err.name === "SequelizeValidationError" || err.name === "SequelizeDatabaseError" || err.name === "notNull Violation:" || err.name === "SequelizeUniqueConstraintError"
        || err.name === "SequelizeForeignKeyConstraintError" || err.name === "SequelizeConnectionError" || err.name === "SequelizeConnectionRefusedError" || err.name === "SequelizeTimeoutError" || err.name === "SequelizeAccessDeniedError" || err.name === "SequelizeHostNotFoundError" || err.name === "SequelizeHostNotReachableError" || err.name === "SequelizeInvalidConnectionError" || err.name === "SequelizeConnectionTimedOutError" || err.name === "SequelizeConnectionAcquireTimeoutError"
        || err.name === "SequelizeConnectionLostError" || err.name === "SequelizeConnectionResetError" || err.name === "SequelizeConnectionAbortedError" || err.name === "SequelizeConnectionRefusedError" || err.name === "SequelizeConnectionClosedError" || err.name === "SequelizeConnectionPoolTimeoutError" || err.name === "SequelizeConnectionPoolFullError" || err.name === "SequelizeConnectionPoolEmptyError" || err.name === "SequelizeConnectionPoolClosedError"
        || err.name === "SequelizeConnectionPoolInvalidError" || err.name === "SequelizeConnectionPoolAcquireTimeoutError" || err.name === "SequelizeConnectionPoolReleaseTimeoutError" || err.name === "SequelizeConnectionPoolDestroyTimeoutError" || err.name === "SequelizeConnectionPoolEvictTimeoutError" || err.name === "SequelizeConnectionPoolGetTimeoutError" || err.name === "SequelizeConnectionPoolSetTimeoutError" || err.name === "SequelizeConnectionPoolClearTimeoutError"
        || err.name === "SequelizeConnectionPoolCloseTimeoutError" || err.name === "SequelizeConnectionPoolDrainTimeoutError" || err.name === "SequelizeConnectionPoolIdleTimeoutError" || err.name === "SequelizeConnectionPoolBusyTimeoutError" || err.name === "SequelizeConnectionPoolUnavailableError" || err.name === "SequelizeConnectionPoolOverloadError" || err.name === "SequelizeConnectionPoolUnderloadError"
        ) {
      // Puedes analizar err.message o err.errors para personalizar
      if (err.message.includes("AUTORIDADES.CED_PER cannot be null")) {
        return res.status(400).json({ error: "Debes ingresar una cédula para la autoridad." });
      }
      // Otras validaciones...
    }
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await AUTORIDADES.update(req.body, { where: { ID_AUT: req.params.id } });
    if (updated) {
      const updatedRecord = await AUTORIDADES.findByPk(req.params.id);
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
    const deleted = await AUTORIDADES.destroy({ where: { ID_AUT: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
