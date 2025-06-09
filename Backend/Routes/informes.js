const express = require('express');
const router = express.Router();
const informesController = require('../Controllers/informesController');

router.get('/', informesController.getNotasPorEvento);
router.get('/:cedula', informesController.getNotasPorAutoridad);
router.post('/nota', informesController.editarOCrearNota);

module.exports = router;
