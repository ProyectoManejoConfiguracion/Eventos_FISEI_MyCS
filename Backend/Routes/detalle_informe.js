const express = require('express');
const router = express.Router();
const detalle_informeController = require('../Controllers/detalle_informeController');

router.get('/:cedula', detalle_informeController.getAsistenciasPorAutoridad);
router.post('/asistencia', detalle_informeController.asignarAsistencia);
router.delete('/borrar/:id', detalle_informeController.eliminarDetalleInforme);
module.exports = router;
