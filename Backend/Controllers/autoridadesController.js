const { sequelize } = require('../models');           // conexión activa
const initModels = require('../models/init-models');  // función que crea modelos + relaciones

const models = initModels(sequelize);                 // inicializa todo
const { AUTORIDADES, PERSONAS } = models;             // extraes los modelos que necesitas
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('C:', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const imgcre = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF)'));
  }
}).single('FOT_CON');


exports.getAll = async (req, res) => {
  try {
    const data = await AUTORIDADES.findAll({
      include: {
        model: PERSONAS,
        as: 'CED_PER_PERSONA', 
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
// ...existing code...

exports.updatePhoto = async (req, res) => { 
  imgcre(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    console.log('Parámetros:', req.params);
    const { CED_PER } = req.params;

    if (!CED_PER) {
      return res.status(400).json({ error: 'Se requiere el identificador de la autoridad (CED_PER) en la URL' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    const imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');

    try {
      const autoridad = await AUTORIDADES.findOne({ where: { CED_PER } });

      if (!autoridad) {
        return res.status(404).json({ error: 'Autoridad no encontrada' });
      }

      autoridad.FOT_CON = imagePath;
      await autoridad.save();

      res.json({
        message: 'Foto de la autoridad actualizada correctamente',
        autoridad: {
          CED_PER: autoridad.CED_PER,
          FOT_CON: autoridad.FOT_CON
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};