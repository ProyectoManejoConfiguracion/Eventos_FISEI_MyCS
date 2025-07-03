const { CARRERAS, REGISTRO_EVENTO, NIVEL } = require('../models');

exports.getByIdDet = async (req, res) => {
  try {
    const { id_det } = req.params;

    // 1. Buscar los ID_NIV autorizados para el ID_DET
    const registros = await REGISTRO_EVENTO.findAll({
      where: { ID_DET: id_det },
      attributes: ['ID_NIV'],
      raw: true
    });
    const idNivs = registros.map(r => r.ID_NIV);

    if (idNivs.length === 0) {
      return res.json([]);
    }

    // 2. Buscar los ID_CAR a los que pertenece cada ID_NIV
    const niveles = await NIVEL.findAll({
      where: { ID_NIV: idNivs },
      attributes: ['ID_CAR'],
      raw: true
    });
    const idCars = [...new Set(niveles.map(n => n.ID_CAR))]; 

    if (idCars.length === 0) {
      return res.json([]);
    }

    // 3. Traer las carreras correspondientes a esos ID_CAR
    const carreras = await CARRERAS.findAll({
      where: { ID_CAR: idCars }
    });

    res.json(carreras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await CARRERAS.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await CARRERAS.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newRecord = await CARRERAS.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await CARRERAS.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await CARRERAS.findByPk(req.params.id);
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
    const deleted = await CARRERAS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
