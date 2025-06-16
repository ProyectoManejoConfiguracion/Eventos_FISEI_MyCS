const express = require('express');
const router = express.Router();
const detalle_eventosController = require('../Controllers/detalle_eventosController');

router.get('/', detalle_eventosController.getAll);
router.get('/:id', detalle_eventosController.getByEvent);
router.post('/', detalle_eventosController.create);
router.put('/:id', detalle_eventosController.update);
router.delete('/:id', detalle_eventosController.delete);

module.exports = router;
