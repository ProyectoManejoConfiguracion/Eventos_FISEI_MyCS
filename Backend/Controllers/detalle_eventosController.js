const { DETALLE_EVENTOS } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await DETALLE_EVENTOS.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await DETALLE_EVENTOS.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Obtener el último ID_DET existente
    const lastDetalle = await DETALLE_EVENTOS.findOne({
      order: [['ID_DET', 'DESC']]
    });

    let newId;
    if (lastDetalle) {
      const lastNumber = parseInt(lastDetalle.ID_DET.replace("DET", ""), 10);
      const nextNumber = lastNumber + 1;
      newId = `DET${nextNumber.toString().padStart(3, '0')}`;
    } else {
      newId = "DET001";
    }

    // Agregar el ID_DET generado al body
    const detalleData = {
      ID_DET: newId,
      ID_EVT: req.body.ID_EVT,
      CED_AUT: req.body.CED_AUT,
      CUP_DET: req.body.CUP_DET,
      NOT_DET: req.body.NOT_DET,
      HOR_DET: req.body.HOR_DET,
      ARE_DET: req.body.ARE_DET,
      CAT_DET: req.body.CAT_DET
    };

    const newDetalle = await DETALLE_EVENTOS.create(detalleData);
    res.status(201).json(newDetalle);

  } catch (error) {
    console.error("Error al crear detalle_evento:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const [updated] = await DETALLE_EVENTOS.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await DETALLE_EVENTOS.findByPk(req.params.id);
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
    const deleted = await DETALLE_EVENTOS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
