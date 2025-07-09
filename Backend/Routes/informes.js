const express = require('express');
const router = express.Router();
const informesController = require('../Controllers/informesController');

router.get('/', informesController.getNotasPorEvento);
router.get('/:cedula', informesController.getNotasPorAutoridad);
router.post('/nota', informesController.editarOCrearNota);
router.get('/notas/:idDet', informesController.verificarNotasAsignadas);

module.exports = router;
