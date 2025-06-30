const { NIVEL, REGISTRO_EVENTO } = require('../models');

exports.getNivelesPorDetalle = async (req, res) => {
  try {
    const { idDet } = req.params;

    const registros = await REGISTRO_EVENTO.findAll({
      where: { ID_DET: idDet },
      attributes: ['ID_NIV'],
      raw: true
    });

    const idNivs = registros
      .map(r => r.ID_NIV)
      .filter(id => id !== null);

    if (idNivs.length === 0) {
      return res.json([]);
    }

    const niveles = await NIVEL.findAll({
      where: { ID_NIV: idNivs }
    });

    res.json(niveles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los niveles del detalle' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await NIVEL.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await NIVEL.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newRecord = await NIVEL.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await NIVEL.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await NIVEL.findByPk(req.params.id);
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
    const deleted = await NIVEL.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
