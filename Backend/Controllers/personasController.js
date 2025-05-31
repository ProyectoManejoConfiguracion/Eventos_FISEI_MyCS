const { PERSONAS } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clavesecretasupersegura';

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

exports.create = async (req, res) => {
  try {
    const { CON_PER, ...rest } = req.body;

    if (!CON_PER) {
      return res.status(400).json({ error: 'Se requiere una contraseña' });
    }

    const hashedPassword = await bcrypt.hash(CON_PER, 10); 

    const newRecord = await PERSONAS.create({
      CON_PER: hashedPassword,
      ...rest
    });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        CED_PER: newRecord.CED_PER,
        NOM_PER: newRecord.NOM_PER,
        APE_PER: newRecord.APE_PER,
        COR_PER: newRecord.COR_PER
      }
    });
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

    const token = jwt.sign(
      {
        id: user.CED_PER,
        email: user.COR_PER,
        nombre: user.NOM_PER
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
        COR_PER: user.COR_PER
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await PERSONAS.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await PERSONAS.findByPk(req.params.id);
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
    const deleted = await PERSONAS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
