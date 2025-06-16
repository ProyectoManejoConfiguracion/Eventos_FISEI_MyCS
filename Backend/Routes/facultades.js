const express = require('express');
const router = express.Router();
const facultadesController = require('../Controllers/facultadesController');

router.get('/', facultadesController.getAll);
router.get('/:id', facultadesController.getOne);
router.post('/', facultadesController.create);
router.put('/:id', facultadesController.update);
router.delete('/:id', facultadesController.delete);

module.exports = router;
