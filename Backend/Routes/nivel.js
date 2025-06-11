const express = require('express');
const router = express.Router();
const nivelController = require('../Controllers/nivelController');

router.get('/:idCarrera', nivelController.getNivelesPorCarrera);
router.get('/', nivelController.getAll);
router.get('/:id', nivelController.getOne);
router.post('/', nivelController.create);
router.put('/:id', nivelController.update);
router.delete('/:id', nivelController.delete);

module.exports = router;
