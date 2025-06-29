const express = require('express');
const cors = require('cors');
const app = express();


const port = 3000;

app.use(cors()); // permite conexiones desde otros orígenes (como tu frontend)
app.use(express.json()); // permite leer JSON en las peticiones
app.use('/uploads', express.static('uploads'));

app.post('/personas', (req, res) => {
  console.log('Datos recibidos:', req.body);
  res.json({ mensaje: 'Persona registrada correctamente' });
});




app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
