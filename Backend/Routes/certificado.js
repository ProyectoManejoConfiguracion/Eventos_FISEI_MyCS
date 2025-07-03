const express = require('express');
const router = express.Router();
const certificadoCtrl = require('../Controllers/certificadoController');

router.get('/:cedula', certificadoCtrl.getCertificado);

module.exports = router;
