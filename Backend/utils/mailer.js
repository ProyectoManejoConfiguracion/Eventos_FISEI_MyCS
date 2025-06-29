
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST,
  port:   Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendRecoveryEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Tu App" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Recuperación de contraseña',
html: `
  <p>Hola,</p>
  <p>Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el enlace:</p>
  <p><a href="${resetUrl}">${resetUrl}</a></p>
  <p>Si no solicitaste esto, puedes ignorar este correo.</p>
  <br>
  <p>Saludos,<br>Equipo de Soporte</p>
`
  });
}

module.exports = { sendRecoveryEmail };
