import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Solución a __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join('C:', 'uploads')));

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor Backend activo ✅');
});

// Cargar rutas dinámicamente
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(async (file) => {
  if (file.endsWith('.js')) {
    const routeModule = await import(`./routes/${file}`);
    const route = routeModule.default;
    const routeName = file.replace('.js', '');
    app.use(`/api/${routeName}`, route);
  }
});

// Ruta adicional de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend 👋' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
})