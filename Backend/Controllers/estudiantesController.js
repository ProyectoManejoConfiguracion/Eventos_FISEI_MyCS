const { ESTUDIANTES } = require('../models');

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
}).single('FOT_INS');
//----------------------------
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'uploads');

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

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF)'));
  }
}).single('FOT_INS');

// Controlador para actualizar solo la foto
exports.updatePhoto = async (req, res) => { 
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    console.log('Parámetros:', req.params);
    const { CED_EST } = req.params;

    if (!CED_EST) {
      return res.status(400).json({ error: 'Se requiere el identificador del estudiante (CED_EST) en la URL' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    const imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');

    try {
      const estudiante = await ESTUDIANTES.findOne({ where: { CED_EST } });

      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }

      // Actualizar la foto
      estudiante.FOT_INS = imagePath;
      await estudiante.save();

      res.json({
        message: 'Foto del estudiante actualizada correctamente',
        estudiante: {
          CED_EST: estudiante.CED_EST,
          FOT_INS: estudiante.FOT_INS
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};


//-----------------------------
exports.getAll = async (req, res) => {
  try {
    const data = await ESTUDIANTES.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await ESTUDIANTES.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newRecord = await ESTUDIANTES.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await ESTUDIANTES.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await ESTUDIANTES.findByPk(req.params.id);
      res.json(updatedRecord);
    } else {
      res.status(404).json({ error: 'No encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByCedula = async (req, res) => {
  try {
    const { CED_EST } = req.params;
    const estudiante = await ESTUDIANTES.findOne({ where: { CED_EST } });
    if (estudiante) {
      res.json(estudiante);
    } else {
      res.status(404).json({ error: 'No encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updatePhoto = async (req, res) => { 
  imgcre(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    console.log('Parámetros:', req.params);
    const { CED_EST } = req.params;

    if (!CED_EST) {
      return res.status(400).json({ error: 'Se requiere el identificador del estudiante (CED_EST) en la URL' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    const imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');

    try {
      const estudiante = await ESTUDIANTES.findOne({ where: { CED_EST } });

      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }

     
      estudiante.FOT_INS = imagePath;
      await estudiante.save();

      res.json({
        message: 'Foto del estudiante actualizada correctamente',
        estudiante: {
          CED_EST: estudiante.CED_EST,
          FOT_INS: estudiante.FOT_INS
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.delete = async (req, res) => {
  try {
    const deleted = await ESTUDIANTES.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
};