require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3306;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor Backend activo ✅');
});

app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend 👋' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
});