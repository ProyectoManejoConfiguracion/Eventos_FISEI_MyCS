const express = require('express');
const router = express.Router();
const certificadoCtrl = require('../Controllers/certificadoController');

router.get('/:cedula', certificadoCtrl.getCertificado);
router.get('/asistencia/:cedula/:id_det', certificadoCtrl.getAsistencia);

module.exports = router;
