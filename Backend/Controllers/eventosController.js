const { EVENTOS } = require('../models');
const multer = require('multer');
const path = require('path');

const storageEventos = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/eventos'),
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
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { ID_EVT, NOM_EVT, FEC_EVT, LUG_EVT, TIP_EVT, MOD_EVT,FOT_EVT, DES_EVT, SUB_EVT } = req.body;
      const imagenPath = req.file ? req.file.path : null;

      const newEvento = await EVENTOS.create({
        ID_EVT,
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
