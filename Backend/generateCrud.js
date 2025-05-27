const fs = require('fs');
const path = require('path');

// Configura aquí las carpetas
const modelsPath = path.resolve(__dirname, './models');
const controllersPath = path.resolve(__dirname, './controllers');
const routesPath = path.resolve(__dirname, './routes');

// Función para crear contenido controlador
function generateController(modelName, pkName) {
  return `const { ${modelName} } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await ${modelName}.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await ${modelName}.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newRecord = await ${modelName}.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await ${modelName}.update(req.body, { where: { ${pkName}: req.params.id } });
    if (updated) {
      const updatedRecord = await ${modelName}.findByPk(req.params.id);
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
    const deleted = await ${modelName}.destroy({ where: { ${pkName}: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`;
}

function generateRoute(modelName) {
  const fileName = modelName.toLowerCase();
  return `const express = require('express');
const router = express.Router();
const ${fileName}Controller = require('../controllers/${fileName}Controller');

router.get('/', ${fileName}Controller.getAll);
router.get('/:id', ${fileName}Controller.getOne);
router.post('/', ${fileName}Controller.create);
router.put('/:id', ${fileName}Controller.update);
router.delete('/:id', ${fileName}Controller.delete);

module.exports = router;
`;
}

function generateCRUD(modelName, pkName = 'id') {
  const controllerContent = generateController(modelName, pkName);
  const controllerFile = path.join(controllersPath, modelName.toLowerCase() + 'Controller.js');
  fs.writeFileSync(controllerFile, controllerContent, 'utf8');

  const routeContent = generateRoute(modelName);
  const routeFile = path.join(routesPath, modelName.toLowerCase() + '.js');
  fs.writeFileSync(routeFile, routeContent, 'utf8');

  console.log(`Generados controller y ruta para ${modelName}`);
}

const modelFiles = fs.readdirSync(modelsPath).filter(f => f.endsWith('.js'));

modelFiles.forEach(file => {
  const modelName = path.basename(file, '.js');
  
  const pkMap = {
    AUTORIDADES: 'ID_AUT',
    VEHICULOS: 'MATRICULA',
  };
  
  const pkName = pkMap[modelName.toUpperCase()] || 'id'; 
  
  generateCRUD(modelName, pkName);
});