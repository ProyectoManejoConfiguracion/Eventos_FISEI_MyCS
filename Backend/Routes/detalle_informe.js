const express = require('express');
const router = express.Router();
const detalle_informeController = require('../Controllers/detalle_informeController');

router.get('/:id', detalle_informeController.getNotasPorEvento);

module.exports = router;
