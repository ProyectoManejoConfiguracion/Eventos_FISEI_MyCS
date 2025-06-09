const express = require('express');
const router = express.Router();
const detalle_informeController = require('../Controllers/detalle_informeController');

router.get('/', detalle_informeController.getNotasPorEvento);
router.get('/:cedula', detalle_informeController.getAsistenciasPorAutoridad);
router.post('/asistencia', detalle_informeController.asignarAsistencia);

module.exports = router;
