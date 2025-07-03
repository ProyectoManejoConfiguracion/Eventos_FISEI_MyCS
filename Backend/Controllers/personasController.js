const { PERSONAS, ESTUDIANTES, AUTORIDADES, PasswordResetToken } = require('../models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clavesecretasupersegura';
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('C:', 'uploads');
const crypto = require('crypto');
const { sendRecoveryEmail } = require('../utils/mailer');





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
}).single('FOT_PER');

const imgced = multer({ 
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
}).single('FOT_CED');

exports.recover = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await PERSONAS.findOne({ where: { COR_PER: email } });
    if (user) {
      // genera token único y guarda con expiración
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora
      await PasswordResetToken.create({
        CED_PER: user.CED_PER,  // o el campo PK de PERSONAS
        token,
        expiresAt
      });
      // envía el correo con nodemailer
      await sendRecoveryEmail(user.COR_PER, token);
    }
    // devolvemos 204 en todos los casos para no filtrar existencia
    res.sendStatus(204);
} catch (err) {
    console.error('Error en recover:', err);
    // Envía el mensaje real para poder debuguear
    res.status(500).json({ error: err.message });
}
};

// 2) POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // busca el registro de token junto al usuario
    const record = await PasswordResetToken.findOne({
      where: { token },
      include: { model: PERSONAS, foreignKey: 'CED_PER' }
    });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
    // actualiza la contraseña
    record.PERSONA.CON_PER = await bcrypt.hash(newPassword, 10);
    await record.PERSONA.save();
    // destruye el token para que no se reutilice
    await record.destroy();
    res.json({ message: 'Contraseña restablecida correctamente.' });
  } catch (err) {
  console.error("Error en reset-password:", err);
  res.status(500).json({ error: err.message });
}
};

exports.create = async (req, res) => {
  // Manejar la subida de la imagen primero
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
        console.log("Body recibido en /api/personas:", req.body);
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
      console.error("Error en create PERSONAS:", error); // <<--- Aquí ve el error real
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
    let estado = "No Verificado";
    const autoridad = await AUTORIDADES.findOne({ where: { CED_PER: user.CED_PER } });
    if (autoridad) {
      const primeraAutoridad = await AUTORIDADES.findOne({
        order: [['ID_AUT', 'ASC']]
      });

      rol = (autoridad.ID_AUT === primeraAutoridad.ID_AUT) ? 'Admin' : 'Docente';
      estado = autoridad.ESTADO;
    } else {
      const estudiante = await ESTUDIANTES.findOne({ where: { CED_EST: user.CED_PER } });
      if (estudiante) {
        rol = 'Estudiante';
        estado = estudiante.ESTADO;
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
        ROL_EST: rol,
        FOT_PER: user.FOT_PER
        ESTADO: estado
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.update = async (req, res) => {
  // Manejar la subida de la imagen primero
  imgced(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { CON_PER, ...rest } = req.body;
      let updates = { ...rest };

      
      if (req.file) {
        const imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
        updates.FOT_CED = imagePath;
      }

    
      if (CON_PER) {
        updates.CON_PER = await bcrypt.hash(CON_PER, 10);
      }

      const [updated] = await PERSONAS.update(updates, { where: { CED_PER: req.params.id } });

      if (updated) {
        const updatedRecord = await PERSONAS.findByPk(req.params.id);
        res.json({
          message: 'Usuario actualizado exitosamente',
          user: {
            CED_PER: updatedRecord.CED_PER,
            NOM_PER: updatedRecord.NOM_PER,
            APE_PER: updatedRecord.APE_PER,
            COR_PER: updatedRecord.COR_PER,
            FOT_PER: updatedRecord.FOT_PER,
            FOT_CED: updatedRecord.FOT_CED
          }
        });
      } else {
        res.status(404).json({ error: 'Persona no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.delete = async (req, res) => {
  try {
    const deleted = await PERSONAS.destroy({ where: { CED_PER: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: err.message }); // <-- muy útil para depurar
  }
};

exports.getPersonasNoVerificadas = async (req, res) => {
  try {
    const data = await PERSONAS.findAll({
      where: { EST_PER: { [require('sequelize').Op.ne]: 'VERIFICADO' } }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAutoridadesNoVerificadas = async (req, res) => {
  try {
    const data = await AUTORIDADES.findAll({
      where: { ESTADO: { [require('sequelize').Op.ne]: 'VERIFICADO' } }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEstudiantesNoVerificados = async (req, res) => {
  try {
    const data = await ESTUDIANTES.findAll({
      where: { ESTADO: { [require('sequelize').Op.ne]: 'VERIFICADO' } }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoPersona = async (req, res) => {
  try {
    const { estado } = req.body;
    const [updated] = await PERSONAS.update(
      { EST_PER: estado },
      { where: { CED_PER: req.params.id } }
    );
    if (updated) {
      res.json({ message: 'Estado actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoAutoridad = async (req, res) => {
  try {
    const { estado } = req.body;
    const [updated] = await AUTORIDADES.update(
      { ESTADO: estado },
      { where: { CED_PER: req.params.id } }
    );
    if (updated) {
      res.json({ message: 'Estado actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Autoridad no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoEstudiante = async (req, res) => {
  try {
    const { estado } = req.body;
    const [updated] = await ESTUDIANTES.update(
      { ESTADO: estado },
      { where: { CED_EST: req.params.id } }
    );
    if (updated) {
      res.json({ message: 'Estado actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
