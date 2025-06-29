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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByCedula = async (req, res) => {
  try {
    const data = await AUTORIDADES.findOne({
      where: { CED_PER: req.params.cedula },
      include: {
        model: PERSONAS,
        as: 'CED_PER_PERSONA',
        attributes: ['NOM_PER', 'APE_PER']
      }
    });
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
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
