require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join('C:', 'uploads')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.send('Servidor Backend activo');
});

const routesPath = path.join(__dirname, 'Routes');
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('.js')) {
    const route = require(`./Routes/${file}`);
    const routeName = file.replace('.js', '');
    app.use(`/api/${routeName}`, route);
  }
});

app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend 👋' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
});