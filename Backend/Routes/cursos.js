const express = require('express');
const router = express.Router();
const cursoController = require('../Controllers/cursoController');

router.get('/:cedula', cursoController.getCursos);

module.exports = router;
