const { sequelize } = require('../models');
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const { HOME } = models;

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.section) {
      where.section = req.query.section;
    }
    const data = await HOME.findAll({ where, order: [['id', 'ASC']] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await HOME.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { titulo, descripcion, section } = req.body;
    const imagen = req.file ? req.file.path.replace(/\\/g, "/") : null; // Para rutas en Windows
    const newRecord = await HOME.create({ titulo, descripcion, section, imagen });
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await HOME.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await HOME.findByPk(req.params.id);
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
    const deleted = await HOME.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};