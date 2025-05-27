const express = require('express');
const router = express.Router();
const detalle_informeController = require('../controllers/detalle_informeController');

router.get('/', detalle_informeController.getAll);
router.get('/:id', detalle_informeController.getOne);
router.post('/', detalle_informeController.create);
router.put('/:id', detalle_informeController.update);
router.delete('/:id', detalle_informeController.delete);

module.exports = router;
