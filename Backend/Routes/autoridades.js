const express = require('express');
const router = express.Router();
const autoridadesController = require('../Controllers/autoridadesController');

router.get('/', autoridadesController.getAll);
router.get('/:id', autoridadesController.getOne);
router.post('/', autoridadesController.create);
router.put('/:id', autoridadesController.update);
router.delete('/:id', autoridadesController.delete);

module.exports = router;
