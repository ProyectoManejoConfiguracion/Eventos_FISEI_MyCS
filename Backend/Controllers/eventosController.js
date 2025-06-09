const { EVENTOS , TARIFAS_EVENTO } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('C:', 'uploads', 'eventos');

const storageEventos = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadEvento = multer({
  storage: storageEventos,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) cb(null, true);
    else cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF)'));
  }
}).single('FOT_EVT');

exports.create = async (req, res) => {
  uploadEvento(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      // Generar ID_EVT automático
      const lastEvento = await EVENTOS.findOne({
        order: [['ID_EVT', 'DESC']]
      });

      let newId;
      if (lastEvento) {
        const lastNumber = parseInt(lastEvento.ID_EVT.replace("EV", ""), 10);
        const nextNumber = lastNumber + 1;
        newId = `EV${nextNumber.toString().padStart(3, '0')}`;
      } else {
        newId = "EV001";
      }

      const {
        NOM_EVT,
        FEC_EVT,
        LUG_EVT,
        TIP_EVT,
        MOD_EVT,
        DES_EVT,
        SUB_EVT
      } = req.body;

      const imagenPath = req.file ? req.file.path : null;

      if (!imagenPath) {
        return res.status(400).json({ error: "No se subió ninguna imagen válida." });
      }

      const newEvento = await EVENTOS.create({
        ID_EVT: newId,
        NOM_EVT,
        FEC_EVT,
        LUG_EVT,
        TIP_EVT,
        MOD_EVT,
        FOT_EVT: imagenPath,
        DES_EVT,
        SUB_EVT
      });

      res.status(201).json(newEvento);
    } catch (error) {
      console.error("Error al crear evento:", error);
      res.status(500).json({ error: error.message });
    }
  });
};



exports.getAll = async (req, res) => {
  try {
    const data = await EVENTOS.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await EVENTOS.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const [updated] = await EVENTOS.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await EVENTOS.findByPk(req.params.id);
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
    const deleted = await EVENTOS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventosPagoConTarifas = async (req, res) => {
  try {
    const eventos = await EVENTOS.findAll({
      where: { TIP_EVT: 'DE PAGO' }
    });

    const resultados = await Promise.all(eventos.map(async (evento) => {
      const tarifas = await TARIFAS_EVENTO.findAll({
        where: { ID_EVT: evento.ID_EVT }
      });

      const tarifaEstudiante = tarifas.find(t => t.TIP_PAR === 'ESTUDIANTE');
      const tarifaPersona = tarifas.find(t => t.TIP_PAR === 'PERSONA');

      let tarifasFormateadas = {};

      if (evento.MOD_EVT === 'PRIVADO') {
        tarifasFormateadas = {
          Estudiante: tarifaEstudiante ? tarifaEstudiante.VAL_EVT : "",
          Persona: "N/A"
        };
      } else { 
        tarifasFormateadas = {
          Estudiante: tarifaEstudiante ? tarifaEstudiante.VAL_EVT : "",
          Persona: tarifaPersona ? tarifaPersona.VAL_EVT : ""
        };
      }

      return {
        ID_EVT: evento.ID_EVT,
        NOM_EVT: evento.NOM_EVT,
        TIP_EVT: evento.TIP_EVT,
        FEC_EVT: evento.FEC_EVT,
        MOD_EVT: evento.MOD_EVT,
        FOT_EVT: evento.FOT_EVT,
        ACCESO_EVT: evento.ACCESO_EVT,
        tarifas: tarifasFormateadas
      };
    }));

    return res.json(resultados);

  } catch (error) {
    console.error('Error al obtener eventos de pago con tarifas:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.asignarOActualizarTarifa = async (req, res) => {
  try {
    const { ID_EVT, TIP_PAR, VAL_EVT } = req.body;

    if (!ID_EVT || !TIP_PAR || VAL_EVT === undefined) {
      return res.status(400).json({ error: 'Datos incompletos.' });
    }

    const [tarifa, created] = await TARIFAS_EVENTO.findOrCreate({
      where: { ID_EVT, TIP_PAR },
      defaults: { VAL_EVT }
    });

    if (!created) {
      // Ya existe → actualizar
      tarifa.VAL_EVT = VAL_EVT;
      await tarifa.save();
    }

    return res.json({
      mensaje: created ? 'Tarifa creada correctamente.' : 'Tarifa actualizada correctamente.',
      tarifa
    });

  } catch (error) {
    console.error('Error al asignar o actualizar tarifa:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};
