const express = require('express');
const router = express.Router();
const estudiantesController = require('../Controllers/estudiantesController');

router.get('/', estudiantesController.getAll);
router.get('/:id', estudiantesController.getOne);
router.post('/', estudiantesController.create);
router.put('/:id', estudiantesController.update);
router.delete('/:id', estudiantesController.delete);

module.exports = router;
