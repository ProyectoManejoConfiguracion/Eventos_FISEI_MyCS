const { PERSONAS, ESTUDIANTES, AUTORIDADES } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clavesecretasupersegura';
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

const upload = multer({ 
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
}).single('FOT_PER');

exports.create = async (req, res) => {
  // Manejar la subida de la imagen primero
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { CON_PER, ...rest } = req.body;
      let imagePath = null;

      if (!CON_PER) {
        return res.status(400).json({ error: 'Se requiere una contraseña' });
      }

      // Si se subió una imagen
      if (req.file) {
        imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
      }

      const hashedPassword = await bcrypt.hash(CON_PER, 10);

      const newRecord = await PERSONAS.create({
        CON_PER: hashedPassword,
        FOT_PER: imagePath, // Guardar la ruta de la imagen
        ...rest
      });

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: {
          CED_PER: newRecord.CED_PER,
          NOM_PER: newRecord.NOM_PER,
          APE_PER: newRecord.APE_PER,
          COR_PER: newRecord.COR_PER,
          FOT_PER: newRecord.FOT_PER
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.getAll = async (req, res) => {
  try {
    const data = await PERSONAS.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await PERSONAS.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await PERSONAS.findOne({
      where: { COR_PER: email }
    });

    if (!user) {
      return res.status(404).json({ error: 'Correo no encontrado' });
    }

    const isValid = await bcrypt.compare(password, user.CON_PER);
    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    let rol = 'Invitado';

    const autoridad = await AUTORIDADES.findOne({ where: { CED_PER: user.CED_PER } });
    if (autoridad) {
      const primeraAutoridad = await AUTORIDADES.findOne({
        order: [['ID_AUT', 'ASC']]
      });

      rol = (autoridad.ID_AUT === primeraAutoridad.ID_AUT) ? 'Admin' : 'Docente';
    } else {
      const estudiante = await ESTUDIANTES.findOne({ where: { CED_EST: user.CED_PER } });
      if (estudiante) {
        rol = 'Estudiante';
      }
    }

    const token = jwt.sign(
      {
        id: user.CED_PER,
        email: user.COR_PER,
        nombre: user.NOM_PER,
        ROL_EST: rol
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        CED_PER: user.CED_PER,
        NOM_PER: user.NOM_PER,
        APE_PER: user.APE_PER,
        COR_PER: user.COR_PER,
        ROL_EST: rol
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.update = async (req, res) => {
  try {
    const [updated] = await PERSONAS.update(req.body, { where: { CED_PER: req.params.id } });
    if (updated) {
      const updatedRecord = await PERSONAS.findByPk(req.params.id);
      res.json(updatedRecord);
    } else {
      res.status(404).json({ error: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const deleted = await PERSONAS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
