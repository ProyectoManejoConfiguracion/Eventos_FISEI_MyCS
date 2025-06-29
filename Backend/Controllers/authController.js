// Backend/Controllers/authController.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { PERSONAS, PasswordResetToken } = require('../models');
const { sendRecoveryEmail } = require('../utils/mailer');

exports.recover = async (req, res) => {
  const { email } = req.body;
  const PERSONAS = await PERSONAS.findOne({ where: { email } });
  if (PERSONAS) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1h
    await PasswordResetToken.create({ PERSONAId: PERSONAS.CED_PER, token, expiresAt });
    await sendRecoveryEmail(PERSONAS.email, token);
  }
  // siempre 204 para no filtrar si existe o no
  res.sendStatus(204);
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const record = await PasswordResetToken.findOne({
    where: { token },
    include: PERSONAS
  });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Token inválido o expirado.' });
  }
  record.PERSONAS.password = await bcrypt.hash(newPassword, 10);
  await record.PERSONAS.save();
  await record.destroy();
  res.json({ message: 'Contraseña restablecida correctamente.' });
};
