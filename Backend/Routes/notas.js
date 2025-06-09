const express = require('express');
const router  = express.Router();
const notasCtrl = require('../Controllers/notasController');

router.get('/:cedula', notasCtrl.getNotasPorEstudiante);

module.exports = router;