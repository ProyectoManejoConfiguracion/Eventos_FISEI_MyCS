const { DETALLE_EVENTOS, EVENTOS, REGISTRO_EVENTO } = require('../models');

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

exports.getByEvent = async (req, res) => {
  try {
    const data = await DETALLE_EVENTOS.findAll({ where: { ID_EVT: req.params.id } });
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.create = async (req, res) => {
  try {
    // Obtener el último ID_DET
    const lastDetalle = await DETALLE_EVENTOS.findOne({
      order: [['ID_DET', 'DESC']]
    });

    let newIdDet;
    if (lastDetalle) {
      const lastNumber = parseInt(lastDetalle.ID_DET.replace("DET", ""), 10);
      newIdDet = `DET${(lastNumber + 1).toString().padStart(3, '0')}`;
    } else {
      newIdDet = "DET001";
    }

    // Crear nuevo detalle
    const detalleData = {
      ID_DET: newIdDet,
      ID_EVT: req.body.ID_EVT,
      CED_AUT: req.body.CED_AUT,
      CUP_DET: req.body.CUP_DET,
      NOT_DET: req.body.NOT_DET,
      HOR_DET: req.body.HOR_DET,
      ARE_DET: req.body.ARE_DET,
      CAT_DET: req.body.CAT_DET
    };

    const newDetalle = await DETALLE_EVENTOS.create(detalleData);

    // Verificar tipo de evento
    const evento = await EVENTOS.findByPk(req.body.ID_EVT);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Obtener el último ID_REG para iniciar numeración
    const lastRegistro = await REGISTRO_EVENTO.findOne({
      order: [['ID_REG_EVT', 'DESC']]
    });

    let nextRegNum = 1;
    if (lastRegistro) {
      const lastRegNumber = parseInt(lastRegistro.ID_REG_EVT.replace("REG", ""), 10);
      nextRegNum = lastRegNumber + 1;
    }

    const generarIdReg = () => {
      const id = `REG${nextRegNum.toString().padStart(3, '0')}`;
      nextRegNum++;
      return id;
    };

    // Insertar registros según tipo de evento
    if (evento.MOD_EVT === "PUBLICO") {
      await REGISTRO_EVENTO.create({
        ID_REG_EVT: generarIdReg(),
        ID_DET: newDetalle.ID_DET
      });
    } else if (evento.MOD_EVT === "PRIVADO") {
      const niveles = req.body.NIVELES_PRIVADOS;

      if (!Array.isArray(niveles) || niveles.length === 0) {
        return res.status(400).json({ error: "Se requieren niveles para eventos privados" });
      }

      const registros = niveles.map(idNiv => ({
        ID_REG_EVT: generarIdReg(),
        ID_DET: newDetalle.ID_DET,
        ID_NIV: idNiv
      }));

      await REGISTRO_EVENTO.bulkCreate(registros);
    }

    res.status(201).json({ detalle: newDetalle, mensaje: "Detalle y registro(s) creado(s) correctamente" });

  } catch (error) {
    console.error("Error al crear detalle_evento y registro_evento:", error);
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
