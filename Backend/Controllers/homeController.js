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
    let imagen = null;
    if (section === "stats" || section === "tajetasNosotros" || section === "tarjetasContactanos") {
      imagen = req.body.imagen || null;
    } else if (req.file) {
      imagen = req.file.path.replace(/\\/g, "/");
    }
    const newRecord = await HOME.create({ titulo, descripcion, section, imagen });
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const registro = await HOME.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: 'No encontrado' });

    const { titulo, descripcion, section } = req.body;
    let nuevaImagen = registro.imagen;

    if (section === "stats" || section === "tarjetasNosotros" || section === "tarjetasContactanos") {
      nuevaImagen = req.body.imagen || "Users";
    } else if (req.file) {
      nuevaImagen = req.file.path.replace(/\\/g, "/");
    }

    await registro.update({
      titulo,
      descripcion,
      section,
      imagen: nuevaImagen
    });

    res.json(registro);
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