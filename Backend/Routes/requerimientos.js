const express = require('express');
const router = express.Router();
const requerimientosController = require('../Controllers/requerimientosController');

router.get('/', requerimientosController.getAll);
router.get('/:id', requerimientosController.getOne);
router.post('/', requerimientosController.create);
router.put('/:id', requerimientosController.update);
router.delete('/:id', requerimientosController.delete);

module.exports = router;
