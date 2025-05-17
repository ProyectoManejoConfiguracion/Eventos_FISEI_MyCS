require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = connection;